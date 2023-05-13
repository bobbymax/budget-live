/* eslint-disable no-unused-vars */
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
import {
  batchRequests,
  collection,
  store,
} from "../../../services/utils/controllers";
import "./reports.css";
import {
  formatCurrencyWithoutSymbol,
  generateMonthlyReport,
  generateReportForPeriod,
  getBudgetSummation,
} from "../../../services/utils/helpers";
import { months } from "../../../services/utils/helpers";
import TextInputField from "../../../components/forms/input/TextInputField";
import moment from "moment";
import LineChart from "../../../components/charts/LineChart";
import Alert from "../../../services/classes/Alert";

const ReportManagement = () => {
  const initialState = {
    approvedAmount: 0,
    expectedExpenditures: 0,
    actualExpenditures: 0,
    bookedBalance: 0,
    actualBalance: 0,
    expectedPerformance: 0,
    actualPerformance: 0,
    capexApprovedAmount: 0,
    capexCommittment: 0,
    capexBalance: 0,
    capexPerformance: 0,
    recurrentApprovedAmount: 0,
    recurrentCommittment: 0,
    recurrentBalance: 0,
    recurrentPerformance: 0,
    personnelApprovedAmount: 0,
    personnelCommittment: 0,
    personnelBalance: 0,
    personnelPerformance: 0,
    startDate: "",
    endDate: "",
  };
  const year = useSelector((state) => parseInt(state.config.value.budget_year));
  const [state, setState] = useState(initialState);
  const [budgetYear, setBudgetYear] = useState(0);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [funds, setFunds] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [department, setDepartment] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("");
  const [report, setReport] = useState([]);

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

  const categories = [
    {
      title: "Capex Amount",
      amount: state.capexApprovedAmount,
      type: "currency",
      background: "primary",
    },
    {
      title: "Capex Committment",
      amount: state.capexCommittment,
      type: "currency",
      background: "primary",
    },
    {
      title: "Capex Balance",
      amount: state.capexBalance,
      type: "currency",
      background: "primary",
    },
    {
      title: "Capex Performance",
      amount: state.capexPerformance,
      type: "percentage",
      background: "primary",
    },
    {
      title: "Recurrent Amount",
      amount: state.recurrentApprovedAmount,
      type: "currency",
      background: "warning",
    },
    {
      title: "Recurrent Committment",
      amount: state.recurrentCommittment,
      type: "currency",
      background: "warning",
    },
    {
      title: "Recurrent Balance",
      amount: state.recurrentBalance,
      type: "currency",
      background: "warning",
    },
    {
      title: "Recurrent Performance",
      amount: state.recurrentPerformance,
      type: "percentage",
      background: "warning",
    },
    {
      title: "Personnel Amount",
      amount: state.personnelApprovedAmount,
      type: "currency",
      background: "danger",
    },
    {
      title: "Personnel Committment",
      amount: state.personnelCommittment,
      type: "currency",
      background: "danger",
    },
    {
      title: "Personnel Balance",
      amount: state.personnelBalance,
      type: "currency",
      background: "danger",
    },
    {
      title: "Personnel Performance",
      amount: state.personnelPerformance,
      type: "percentage",
      background: "danger",
    },
  ];

  const handleDepartmentSelect = (e) => {
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

  const handleReportGeneration = () => {
    const reportData = report;
    const data = {
      period,
      reports: report,
      breakdowns: [
        {
          description: "Capex",
          amount: state.capexApprovedAmount,
          balance: state.capexBalance,
          commitment: state.capexCommittment,
          performance: state.capexPerformance,
        },
        {
          description: "Recurrent",
          amount: state.recurrentApprovedAmount,
          balance: state.recurrentBalance,
          commitment: state.recurrentCommittment,
          performance: state.recurrentPerformance,
        },
        {
          description: "Personnel",
          amount: state.personnelApprovedAmount,
          balance: state.personnelBalance,
          commitment: state.personnelCommittment,
          performance: state.personnelPerformance,
        },
      ],
      total: reportData
        .map((rep) => parseFloat(rep?.totalApproved))
        .reduce((sum, prev) => sum + prev, 0),
    };

    setLoading(true);

    try {
      store("generate/monthly/report", data)
        .then((res) => {
          const link = document.createElement("a");
          link.href = res.data.data;
          link.setAttribute("download", res.data.data);
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          setLoading(false);
          Alert.success("Printed!!", "Document printed successfully!!");
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMonthly = (month) => {
    const monthly =
      funds &&
      funds.filter((fund) => moment(fund.updated_at).format("MMMM") === month);

    const booked = monthly
      .map((fund) => parseFloat(fund.booked_expenditure))
      .reduce((sum, prev) => sum + prev, 0);

    const actual = monthly
      .map((fund) => parseFloat(fund.actual_expenditure))
      .reduce((sum, prev) => sum + prev, 0);

    return {
      booked: parseFloat(booked.toFixed(2)),
      actual: parseFloat(actual.toFixed(2)),
    };
  };

  const chartReport = (mnt) => {
    // loop through months
    let figures = [];
    const selections =
      mnt !== "all" ? months.long.filter((mnth) => mnth === mnt) : months.long;
    selections.map((month) => figures.push(fetchMonthly(month)));
    return figures;
  };

  useEffect(() => {
    if (funds?.length > 0 && period !== "" && Array.isArray(expenditures)) {
      const d = new Date(period);
      let fundsForYear = funds?.filter(
        (fund) => fund?.budget_year == budgetYear
      );

      fundsForYear =
        department !== "ALL"
          ? fundsForYear.filter((fund) => fund?.budget_owner === department)
          : fundsForYear;

      const computed = generateReportForPeriod(
        fundsForYear,
        period,
        expenditures
      );
      // const exps = getExpenditures(computed);
      const budgetSummary = getBudgetSummation(computed);

      // setExpenditures(exps);

      if (budgetHeads?.length > 0) {
        setReport(generateMonthlyReport(computed, budgetHeads, period));
      }

      setState({
        ...state,
        approvedAmount: budgetSummary?.approved,
        expectedExpenditures: budgetSummary?.booked,
        actualExpenditures: budgetSummary?.actual,
        bookedBalance: budgetSummary?.bookedBalance,
        actualBalance: budgetSummary?.actualBalance,
        capexApprovedAmount: budgetSummary?.capex?.cApproved,
        capexCommittment: budgetSummary?.capex?.cBooked,
        capexBalance: budgetSummary?.capex?.balance,
        capexPerformance: budgetSummary?.capex?.cPerformance,
        recurrentApprovedAmount: budgetSummary?.recurrent?.rApproved,
        recurrentCommittment: budgetSummary?.recurrent?.rBooked,
        recurrentBalance: budgetSummary?.recurrent?.balance,
        recurrentPerformance: budgetSummary?.recurrent?.rPerformance,
        personnelApprovedAmount: budgetSummary?.personnel?.pApproved,
        personnelCommittment: budgetSummary?.personnel?.pBooked,
        personnelBalance: budgetSummary?.personnel?.balance,
        personnelPerformance: budgetSummary?.personnel?.pPerformance,
        expectedPerformance: budgetSummary?.ePerformance,
        actualPerformance: budgetSummary?.aPerformance,
      });
    }
  }, [funds, expenditures, department, period]);

  useEffect(() => {
    try {
      setLoading(true);
      const departmentData = collection("departments");
      const budgetHeadsData = collection("budgetHeads");
      const fundsData = collection("creditBudgetHeads");
      const expendituresData = collection("fetch/expenditures/all");

      batchRequests([
        departmentData,
        budgetHeadsData,
        fundsData,
        expendituresData,
      ])
        .then(
          axios.spread((...res) => {
            const d = new Date();
            setDepartments(res[0].data.data);
            setBudgetHeads(res[1].data.data);
            setFunds(res[2].data.data);
            setExpenditures(res[3].data.data);
            setPeriod(moment(d).format("YYYY-MM-DD"));
            setBudgetYear(year ?? 0);
            setLoading(false);
          })
        )
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(report);

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
                {/* <div className="col-md-3">
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
                </div> */}
                <div className="col-md-5">
                  <TextInputField
                    type="date"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  />
                </div>
                <div className="col-md-7">
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
                <div className="col-md-12 mt-3">
                  <button
                    className="btn btn-success btn-block btn-rounded"
                    type="button"
                    // disabled={state.startDate === "" || state.endDate === ""}
                    disabled={loading}
                    onClick={() => handleReportGeneration()}
                  >
                    <i className="fa fa-file-pdf-o mr-2"></i>
                    GENERATE REPORT
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
                        : card?.amount?.toFixed(2) + "%"}
                    </p>
                  </div>
                </div>
              ))}

              {categories.map((cat, i) => (
                <div className="col-md-3 mb-3" key={i}>
                  <div className={`sm-card-report bg-${cat.background}`}>
                    <h4>{cat.title}</h4>
                    <p>
                      {cat.type === "currency"
                        ? formatCurrencyWithoutSymbol(cat.amount)
                        : cat.amount + "%"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header align-items-center border-0 pb-0">
              <div className="row">
                <div className="col-md-9">
                  <h3 className="fs-20 text-black">Monthly Actual Expenses</h3>
                </div>
                <div className="col-md-3">
                  <CustomSelect
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <CustomSelectOptions label="ALL" value="all" />
                    {months.long.map((month, i) => (
                      <CustomSelectOptions
                        key={i}
                        label={month}
                        value={month}
                      />
                    ))}
                  </CustomSelect>
                </div>
              </div>
            </div>
            <div className="card-body pb-0 pt-0">
              <div className="d-flex align-items-center mb-3">
                <LineChart
                  month={selectedMonth}
                  dataset={chartReport(selectedMonth)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportManagement;
