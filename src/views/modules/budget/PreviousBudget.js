/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { collection } from "../../../services/utils/controllers";
import { formatCurrencyWithoutSymbol } from "../../../services/utils/helpers";
import { CSVLink } from "react-csv";
import Loading from "../../../components/commons/Loading";
import TableCard from "../../../components/commons/tables/customized/TableCard";

const PreviousBudget = () => {
  const initialState = {
    approvedAmount: 0,
    actualExpenditure: 0,
    bookedExpenditure: 0,
    actualBalance: 0,
    bookedBalance: 0,
  };

  // const year = useSelector((state) => parseInt(state.config.value.budget_year));
  const [state, setState] = useState(initialState);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [sub, setSub] = useState({});
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "beneficiary", label: "Beneficiary" },
    { key: "amount", label: "Amount" },
    { key: "description", label: "Description" },
    { key: "beneficiary", label: "Beneficiary" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Date" },
  ];

  const columnsExport = [
    { label: "BATCH NO.", key: "batch_no" },
    { label: "BUDGET CODE", key: "subBudgetHeadCode" },
    { label: "BENEFICIARY", key: "beneficiary" },
    { label: "DESCRIPTION", key: "description" },
    { label: "AMOUNT", key: "amount" },
    { label: "PAYMENT TYPE", key: "payment_type" },
    { label: "STATUS", key: "status" },
    { label: "DATE", key: "created_at" },
  ];

  const fillOptions = (arr) => {
    let newObj = [];
    arr?.map((a) =>
      newObj.push({
        value: a.id,
        label: a.budgetCode,
      })
    );
    return newObj;
  };

  const handleChange = (e) => {
    setSub(e);

    const subBudgetHead = subBudgetHeads.filter(
      (head) => head.budgetCode === e.label
    )[0];

    setState({
      ...state,
      approvedAmount: subBudgetHead?.approved_amount,
      actualExpenditure: subBudgetHead?.actual_expenditure,
      actualBalance: subBudgetHead?.actual_balance,
      bookedExpenditure: subBudgetHead?.booked_expenditure,
      bookedBalance: subBudgetHead?.booked_balance,
    });

    setExpenditures(subBudgetHead?.expenditures);

    // console.log(subBudgetHead);
  };

  useEffect(() => {
    try {
      setLoading(true);

      collection("subBudgetHeads")
        .then((res) => {
          setLoading(false);
          setSubBudgetHeads(res.data.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <Select
              styles={{ height: "100%" }}
              value={sub}
              components={makeAnimated()}
              isLoading={loading}
              options={fillOptions(subBudgetHeads)}
              placeholder="Select Department"
              onChange={handleChange}
              isSearchable
            />
          </div>
        </div>
        <div className="col-md-3">
          <CSVLink
            className="btn btn-success btn-rounded float-right"
            data={expenditures}
            headers={columnsExport}
            filename="Expenditure Breakdown"
            onClick={() => expenditures}
            disabled={expenditures.length < 1}
          >
            <i className="fa fa-download mr-2"></i>
            Print Expenditures
          </CSVLink>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <ul
              style={{ fontSize: 11, textTransform: "uppercase" }}
              className="list-group list-group-flush"
            >
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Approved Amount :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.approvedAmount)}
                </strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Booked Expenditure :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.bookedExpenditure)}
                </strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Booked Balance :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.bookedBalance)}
                </strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Actual Expenditure :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.actualExpenditure)}
                </strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Actual Balance :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.actualBalance)}
                </strong>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="row">
            <TableCard columns={columns} rows={expenditures} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviousBudget;
