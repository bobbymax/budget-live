import React, { useState } from "react";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import TextInputField from "../../../components/forms/TextInputField";
import { store } from "../../../services/utils/controllers";

const Alterations = () => {
  const initialState = {
    type: "",
    code: "",
  };

  const [state, setState] = useState(initialState);
  const [data, setData] = useState(undefined);

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      type: state.type,
      code: state.code,
    };

    try {
      store("display/fix/payments", body)
        .then((res) => {
          const response = res.data.data;
          setData(response);
        })
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3">
            <CustomSelect
              label="TYPE"
              value={state.type}
              onChange={(e) => setState({ ...state, type: e.target.value })}
            >
              <CustomSelectOptions value="" label="Select Type" disabled />
              {[
                { key: "retirement", label: "Retirement" },
                { key: "claims", label: "Claims" },
                { key: "expenditures", label: "Expenditures" },
                { key: "batch", label: "Batch" },
              ].map((typ, i) => (
                <CustomSelectOptions
                  key={i}
                  label={typ?.label}
                  value={typ?.key}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-9">
            <TextInputField
              label="SEARCH"
              placeholder="ENTER QUERY HERE"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
              required
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default Alterations;
