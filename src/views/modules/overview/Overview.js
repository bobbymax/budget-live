/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { formatCurrency, userHasRole } from "../../../services/utils/helpers";
import { useNavigate } from "react-router-dom";
import { collection } from "../../../services/utils/controllers";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import Loading from "../../../components/commons/Loading";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CustomTable from "../../../components/commons/tables/customized/CustomTable";
import { columns } from "../../../resources/columns";

const Overview = (props) => {
  const navigate = useNavigate();

  const initialState = {
    approvedAmount: 0,
    bookedExpenditure: 0,
    actualExpenditure: 0,
    bookedBalance: 0,
    actualBalance: 0,
  };

  const [state, setState] = useState(initialState);
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState(0);
  const [loading, setLoading] = useState(true);

  const auth = useSelector((state) => state.auth.value.user);

  const allowedRoles = [
    "ict-manager",
    "dfpm",
    "es",
    "fad-manager",
    "fad-admin",
    "budget-office-officer",
    "head-of-budget",
  ];

  const allowedRolesDownload = [
    "ict-manager",
    "dfpm",
    "es",
    "fad-manager",
    "fad-admin",
    "head-of-budget",
    "super-administrator",
  ];

  useEffect(() => {
    const id = auth.department_id;

    if (auth && auth.department_id > 0) {
      collection("departments/" + id + "/budget/summary")
        .then((res) => {
          setData(res.data.data);
          setDepartment(id);
          setLoading(false);
        })
        .catch((err) => console.log(err.message));
    }
  }, []);

  // console.log(data)

  useEffect(() => {
    collection("departments")
      .then((res) => {
        const result = res.data.data;

        if (
          auth.roles &&
          auth.roles.length > 0 &&
          auth.roles.some((role) => allowedRoles.includes(role.label))
        ) {
          setDepartments(result);
        } else if (userHasRole(auth, "budget-controller")) {
          setDepartments(
            result.filter((dept) => dept?.id == auth?.department_id)
          );
        } else if (userHasRole(auth, "budget-owner")) {
          setDepartments(result.filter((dept) => dept.budget_owner == auth.id));
        } else if (userHasRole(auth, "director")) {
          const children = result.filter(
            (dept) => dept.parentId == auth.department_id
          );
          setDepartments(children);
        } else {
          setDepartments(result);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const downloadExpenditures = () => {
    let exps = [];
    if (data.length > 0) {
      data.map((sub) =>
        sub?.expenditures?.map(
          (exp) => exp?.status !== "refunded" && exps.push(exp)
        )
      );
    }
    return exps;
  };

  const getTotal = (data, key) => {
    if (data.length == 0) return 0;

    return data
      .map((sub) => {
        return sub?.fund && parseFloat(sub?.fund[key]);
      })
      .reduce((sum, current) => sum + current, 0);
  };

  const handleChange = (e) => {
    const value = e.key;
    // console.log(value);
    if (value === "all") {
      setDepartment(value)
      setLoading(true)
      collection("all/departments/budget/summary")
      .then(res => {
        const response = res.data.data

        setData(response)
        setLoading(false)
      })
      .catch(err => {
        console.error(err.message)
        setLoading(false)
      })
    } else if (value > 0) {
      setDepartment(value);
      setLoading(true);
      collection("departments/" + value + "/budget/summary")
        .then((res) => {
          const depty = res.data.data;
          // console.log(depty);
          setData(depty);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    }
  };

  const filterOptions = (optionsArr, all = false) => {
    const arr = all ? [{key: "all", label: "All DDD's"}] : [];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.code });
      });
    return arr;
  };

  const expenditureHeaders = [
    { label: "BATCH NO.", key: "batch_no" },
    { label: "BUDGET CODE", key: "subBudgetHeadCode" },
    { label: "BENEFICIARY", key: "beneficiary" },
    { label: "DESCRIPTION", key: "description" },
    { label: "AMOUNT", key: "amount" },
    { label: "PAYMENT TYPE", key: "payment_type" },
    { label: "STATUS", key: "status" },
    { label: "DATE", key: "updated_at" },
  ];

  const handleViewBreakdown = (subBudgetHead) => {
    navigate(`/overview/${subBudgetHead.id}/expenditure`, {
      state: {
        subBudgetHead,
      },
    });
  };

  useEffect(() => {
    if (data?.length > 0) {
      setState({
        ...state,
        approvedAmount: getTotal(data, "approved_amount"),
        bookedExpenditure: getTotal(data, "booked_expenditure"),
        actualExpenditure: getTotal(data, "actual_expenditure"),
        bookedBalance: getTotal(data, "booked_balance"),
        actualBalance: getTotal(data, "actual_balance"),
      });
    } else {
      setState(initialState);
    }
  }, [data]);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <div className="col-md-9">
          <div className="page-titles">
            <h2>Overview</h2>
          </div>
        </div>
        {auth.roles.some((role) =>
          allowedRolesDownload.includes(role.label)
        ) && (
          <div className="col-md-3">
            <CSVLink
              className="btn btn-success btn-rounded float-right"
              data={downloadExpenditures()}
              headers={expenditureHeaders}
              filename="Expenditure Breakdown"
              onClick={() => downloadExpenditures()}
              disabled={data.length < 1}
            >
              <i className="fa fa-download mr-2"></i>
              Expenditures CSV
            </CSVLink>
          </div>
        )}

        <div className="col-md-12 mb-4">
          <p className="mb-0">Departments</p>
          <Select
            styles={{ height: "100%" }}
            components={makeAnimated()}
            isLoading={loading}
            options={filterOptions(departments, true)}
            placeholder="Select Department"
            onChange={handleChange}
            isSearchable
          />
        </div>

        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h3
                    style={{
                      color: "black",
                      fontSize: 10,
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Approved Amount
                  </h3>

                  <h6 style={{ fontSize: 18 }} className="text-black">
                    {data.length > 0
                      ? formatCurrency(state.approvedAmount)
                      : "NGN " + 0}
                  </h6>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-warning">
                <div className="card-body">
                  <h2
                    className="text-white font-w600"
                    style={{ fontSize: 10, textTransform: "uppercase" }}
                  >
                    Actual Expenditure
                  </h2>

                  <h5 style={{ fontSize: 18 }} className="text-white">
                    {data.length > 0
                      ? formatCurrency(state.actualExpenditure)
                      : "NGN " + 0}
                  </h5>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-primary">
                <div className="card-body">
                  <h2
                    style={{ fontSize: 10, textTransform: "uppercase" }}
                    className="text-white font-w600"
                  >
                    Actual Balance
                  </h2>

                  <h2 className="text-white" style={{ fontSize: 18 }}>
                    {data.length > 0
                      ? formatCurrency(state.actualBalance)
                      : "NGN " + 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <CustomTable
            columns={columns.overview}
            data={data}
            isSearchable
            breakdown={handleViewBreakdown}
            downloadable
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
