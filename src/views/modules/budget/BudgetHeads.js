import React, { useEffect, useState } from "react";
import Loading from "../../../components/commons/Loading";
import BasicTable from "../../../components/commons/tables/BasicTable";
import { collection } from "../../../services/utils/controllers";

const BudgetHeads = () => {
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [{ label: "Name", key: "name" }];

  useEffect(() => {
    try {
      collection("budgetHeads")
        .then((res) => {
          setLoading(false);
          setBudgetHeads(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(budgetHeads);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <div className="col-md-12">
          <div className="page-titles">
            <button className="btn btn-success">
              <i className="fa fa-plus"></i> Import Budget Heads
            </button>
          </div>
        </div>

        <div className="col-md-12">
          <BasicTable
            page="Budget Heads"
            columns={columns}
            rows={budgetHeads}
          />
        </div>
      </div>
    </>
  );
};

export default BudgetHeads;
