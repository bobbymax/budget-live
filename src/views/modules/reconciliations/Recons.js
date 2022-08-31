import React, { useEffect, useState } from "react";
import DataTables from "../../../components/DataTables";
import { collection } from "../../../services/utils/controllers";
import { columns } from "../../../resources/columns";
import { CSVLink } from "react-csv";
import { exportable } from "../../../resources/exportable";

const Recons = () => {
  const [reconciliations, setReconciliations] = useState([]);

  useEffect(() => {
    try {
      collection("reconciliations")
        .then((res) => setReconciliations(res.data.data))
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <CSVLink
          className="mb-4 btn btn-dark btn-rounded float-right"
          data={reconciliations}
          headers={exportable.recons}
        >
          <i className="fa fa-download mr-2"></i>
          Export to CSV
        </CSVLink>
      </div>
      <DataTables pillars={columns.recons} rows={reconciliations} />
    </div>
  );
};

export default Recons;
