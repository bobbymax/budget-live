/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../components/commons/Loading";
import { batchRequests, collection } from "../../../services/utils/controllers";

const ReportManagement = () => {
  const year = useSelector((state) => parseInt(state.config.value.budget_year));
  const [funds, setFunds] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [budgetYear, setBudgetYear] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("ALL");
  const [loading, setLoading] = useState(false);

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
              const fundsForYear = funds.filter(
                (fund) => fund.budget_year == budgetYear
              );
              setFunds(fundsForYear);
              setExpenditures(getExpenditures(fundsForYear));
              setLoading(false);
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

  // console.log(department);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <h2>Header</h2>
      </div>
    </>
  );
};

export default ReportManagement;
