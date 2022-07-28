/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import DoughnutChart from "../components/charts/DoughnutChart";
import BarChart from "../components/charts/BarChart";
import { batchRequests, collection } from "../services/utils/controllers";
import { Link } from "react-router-dom";
import { formatCurrency, userHasRole } from "../services/utils/helpers";
import BudgetController from "./controller/BudgetController";
import { useSelector } from "react-redux";
import axios from "axios";
import "../components/commons/cards/custom-card.css";
import Loading from "../components/commons/Loading";
// import { months } from "../services/utils/helpers";

const Dashboard = () => {
  const overviewState = {
    paymentForms: 0,
    thirdParty: 0,
    staffPayment: 0,
    aef: 0,
    logisticsRefund: 0,
    reversals: 0,
    pendingTransactions: 0,
    paidTransactions: 0,
    claims: 0,
    retirement: 0,
    overview: {},
    performance: {},
    summary: {},
  };

  const auth = useSelector((state) => state.auth.value.user);
  // const dash = useSelector((state) => state.auth.value.dashboardState);
  const [state, setState] = useState(overviewState);
  const [loading, setLoading] = useState(false);
  // const [dashboardState, setDashboardState] = useState(false);

  const allowedRoles = [
    "budget-controller",
    "super-administrator",
    "head-of-department",
    "ict-manager",
  ];

  useEffect(() => {
    if (auth !== null) {
      setLoading(true);
      const expenditureRequest = collection("expenditures");
      const claimsRequest = collection("department/claims");
      const overviews = collection("dashboard/overview");
      const fundsData = collection("creditBudgetHeads");

      try {
        batchRequests([expenditureRequest, claimsRequest, overviews, fundsData])
          .then(
            axios.spread((...res) => {
              const expenditures = res[0].data.data;
              const claims = res[1].data.data;
              const overview = res[2].data.data;
              const funds = res[3].data.data;
              const paymentForms = expenditures.filter(
                (exp) =>
                  exp && exp.subBudgetHead.department_id == auth.department_id
              );
              const aef = claims.filter(
                (claim) =>
                  claim &&
                  claim.owner.department_id == auth.department_id &&
                  (claim.status !== "pending" || claim.status !== "draft")
              );
              const personal = claims.filter(
                (claim) =>
                  claim &&
                  claim.owner.id == auth.id &&
                  claim.type !== "touring-advance"
              );
              const retirement = claims.filter(
                (claim) =>
                  claim.type === "touring-advance" &&
                  claim.owner.id == auth.id &&
                  !claim.rettired
              );

              const filtered = userHasRole(auth, "super-administrator")
                ? funds
                : funds.filter(
                    (fund) => auth?.department?.code === fund?.budget_owner
                  );

              const approved = filtered
                .map((fund) => parseFloat(fund.approved_amount))
                .reduce((sum, prev) => sum + prev, 0);

              const booked = filtered
                .map((fund) => parseFloat(fund.booked_expenditure))
                .reduce((sum, prev) => sum + prev, 0);

              const actual = filtered
                .map((fund) => parseFloat(fund.actual_expenditure))
                .reduce((sum, prev) => sum + prev, 0);

              const summary = {
                approvedAmount: approved,
                actualBalance: filtered
                  .map((fund) => parseFloat(fund.actual_balance))
                  .reduce((sum, prev) => sum + prev, 0),
                actualExpenditure: actual,
                bookedBalance: filtered
                  .map((fund) => parseFloat(fund.booked_balance))
                  .reduce((sum, prev) => sum + prev, 0),
                bookedExpenditure: booked,
                expectedPerformance: (booked / approved) * 100,
                actualPerformance: (actual / approved) * 100,
              };

              setState({
                ...state,
                aef: aef.length,
                claims: personal.length,
                retirement: retirement.length,
                paymentForms: paymentForms.length,
                thirdParty: paymentForms.filter(
                  (exp) => exp.payment_type === "third-party"
                ).length,
                staffPayment: paymentForms.filter(
                  (exp) => exp.payment_type === "staff-payment"
                ).length,
                pendingTransactions: paymentForms.filter(
                  (exp) => exp.status !== "paid"
                ).length,
                paidTransactions: paymentForms.filter(
                  (exp) => exp.status === "paid"
                ).length,
                overview: summary,
                performance: overview.performance,
                summary: summary,
              });

              setLoading(false);
            })
          )
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    return () => {
      setState(overviewState);
    };
  }, [auth]);

  const {
    approvedAmount,
    actualBalance,
    actualExpenditure,
    bookedBalance,
    bookedExpenditure,
    expectedPerformance,
    actualPerformance,
  } = state.summary;

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="form-head d-md-flex mb-sm-4 mb-3 align-items-start">
        <div className="mr-auto  d-lg-block">
          <h2 className="text-black font-w600">Dashboard</h2>
          <p className="mb-0">Welcome {auth !== null && auth.name}</p>
        </div>

        {auth &&
          auth.roles.some((role) =>
            [
              "super-administrator",
              "fad-admin",
              "ict-admin",
              "ict-manager",
            ].includes(role.label)
          ) && (
            <Link to="/import/dependencies" className="btn btn-primary rounded">
              <i className="flaticon-381-settings-2 mr-0"></i>
            </Link>
          )}
      </div>

      <div className="row">
        <div className="col-xl-12 col-xxl-12">
          <BudgetController userDashboardData={state} />
        </div>

        {auth && auth.roles.some((role) => allowedRoles.includes(role.label)) && (
          <>
            <div className="col-xl-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="card budget-box-shadow">
                    <div className="card-body">
                      <div className="media align-items-center">
                        <DoughnutChart
                          chartData={state.overview}
                          totalApproved={approvedAmount}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-8 col-lg-8">
                  <div className="card budget-box-shadow text-white bg-success">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span className="mb-0">Approved Amount :</span>
                        <strong>{formatCurrency(approvedAmount)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span className="mb-0">Booked Expenditure :</span>
                        <strong>{formatCurrency(bookedExpenditure)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span className="mb-0">Actual Expenditure :</span>
                        <strong>{formatCurrency(actualExpenditure)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span className="mb-0">Booked Balance :</span>
                        <strong>{formatCurrency(bookedBalance)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span className="mb-0">Actual Balance :</span>
                        <strong>{formatCurrency(actualBalance)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span className="mb-0">Expected Performance :</span>
                        <strong>
                          {parseFloat(expectedPerformance).toFixed(2) + "%"}
                        </strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span className="mb-0">Actual Performance :</span>
                        <strong>
                          {parseFloat(actualPerformance).toFixed(2) + "%"}
                        </strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-12 col-md-12 col-sm-12">
              <div className="card">
                <div className="card-header align-items-center border-0 pb-0">
                  <h3 className="fs-20 text-black">Monthly Expenses</h3>

                  {/* <Link className="btn btn-outline-primary rounded" to="#">
                    Download CSV
                  </Link> */}
                </div>

                <div className="card-body pb-0 pt-0">
                  <div className="d-flex align-items-center mb-3">
                    <BarChart
                      chartData={
                        state.performance !== undefined ? state.performance : {}
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
