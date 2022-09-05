/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
  batchRequests,
  collection,
  store,
} from "../../../services/utils/controllers";
import { CSVLink } from "react-csv";
import axios from "axios";
import DataTables from "../../../components/DataTables";
import { formatCurrency } from "../../../services/utils/helpers";
import Alert from "../../../services/classes/Alert";

const GetAllExpenditures = () => {
  const initialState = {
    approved: 0,
    actual: 0,
    booked: 0,
  };
  const [state, setState] = useState(initialState);
  const [expenditures, setExpenditures] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [report, setReport] = useState([]);

  const expenditureHeaders = [
    { label: "BATCH ID", key: "batch_id" },
    { label: "BUDGET HEAD ID", key: "sub_budget_head_id" },
    { label: "DEPARTMENT", key: "department" },
    { label: "BENEFICIARY", key: "beneficiary" },
    { label: "DESCRIPTION", key: "description" },
    { label: "AMOUNT", key: "amount" },
    { label: "PAYMENT TYPE", key: "payment_type" },
    { label: "STATUS", key: "status" },
    { label: "DATE", key: "updated_at" },
  ];

  const heads = [
    {
      Header: "Name",
      accessor: "subBudgetHeadName",
    },
    {
      Header: "Budget Code",
      accessor: "subBudgetHeadCode",
    },
    {
      Header: "Approved Amount",
      accessor: "approved",
    },
    {
      Header: "Actual Expenditure",
      accessor: "actual",
    },
    {
      Header: "Booked Expenditure",
      accessor: "booked",
    },
  ];

  const updateFunds = () => {
    const data = {
      reports: report,
    };

    try {
      store("fix/issues", data)
        .then((res) => {
          const result = res.data;
          Alert.success("Success!!", result.message);
        })
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (expenditures?.length > 0 && subBudgetHeads?.length > 0) {
      const data = [];
      subBudgetHeads?.map((sub) => {
        const exps = expenditures?.filter(
          (exp) => exp.sub_budget_head_id == sub.id
        );
        const paid = exps.filter((exp) => exp.status === "paid");
        const actual = paid
          .map((exp) => parseFloat(exp?.amount))
          .reduce((sum, prev) => sum + prev, 0);
        const booked = exps
          .map((exp) => parseFloat(exp?.amount))
          .reduce((sum, prev) => sum + prev, 0);
        return data.push({
          subBudgetHeadName: sub?.name,
          subBudgetHeadCode: sub?.budgetCode,
          sub_budget_head_id: sub?.id,
          approved: sub?.fund?.approved_amount,
          actual,
          booked,
        });
      });

      const approved = subBudgetHeads
        ?.map((sub) => parseFloat(sub?.fund?.approved_amount))
        .reduce((sum, prev) => sum + prev, 0);

      setState({
        ...state,
        approved: formatCurrency(approved),
      });

      setReport(data);
    }
  }, [expenditures, subBudgetHeads]);

  useEffect(() => {
    try {
      const exps = collection("expenditures/all");
      const subs = collection("subBudgetHeads/all");
      batchRequests([exps, subs])
        .then(
          axios.spread((...res) => {
            setExpenditures(res[0].data.data);
            setSubBudgetHeads(res[1].data.data);
          })
        )
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(subBudgetHeads);
  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-primary btn-rounded"
            onClick={() => updateFunds()}
          >
            Update Funds
          </button>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <CSVLink
          className={
            expenditures?.length > 0
              ? "btn btn-success btn-rounded btn-md float-right"
              : "btn btn-success btn-rounded btn-md disabled float-right"
          }
          data={expenditures}
          headers={expenditureHeaders}
          filename="Budget Overview"
        >
          <i className="fa fa-download mr-2"></i> Download CSV
        </CSVLink>
      </div>

      <div className="col-md-12 mb-2">
        <div className="amount-card">{state.approved}</div>
      </div>

      <DataTables pillars={heads} rows={report} />
    </div>
  );
};

export default GetAllExpenditures;
