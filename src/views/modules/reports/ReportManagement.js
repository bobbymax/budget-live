/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../components/commons/Loading";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { batchRequests, collection } from "../../../services/utils/controllers";
import "./reports.css";
import { formatCurrencyWithoutSymbol } from "../../../services/utils/helpers";

const ReportManagement = () => {
  const initialState = {
    approvedAmount: 0,
    expectedExpenditures: 0,
    actualExpenditures: 0,
    bookedBalance: 0,
    actualBalance: 0,
    expectedPerformance: 0,
    actualPerformance: 0,
  };
  const year = useSelector((state) => parseInt(state.config.value.budget_year));
  const [state, setState] = useState(initialState);
  const [funds, setFunds] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [budgetYear, setBudgetYear] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const cards = [
    {
      title: "Booked Expenditures",
      amount: state.expectedExpenditures,
      type: "currency",
    },
    {
      title: "Actual Expenditures",
      amount: state.actualExpenditures,
      type: "currency",
    },
    {
      title: "Booked Balance",
      amount: state.bookedBalance,
      type: "currency",
    },
    {
      title: "Actual Balance",
      amount: state.actualBalance,
      type: "currency",
    },
    {
      title: "Expected Performace",
      amount: state.expectedPerformance,
      type: "percentage",
    },
    {
      title: "Actual Performance",
      amount: state.actualPerformance,
      type: "percentage",
    },
  ];

  const handleDepartmentSelect = (e) => {
    // setState({
    //   ...state,
    //   department: e.key,
    // });
    setDepartment(e.key);
  };

  const departmentOptions = (optionsArr) => {
    const arr = [{ key: "ALL", label: "ALL DDD" }];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.code, label: el.code });
      });
    return arr;
  };

  const getExpenditures = (funds) => {
    const exps = [];

    funds.length > 0 &&
      funds.map(
        (fund) =>
          fund.expenditures.length > 0 &&
          fund.expenditures.map((expenses) => exps.push(expenses))
      );

    return exps;
  };

  useEffect(() => {
    if (budgetYear > 0 && department !== "") {
      try {
        setLoading(true);
        const fundsData = collection("fetch/creditBudgetHeads");

        batchRequests([fundsData])
          .then(
            axios.spread((...res) => {
              const funds = res[0].data.data;
              let fundsForYear = funds.filter(
                (fund) => fund.budget_year == budgetYear
              );

              fundsForYear =
                department !== "ALL"
                  ? fundsForYear.filter(
                      (fund) => fund.budget_owner === department
                    )
                  : fundsForYear;

              console.log(fundsForYear);

              const exps = getExpenditures(fundsForYear);

              const approved = fundsForYear
                .map((fund) => parseFloat(fund.approved_amount))
                .reduce((sum, prev) => sum + prev, 0);
              const booked = fundsForYear
                .map((fund) => parseFloat(fund.booked_expenditure))
                .reduce((sum, prev) => sum + prev, 0);
              const actual = fundsForYear
                .map((fund) => parseFloat(fund.actual_expenditure))
                .reduce((sum, prev) => sum + prev, 0);

              const expPerf = (booked / approved) * 100;
              const actPerf = (actual / approved) * 100;

              setFunds(fundsForYear);
              setExpenditures(exps);
              setLoading(false);

              setState({
                ...state,
                approvedAmount: approved,
                expectedExpenditures: booked,
                actualExpenditures: actual,
                bookedBalance: fundsForYear
                  .map((fund) => parseFloat(fund.booked_balance))
                  .reduce((sum, prev) => sum + prev, 0),
                actualBalance: fundsForYear
                  .map((fund) => parseFloat(fund.actual_balance))
                  .reduce((sum, prev) => sum + prev, 0),
                expectedPerformance: expPerf.toFixed(2),
                actualPerformance: actPerf.toFixed(2),
              });
            })
          )
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [budgetYear, department]);

  useEffect(() => {
    if (year > 0) {
      setBudgetYear(year);
    }
  }, [year]);

  useEffect(() => {
    try {
      collection("departments")
        .then((res) => {
          const result = res.data.data;
          setDepartments(
            result.filter(
              (dept) => dept.subBudgetHeads && dept.subBudgetHeads.length > 0
            )
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">GENERATE REPORT</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <CustomSelect
                    value={budgetYear}
                    onChange={(e) => setBudgetYear(parseInt(e.target.value))}
                    additionalClasses="form-control-xs"
                  >
                    <CustomSelectOptions
                      value={0}
                      label="SELECT BUDGET YEAR"
                      disabled
                    />

                    {[2019, 2020, 2021, 2022].map((year, i) => (
                      <CustomSelectOptions key={i} value={year} label={year} />
                    ))}
                  </CustomSelect>
                </div>
                <div className="col-md-6">
                  <Select
                    styles={{ height: "100%" }}
                    defaultValue={{ key: "ALL", label: "ALL DDD" }}
                    components={makeAnimated()}
                    isLoading={loading}
                    options={departmentOptions(departments)}
                    placeholder="Select Department"
                    onChange={handleDepartmentSelect}
                    isSearchable
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-success btn-block btn-rounded"
                    type="button"
                  >
                    <i className="fa fa-file-pdf-o mr-2"></i>
                    CONFIGURE REPORT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card-section">
            <div className="row">
              <div className="col-md-12 mb-4">
                <div className="approved-section">
                  <h5>Approved Budget</h5>
                  <p>{formatCurrencyWithoutSymbol(state.approvedAmount)}</p>
                </div>
              </div>

              {cards.map((card, i) => (
                <div key={i} className="col-md-4 mb-3">
                  <div className="sm-card-report">
                    <h4>{card.title}</h4>
                    <p>
                      {card.type === "currency"
                        ? formatCurrencyWithoutSymbol(card.amount)
                        : card.amount + "%"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportManagement;
