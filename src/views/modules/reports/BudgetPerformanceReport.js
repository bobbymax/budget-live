/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../../components/commons/Loading";
import { batchRequests, collection } from "../../../services/utils/controllers";
import "../../../components/commons/cards/custom-card.css";
import { formatCurrencyWithoutSymbol } from "../../../services/utils/helpers";
import PieChart from "../../../components/charts/PieChart";
import TableCard from "../../../components/commons/tables/customized/TableCard";
import moment from "moment";

const BudgetPerformanceReport = () => {
  const initialState = {
    totalApprovedBudget: 0,
    totalCommitment: 0,
    actualBalance: 0,
    totalPerformance: 0,
    capexApprovedBudget: 0,
    capexCommitment: 0,
    capexBalance: 0,
    capexPerformance: 0,
    recurrentApprovedBudget: 0,
    recurrentCommitment: 0,
    recurrentBalance: 0,
    recurrentPerformance: 0,
    personnelApprovedBudget: 0,
    personnelCommitment: 0,
    personnelBalance: 0,
    personnelPerformance: 0,
  };
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [funds, setFunds] = useState([]);
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "title", label: "Budget Head Title" },
    { key: "approved", label: "Approved Budget", format: "currency" },
    { key: "commitment", label: "Commitment", format: "currency" },
    { key: "balance", label: "Balance", format: "currency" },
    { key: "performance", label: "% Performance", format: "percent" },
  ];

  const columns2 = [
    { key: "owner", label: "Budget Owner" },
    { key: "approved", label: "Approved Budget", format: "currency" },
    { key: "commitment", label: "Commitment", format: "currency" },
    { key: "balance", label: "Balance", format: "currency" },
    { key: "performance", label: "% Performance", format: "percent" },
  ];

  const getTotal = (funds, type, key) => {
    if (funds?.length < 1) return 0;
    const newFunds = funds.filter((fund) => fund?.budget_type === type);

    return newFunds
      ?.map((fund) => parseFloat(fund[key]))
      .reduce((sum, prev) => sum + prev, 0);
  };

  const calcPerformance = (funds, type) => {
    if (funds?.length < 1) return 0;
    const newFunds = funds.filter((fund) => fund?.budget_type === type);
    const totalApproved = newFunds
      ?.map((fund) => parseFloat(fund?.approved_amount))
      .reduce((sum, prev) => sum + prev, 0);
    const totalExpenditure = newFunds
      ?.map((fund) => parseFloat(fund?.actual_expenditure))
      .reduce((sum, prev) => sum + prev, 0);

    return (totalExpenditure / totalApproved) * 100;
  };

  const budgetHeadPerformance = () => {
    if (budgetHeads?.length < 1 || funds?.length < 1) return [];

    let performance = [];

    budgetHeads.map((head) => {
      const analysis = funds.filter((fund) => fund?.budgetHeadId == head.id);
      const totalAnalysis = analysis
        .map((ana) => parseFloat(ana?.approved_amount))
        .reduce((sum, prev) => sum + prev, 0);

      const totalExpenditure = analysis
        .map((ana) => parseFloat(ana?.actual_expenditure))
        .reduce((sum, prev) => sum + prev, 0);

      const totalBalance = analysis
        .map((ana) => parseFloat(ana?.actual_balance))
        .reduce((sum, prev) => sum + prev, 0);

      return performance.push({
        title: head.name,
        approved: totalAnalysis,
        commitment: totalExpenditure,
        balance: totalBalance,
        performance: (totalExpenditure / totalAnalysis) * 100,
      });
    });

    return performance.filter((perf) => perf?.approved > 0);
  };

  const departmentBudgetPerformance = () => {
    if (departments?.length < 1 || funds?.length < 1) return [];

    let performance = [];

    departments.map((dept) => {
      const deptFunds = funds.filter((fund) => fund?.department === dept?.code);
      const totalApproved = deptFunds
        .map((fund) => parseFloat(fund?.approved_amount))
        .reduce((sum, prev) => sum + prev, 0);
      const totalExpenditure = deptFunds
        .map((fund) => parseFloat(fund?.actual_expenditure))
        .reduce((sum, prev) => sum + prev, 0);

      const totalBalance = deptFunds
        .map((fund) => parseFloat(fund?.actual_balance))
        .reduce((sum, prev) => sum + prev, 0);

      return performance.push({
        owner: dept.code,
        approved: totalApproved,
        commitment: totalExpenditure,
        balance: totalBalance,
        performance: (totalExpenditure / totalApproved) * 100,
      });
    });

    return performance.filter((perf) => perf.approved > 0);
  };

  useEffect(() => {
    setLoading(true);
    try {
      const budgetHeadsData = collection("budgetHeads");
      const departmentsData = collection("departments");
      const fundsData = collection("creditBudgetHeads");

      batchRequests([budgetHeadsData, departmentsData, fundsData])
        .then(
          axios.spread((...res) => {
            const heads = res[0].data.data;
            const depts = res[1].data.data;
            const allocations = res[2].data.data;

            const totalApproved = allocations
              .map((fund) => parseFloat(fund?.approved_amount))
              .reduce((sum, prev) => sum + prev, 0);

            const totalBalance = allocations
              .map((fund) => parseFloat(fund?.actual_balance))
              .reduce((sum, prev) => sum + prev, 0);

            const totalExpenditure = allocations
              .map((fund) => parseFloat(fund?.actual_expenditure))
              .reduce((sum, prev) => sum + prev, 0);

            const performance = (totalExpenditure / totalApproved) * 100;

            setBudgetHeads(heads);
            setDepartments(
              depts.filter((dept) => dept?.subBudgetHeads?.length > 0)
            );
            setFunds(allocations);
            setState({
              ...state,
              totalApprovedBudget: totalApproved,
              totalCommitment: totalExpenditure,
              actualBalance: totalBalance,
              totalPerformance: performance,
              capexApprovedBudget: getTotal(
                allocations,
                "capital",
                "approved_amount"
              ),
              capexCommitment: getTotal(
                allocations,
                "capital",
                "actual_expenditure"
              ),
              capexBalance: getTotal(allocations, "capital", "actual_balance"),
              capexPerformance: calcPerformance(allocations, "capital"),
              recurrentApprovedBudget: getTotal(
                allocations,
                "recursive",
                "approved_amount"
              ),
              recurrentCommitment: getTotal(
                allocations,
                "recursive",
                "actual_expenditure"
              ),
              recurrentBalance: getTotal(
                allocations,
                "recursive",
                "actual_balance"
              ),
              recurrentPerformance: calcPerformance(allocations, "recursive"),
              personnelApprovedBudget: getTotal(
                allocations,
                "personnel",
                "approved_amount"
              ),
              personnelCommitment: getTotal(
                allocations,
                "personnel",
                "actual_expenditure"
              ),
              personnelBalance: getTotal(
                allocations,
                "personnel",
                "actual_balance"
              ),
              personnelPerformance: calcPerformance(allocations, "personnel"),
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

  //   console.log(funds);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-12">
          <h3 className="title">
            Budget Performance as at{" "}
            {moment().format("MMMM Do YYYY, h:mm:ss a")}
          </h3>
          <br />
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-md-3">
              <div className="perf-cards perf-cards__primary">
                <h6 className="perf-cards__title">Total Approved Budget</h6>
                <p>{formatCurrencyWithoutSymbol(state.totalApprovedBudget)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__danger">
                <h6 className="perf-cards__title">Total Commitment</h6>
                <p>{formatCurrencyWithoutSymbol(state.totalCommitment)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__info">
                <h6 className="perf-cards__title">Balance</h6>
                <p>{formatCurrencyWithoutSymbol(state.actualBalance)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__warning">
                <h6 className="perf-cards__title">% Performance</h6>
                <p>{state.totalPerformance?.toFixed(2) + "%"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="row">
            <div className="col-md-6">
              <PieChart
                title="Approved Budget Distribution by Category"
                figure={{
                  capex: state.capexApprovedBudget,
                  recurrent: state.recurrentApprovedBudget,
                  personnel: state.personnelApprovedBudget,
                }}
              />
            </div>
            <div className="col-md-6">
              <PieChart
                title="Expenditure by Budget Category"
                figure={{
                  capex: state.capexCommitment,
                  recurrent: state.recurrentCommitment,
                  personnel: state.personnelCommitment,
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="perf-cards perf-cards__primary">
                <h6 className="perf-cards__title">Capex Budget</h6>
                <p>{formatCurrencyWithoutSymbol(state.capexApprovedBudget)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__danger">
                <h6 className="perf-cards__title">Capex Expenditure</h6>
                <p>{formatCurrencyWithoutSymbol(state.capexCommitment)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__info">
                <h6 className="perf-cards__title">Capex Balance</h6>
                <p>{formatCurrencyWithoutSymbol(state.capexBalance)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__warning">
                <h6 className="perf-cards__title">Capex Performance</h6>
                <p>{state.capexPerformance?.toFixed(2) + "%"}</p>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="perf-cards perf-cards__primary">
                <h6 className="perf-cards__title">Recurrent Budget</h6>
                <p>
                  {formatCurrencyWithoutSymbol(state.recurrentApprovedBudget)}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__danger">
                <h6 className="perf-cards__title">Recurrent Expenditure</h6>
                <p>{formatCurrencyWithoutSymbol(state.recurrentCommitment)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__info">
                <h6 className="perf-cards__title">Recurrent Balance</h6>
                <p>{formatCurrencyWithoutSymbol(state.recurrentBalance)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__warning">
                <h6 className="perf-cards__title">Recurrent Performance</h6>
                <p>{state.recurrentPerformance?.toFixed(2) + "%"}</p>
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-md-3">
              <div className="perf-cards perf-cards__primary">
                <h6 className="perf-cards__title">Personnel Budget</h6>
                <p>
                  {formatCurrencyWithoutSymbol(state.personnelApprovedBudget)}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__danger">
                <h6 className="perf-cards__title">Personnel Expenditure</h6>
                <p>{formatCurrencyWithoutSymbol(state.personnelCommitment)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__info">
                <h6 className="perf-cards__title">Personnel Balance</h6>
                <p>{formatCurrencyWithoutSymbol(state.personnelBalance)}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="perf-cards perf-cards__warning">
                <h6 className="perf-cards__title">Personnel Performance</h6>
                <p>{state.personnelPerformance?.toFixed(2) + "%"}</p>
              </div>
            </div>
          </div>
        </div>

        <TableCard columns={columns} rows={budgetHeadPerformance()} />

        <TableCard columns={columns2} rows={departmentBudgetPerformance()} />
      </div>
    </>
  );
};

export default BudgetPerformanceReport;
