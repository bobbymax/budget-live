/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { batchRequests, collection } from "../../../services/utils/controllers";
import axios from "axios";
import { formatCurrencyWithoutSymbol } from "../../../services/utils/helpers";
import Loading from "../../../components/commons/Loading";

const PreviousBudget = () => {
  const initialState = {
    budgetYear: 0,
    department: "",
    approvedAmount: 0,
    actualExpenditure: 0,
    actualBalance: 0,
  };

  const year = useSelector((state) => parseInt(state.config.value.budget_year));
  const [departments, setDepartments] = useState([]);
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleDepartmentSelect = (e) => {
    setState({
      ...state,
      department: e.key,
    });
  };

  const departmentOptions = (optionsArr) => {
    const arr = [{ key: "ALL", label: "ALL DDD" }];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.code, label: el.code });
      });
    return arr;
  };

  // eslint-disable-next-line no-unused-vars
  const fetchFundsForDDD = (departments, budgetYear) => {
    const expenses = [];
    const funds = [];

    departments.length > 0 &&
      departments.map(
        (dept) =>
          dept.funds &&
          dept.funds.length > 0 &&
          dept.funds.map(
            (fund) => fund.budget_year == budgetYear && expenses.push(fund)
          )
      );
    expenses.map(
      (fund) =>
        fund.expenditures &&
        fund.expenditures.length > 0 &&
        fund.expenditures.map((exp) => exp.status === "paid" && funds.push(exp))
    );

    return {
      approved: expenses
        .map((exp) => parseFloat(exp.approved_amount))
        .reduce((sum, prev) => sum + prev, 0),
      balance: expenses
        .map((exp) => parseFloat(exp.actual_balance))
        .reduce((sum, prev) => sum + prev, 0),
      expenditures: funds
        .map((fund) => parseFloat(fund.amount))
        .reduce((sum, prev) => sum + prev, 0),
    };
  };

  // eslint-disable-next-line no-unused-vars
  const fetchDepartmentFunds = (department, budgetYear) => {
    const funds = [];
    const expenditures = [];

    department &&
      department.funds &&
      department.funds.length > 0 &&
      department.funds.map(
        (fund) => fund.budget_year == budgetYear && funds.push(fund)
      );
    funds.map((fund) =>
      fund.expenditures.map(
        (exp) => exp.status === "paid" && expenditures.push(exp)
      )
    );

    // console.log(department);
    return {
      approved: funds
        .map((exp) => parseFloat(exp.approved_amount))
        .reduce((sum, prev) => sum + prev, 0),
      balance: funds
        .map((exp) => parseFloat(exp.actual_balance))
        .reduce((sum, prev) => sum + prev, 0),
      expenditures: expenditures
        .map((fund) => parseFloat(fund.amount))
        .reduce((sum, prev) => sum + prev, 0),
    };
  };

  // eslint-disable-next-line no-unused-vars
  const getFunds = (department, budgetYear) => {
    const dept =
      department !== "ALL"
        ? departments.filter((dept) => dept.code === department)
        : null;

    // console.log(dept !== null ? dept[0] : "ALL");

    return department === "ALL"
      ? fetchFundsForDDD(departments, budgetYear)
      : fetchDepartmentFunds(dept[0], budgetYear);
  };

  useEffect(() => {
    const fetched = getFunds(state.department, state.budgetYear);
    // console.log(fetched);
    setState({
      ...state,
      approvedAmount: fetched.approved,
      actualExpenditure: fetched.expenditures,
      actualBalance: fetched.balance,
    });
  }, [state.budgetYear, state.department]);

  useEffect(() => {
    try {
      setLoading(true);
      const departmentData = collection("departments");
      batchRequests([departmentData])
        .then(
          axios.spread((...res) => {
            const departments = res[0].data.data;
            setDepartments(departments);
            const fetched = fetchFundsForDDD(departments, year);

            setState({
              ...state,
              budgetYear: year,
              department: "ALL",
              approvedAmount: fetched.approved,
              actualExpenditure: fetched.expenditures,
              actualBalance: fetched.balance,
            });
            setLoading(false);
          })
        )
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  // console.log(state.department);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-3">
          <CustomSelect
            value={state.budgetYear}
            onChange={(e) => {
              setState({
                ...state,
                budgetYear: parseInt(e.target.value),
              });
            }}
          >
            <CustomSelectOptions
              label="SELECT BUDGET YEAR"
              value={0}
              disabled
            />

            {[2019, 2020, 2021, 2022].map((yr, i) => (
              <CustomSelectOptions key={i} value={yr} label={yr} />
            ))}
          </CustomSelect>
        </div>
        <div className="col-md-6">
          <div className="form-group">
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
        </div>
        <div className="col-md-3">
          <button
            type="button"
            className="btn btn-block btn-success btn-rounded"
          >
            <i className="fa fa-file-pdf-o mr-2"></i>
            PREPARE REPORT
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-5">
          <div className="card text-white bg-success">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Approved Amount :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.approvedAmount)}
                </strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Actual Expenditure :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.actualExpenditure)}
                </strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="mb-0">Actual Balance :</span>
                <strong>
                  {formatCurrencyWithoutSymbol(state.actualBalance)}
                </strong>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-9"></div>
      </div>
    </>
  );
};

export default PreviousBudget;
