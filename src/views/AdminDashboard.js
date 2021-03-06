/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { batchRequests, collection } from "../services/utils/controllers";
import { formatCurrencyWithoutSymbol } from "../services/utils/helpers";
import { CSVLink } from "react-csv";
import "./modules/dashboard.css";
import Loading from "../components/commons/Loading";

const AdminDashboard = () => {
  const initialState = {
    totalBudgetAllocation: 0,
    totalExpendituresRaised: 0,
    totalAmountClearedByBudgetOffice: 0,
    totalAmountClearedByTreasury: 0,
    totalAmountClearedByAudit: 0,
  };
  const budgetYear = useSelector((state) =>
    parseInt(state.config.value.budget_year)
  );
  const [subs, setSubs] = useState([]);
  const [downloadable, setDownloadable] = useState([]);
  const [exps, setExps] = useState([]);
  const [trackings, setTrackings] = useState([]);
  const [state, setState] = useState(initialState);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const headers = [
    { key: "budgetHead", label: "BUDGET HEAD" },
    { key: "budgetCode", label: "CODE" },
    { key: "sub_budget_head_name", label: "DESCRIPTION" },
    { key: "approved_amount", label: "APPROVED AMOUNT" },
    { key: "department", label: "BO" },
    { key: "expected_performance", label: "EXPECTED PERFORMANCE" },
    { key: "actual_peformance", label: "ACTUAL PERFORMANCE" },
  ];

  const getGrandTotal = (collective, value) => {
    if (collective.length < 1) {
      return 0;
    }
    return collective
      .map((entity) => parseFloat(entity[value]))
      .reduce((sum, prev) => sum + prev, 0);
  };

  useEffect(() => {
    try {
      setLoading(true);
      const subBudgetHeadsData = collection("subBudgetHeads/admin");
      const expendituresData = collection("dashboard/expenditures");
      const trackingData = collection("trackings");

      batchRequests([subBudgetHeadsData, expendituresData, trackingData])
        .then(
          axios.spread((...res) => {
            const subs = res[0].data.data;
            const exps = res[1].data.data;
            const tracks = res[2].data.data;
            const reviewed = exps.filter(
              (ex) => moment(ex.created_at).year() == budgetYear
            );
            const current = tracks.filter(
              (track) => moment(track.created_at).year() == budgetYear
            );
            const budget = current.filter(
              (track) =>
                track.stage === "budget-office" &&
                track.status === "cleared" &&
                track.cleared == 1
            );

            const treasury = current.filter(
              (track) =>
                track.stage === "treasury" &&
                track.status === "cleared" &&
                track.cleared == 1
            );

            const audit = current.filter(
              (track) =>
                track.stage === "audit" &&
                track.status === "cleared" &&
                track.cleared == 1
            );
            setTrackings(current);
            setSubs(subs);
            setExps(reviewed);
            setState({
              ...state,
              totalBudgetAllocation: getGrandTotal(subs, "approved_amount"),
              totalExpendituresRaised: getGrandTotal(reviewed, "amount"),
              totalAmountClearedByBudgetOffice: getGrandTotal(budget, "amount"),
              totalAmountClearedByTreasury: getGrandTotal(treasury, "amount"),
              totalAmountClearedByAudit: getGrandTotal(audit, "amount"),
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
  }, []);

  // console.log(subs);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="form-head d-md-flex mb-sm-4 mb-3 align-items-start">
        <div className="mr-auto  d-lg-block">
          <h2 className="text-black font-w600 mb-4">
            {"Admin Dashboard".toUpperCase()}
          </h2>
          <CSVLink
            data={subs}
            filename={"budget-overview.csv"}
            target="_blank"
            headers={headers}
            className="btn btn-warning btn-rounded"
          >
            <i className="fa fa-download mr-2"></i>
            DOWNLOAD GENERAL OVERVIEW
          </CSVLink>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
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
                    {"Total Allocated Budget For ".toUpperCase() + budgetYear}
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
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="dash-media">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-white">
                    <span>NGN</span>
                    {formatCurrencyWithoutSymbol(state.totalExpendituresRaised)}
                  </h3>
                </div>
                <div className="col-md-12">
                  <p className="text-warning">
                    {"Total Expenditures Raised".toUpperCase()}
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
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="dash-media">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-white">
                    <span>NGN</span>
                    {formatCurrencyWithoutSymbol(
                      state.totalAmountClearedByBudgetOffice
                    )}
                  </h3>
                </div>
                <div className="col-md-12">
                  <p className="text-warning">
                    {"Total Expenditures Cleared by Budget".toUpperCase()}
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
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="dash-media">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-white">
                    <span>NGN</span>
                    {formatCurrencyWithoutSymbol(
                      state.totalAmountClearedByTreasury
                    )}
                  </h3>
                </div>
                <div className="col-md-12">
                  <p className="text-warning">
                    {"Total Expenditures Cleared by Treasury".toUpperCase()}
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
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="dash-media">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-white">
                    <span>NGN</span>
                    {formatCurrencyWithoutSymbol(
                      state.totalAmountClearedByAudit
                    )}
                  </h3>
                </div>
                <div className="col-md-12">
                  <p className="text-warning">
                    {"Total Expenditures Cleared by Audit".toUpperCase()}
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
