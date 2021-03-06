/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { formatCurrency, userHasRole } from "../../../services/utils/helpers";
import { useNavigate } from "react-router-dom";
import { collection } from "../../../services/utils/controllers";
import DataTableComponent from "../../../components/commons/tables/DataTableComponent";
import CustomSelect from "../../../components/forms/CustomSelect";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import Loading from "../../../components/commons/Loading";

const columns = [
  {
    label: "Budget Code",
    key: "budgetCode",
  },
  {
    label: "Budget",
    key: "name",
  },
  {
    label: "Approved Amount",
    key: "approved_amount",
    format: "currency",
  },
  {
    label: "Booked Expenditure",
    key: "booked_expenditure",
    format: "currency",
  },
  {
    label: "Actual Expenditure",
    key: "actual_expenditure",
    format: "currency",
  },
  {
    label: "Booked Balance",
    key: "booked_balance",
    format: "currency",
  },
  {
    label: "Actual Balance",
    key: "actual_balance",
    format: "currency",
  },
  {
    label: "Expected Performace",
    key: "expected_performance",
  },
  {
    label: "Actual Performance",
    key: "actual_performance",
  },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState(0);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
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

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (term !== "") {
      const newFiltered = data.filter((row) => {
        return Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      setResults(newFiltered);
    } else {
      setResults(data);
    }
  };

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

  useEffect(() => {
    collection("departments")
      .then((res) => {
        const result = res.data.data;

        const newDepts = result.filter(
          (dept) => dept.subBudgetHeads && dept.subBudgetHeads.length > 0
        );

        if (
          auth.roles &&
          auth.roles.length > 0 &&
          auth.roles.some((role) => allowedRoles.includes(role.label))
        ) {
          setDepartments(newDepts);
        } else if (userHasRole(auth, "budget-controller")) {
          setDepartments(
            newDepts.filter((dept) => dept.id == auth.department_id)
          );
        } else if (userHasRole(auth, "budget-owner")) {
          setDepartments(
            newDepts.filter((dept) => dept.budget_owner == auth.id)
          );
        } else {
          setDepartments(newDepts);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // eslint-disable-next-line no-unused-vars
  const downloadExpenditures = () => {
    let exps = [];
    if (data.length > 0) {
      data.map((sub) => sub.expenditures && exps.push(...sub.expenditures));
    }

    // console.log(exps);
    return exps;
  };

  const getTotal = (data, key) => {
    if (data.length == 0) {
      return 0;
    }

    return data
      .map((sub) => {
        return sub.fund && parseFloat(sub.fund[key]);
      })
      .reduce((sum, current) => sum + current, 0);
  };

  const handleChange = (value) => {
    if (value > 0) {
      collection("departments/" + value + "/budget/summary")
        .then((res) => {
          const depty = res.data.data;
          // console.log(depty);
          setData(depty);
        })
        .catch((err) => console.log(err.message));
    }
  };

  // console.log(department);

  const filterOptions = (optionsArr) => {
    const arr = [];
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

  const headers = [
    { label: "Budget Head Id", key: "budget_head_id" },
    { label: "Department Code", key: "department_code" },
    { label: "Budget Code", key: "budgetCode" },
    { label: "Name", key: "name" },
    { label: "Logistics Budget", key: "logisticsBudget" },
    { label: "Approved Amount", key: "approved_amount" },
    {
      label: "Booked Expenditure",
      key: "booked_expenditure",
    },
    {
      label: "Actual Expenditure",
      key: "actual_expenditure",
    },
    { label: "Booked Balance", key: "booked_balance" },
    { label: "Actual Balance", key: "actual_balance" },
    { label: "Expected Performance", key: "expected_performance" },
    { label: "Actual Performance", key: "actual_performance" },
  ];

  const handleViewBreakdown = (subBudgetHead) => {
    navigate(`/overview/${subBudgetHead.id}/expenditure`, {
      state: {
        subBudgetHead,
      },
    });
  };

  useEffect(() => {
    if (data.length > 0) {
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

        <div className="col-md-12">
          <CustomSelect
            options={filterOptions(departments)}
            defaultText="Select Department"
            label="Departments"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              handleChange(e.target.value);
            }}
            disabled={departments.length == 1}
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
          <DataTableComponent
            pageName="Sub Budget Heads"
            columns={columns}
            rows={searchTerm.length < 1 ? data : results}
            term={searchTerm}
            downloadButton={
              <div className="pull-right">
                <CSVLink
                  className={
                    data && data.length > 0
                      ? "btn btn-success btn-md"
                      : "btn btn-success btn-md disabled"
                  }
                  data={data}
                  headers={headers}
                  filename="Budget Overview"
                >
                  <i className="fa fa-download"></i> Download CSV
                </CSVLink>
              </div>
            }
            action={handleViewBreakdown}
            searchKeyWord={handleSearch}
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
