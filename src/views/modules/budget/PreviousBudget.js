import React, { useState } from "react";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";

const PreviousBudget = () => {
  const [budgetYear, setBudgetYear] = useState(0);

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <CustomSelect
            value={budgetYear}
            onChange={(e) => setBudgetYear(e.target.value)}
          >
            <CustomSelectOptions />
          </CustomSelect>
        </div>
      </div>
    </>
  );
};

export default PreviousBudget;
