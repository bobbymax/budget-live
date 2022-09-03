import React, { useEffect, useState } from "react";
import { collection } from "../../../services/utils/controllers";
import { CSVLink } from "react-csv";

const GetAllExpenditures = () => {
  const [expenditures, setExpenditures] = useState([]);

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

  useEffect(() => {
    try {
      collection("expenditures/all")
        .then((res) => setExpenditures(res.data.data))
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(expenditures);
  return (
    <div className="row">
      <div className="col-md-12">
        <CSVLink
          className={
            expenditures?.length > 0
              ? "btn btn-success btn-md"
              : "btn btn-success btn-md disabled"
          }
          data={expenditures}
          headers={expenditureHeaders}
          filename="Budget Overview"
        >
          <i className="fa fa-download"></i> Download CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default GetAllExpenditures;
