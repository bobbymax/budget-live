/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { collection } from "../services/utils/controllers";
import { formatCurrencyWithoutSymbol } from "../services/utils/helpers";
import "./modules/dashboard.css";

const AdminDashboard = () => {
  const initialState = {
    totalBudgetAllocation: 0,
  };
  const [subs, setSubs] = useState([]);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    try {
      collection("subBudgetHeads/admin")
        .then((res) => {
          const result = res.data.data;
          setSubs(result);
          const total = result
            .map((sub) => parseFloat(sub.approved_amount))
            .reduce((sum, prev) => sum + prev, 0);
          setState({
            ...state,
            totalBudgetAllocation: total,
          });
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
    return () => setSubs([]);
  }, []);

  console.log(subs);
  return (
    <>
      <div className="form-head d-md-flex mb-sm-4 mb-3 align-items-start">
        <div className="mr-auto  d-lg-block">
          <h2 className="text-black font-w600">Admin Dashboard</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="dash-media">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-white">
                    <span>NGN</span>
                    {formatCurrencyWithoutSymbol(state.totalBudgetAllocation)}
                  </h3>
                </div>
                <div className="col-md-12">
                  <p className="text-warning">
                    {"Total Allocated Budget".toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <CustomCard
            count={formatCurrency(state.totalBudgetAllocation)}
            title="Total Allocated Budget"
          /> */}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
