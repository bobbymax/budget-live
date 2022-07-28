/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import TableCard from "../../../components/commons/tables/customized/TableCard";
import TextInputField from "../../../components/forms/input/TextInputField";
import { collection } from "../../../services/utils/controllers";
import { formatCurrency, search } from "../../../services/utils/helpers";
import "./drag.css";

const Beneficiaries = () => {
  const initialState = {
    beneficiary: "",
    totalReceived: 0,
  };
  const [state, setState] = useState(initialState);
  const [expenditures, setExpenditures] = useState([]);
  const [data, setData] = useState([]);

  const columns = [
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "beneficiary", label: "BENEFICIARY" },
    { key: "amount", label: "AMOUNT", format: "currency" },
    { key: "created_at", label: "RAISED AT" },
    { key: "status", label: "STATUS" },
  ];

  useEffect(() => {
    if (state.beneficiary !== "") {
      const result = search(state.beneficiary, expenditures);

      const totalReceived = result
        .map((exp) => parseFloat(exp?.amount))
        .reduce((sum, prev) => sum + prev, 0);

      setState({
        ...state,
        totalReceived,
      });

      setData(result);
    } else {
      setData([]);
      setState({
        ...state,
        totalReceived: 0,
      });
    }
  }, [state.beneficiary, expenditures]);

  useEffect(() => {
    try {
      collection("dashboard/expenditures")
        .then((res) => {
          const result = res.data.data;
          setExpenditures(result);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-7">
          <TextInputField
            label="SEARCH BENEFICIARY"
            placeholder="ENTER BENEFICIARY NAME HERE"
            value={state.beneficiary}
            onChange={(e) =>
              setState({ ...state, beneficiary: e.target.value })
            }
            required
          />
        </div>

        <div className="col-md-5">
          <div className="total__price-card">
            <p>TOTAL AMOUNT RECEIVED:</p>
            <h3>{formatCurrency(state.totalReceived)}</h3>
          </div>
        </div>

        <TableCard columns={columns} rows={data} />
      </div>
    </>
  );
};

export default Beneficiaries;
