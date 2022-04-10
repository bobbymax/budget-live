/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  batchRequests,
  collection,
  store,
} from "../../../services/utils/controllers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import useApi from "../../../services/hooks/useApi";
import Alert from "../../../services/classes/Alert";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../../services/utils/helpers";
import Loading from "../../../components/commons/Loading";
import axios from "axios";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";

const Logistics = (props) => {
  const {
    data: logisticsData,
    setData: setLogisticsData,
    request,
    loading,
  } = useApi(collection);

  const initialState = {
    user_id: 0,
    budgetCode: "",
    beneficiary: "",
    sub_budget: "",
    description: "",
    department_id: 0,
    amount: 0,
    activeExp: false,
    sub_budget_head_id: 0,
  };

  const [departments, setDepartments] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [state, setState] = useState(initialState);
  const [open, setOpen] = useState(false);
  // const [fulfilled, setFulfilled] = useState(0);
  const auth = useSelector((state) => state.auth.value.user);

  const staffOptions = (optionsArr) => {
    const arr = [];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.name });
      });
    return arr;
  };

  const requestRefund = (e) => {
    e.preventDefault();

    const data = {
      sub_budget_head_id: state.sub_budget_head_id,
      budget_code: state.budgetCode,
      user_id: state.user_id,
      amount: state.amount,
      department_id: state.department_id,
      description: state.description,
      status: "pending",
    };

    store("logisticsRequests", data)
      .then((res) => {
        const result = res.data.data;

        setLogisticsData([result, ...logisticsData]);
        Alert.success("Created!!", res.data.message);

        setState(initialState);
        setOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const fulfillLogistic = (logistic) => {
    const closed = logistic.closed === "True" ? 0 : 1;

    store(`logisticsRequests/${logistic.id}/complete`, { closed }).then(
      (res) => {
        Alert.success("Logistic Fulfilled!!", res.data.message);
      }
    );
  };

  const handleStaffSelect = (e) => {
    // console.log(e.key);

    setState({
      ...state,
      user_id: e.key,
    });
  };

  useEffect(() => {
    try {
      const departmentData = collection("departments");
      const usersData = collection("users");
      const subBudgetHeadsData = collection("subBudgetHeads");

      batchRequests([departmentData, usersData, subBudgetHeadsData])
        .then(
          axios.spread((...res) => {
            const depts = res[0].data.data;
            const staff = res[1].data.data;
            const subs = res[2].data.data;

            setSubBudgetHeads(subs);
            setUsers(staff);
            setDepartments(depts);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    request("logisticsRequests");
  }, []);

  useEffect(() => {
    // console.log(subBudgetHeads);

    if (state.sub_budget_head_id > 0) {
      const single =
        subBudgetHeads.length > 0 &&
        subBudgetHeads.filter((sub) => sub.id == state.sub_budget_head_id);

      if (single.length > 0) {
        setState({
          ...state,
          budgetCode: single[0].budgetCode,
        });
      }
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (state.user_id > 0) {
      const user = users.filter((user) => user.id === state.user_id);

      // console.log(user[0]);

      setState({
        ...state,
        department_id: user[0].department_id,
      });
    }
  }, [state.user_id]);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-success btn-rounded"
              onClick={() => setOpen(!open)}
              disabled={open}
            >
              <i className="fa fa-plus-square mr-2"></i> Add Logistics
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={requestRefund}>
                  <div className="row">
                    <div className="col-md-12">
                      <CustomSelect
                        value={state.sub_budget_head_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            sub_budget_head_id: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="SELECT SUB BUDGET HEAD"
                          value={0}
                        />

                        {subBudgetHeads.length > 0 &&
                          subBudgetHeads.map((dept) => (
                            <CustomSelectOptions
                              key={dept.id}
                              label={dept.name.toUpperCase()}
                              value={dept.id}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="BUDGET CODE"
                          value={state.budgetCode}
                          onChange={(e) =>
                            setState({ ...state, budgetCode: e.target.value })
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <Select
                          styles={{ height: "40px" }}
                          components={makeAnimated()}
                          options={staffOptions(users)}
                          placeholder="Select Beneficiary"
                          // onChange={(selectedOption) => {
                          //   setState({
                          //     ...state,
                          //     user_id: selectedOption.key,
                          //   });
                          // }}
                          onChange={handleStaffSelect}
                          isSearchable
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <select
                          className="form-control"
                          value={state.department_id}
                          onChange={(e) =>
                            setState({
                              ...state,
                              department_id: e.target.value,
                            })
                          }
                        >
                          <option>SELECT DEPARTMENT</option>

                          {departments && departments.length > 0
                            ? departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                  {dept.name.toUpperCase()}
                                </option>
                              ))
                            : null}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="AMOUNT"
                          value={state.amount}
                          onChange={(e) =>
                            setState({ ...state, amount: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          rows={2}
                          type="text"
                          placeholder="EXPENDITURE DESCRIPTION"
                          value={state.description}
                          onChange={(e) =>
                            setState({ ...state, description: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="btn-group btn-rounded">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={
                            state.department_id === 0 ||
                            state.description === ""
                          }
                        >
                          <i className="fa fa-undo mr-2"></i> REQUEST REFUND
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setOpen(false);
                            setState(initialState);
                          }}
                          type="button"
                        >
                          <i className="fa fa-close mr-2"></i> CANCEL
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-12">
          <div className="card table-responsive">
            <div className="card-body">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Budget Code</th>
                    <th>Beneficiary</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Fulfilment</th>
                  </tr>
                </thead>

                <tbody>
                  {logisticsData && logisticsData.length > 0 ? (
                    logisticsData.map(
                      (logistic) =>
                        auth.id === logistic.controller_id && (
                          <tr key={logistic.id}>
                            <td>{logistic.subBudgetHead.budgetCode}</td>
                            <td>{logistic.beneficiary.name}</td>
                            <td>{logistic.description}</td>
                            <td>{formatCurrency(logistic.amount)}</td>
                            <td>{logistic.status}</td>
                            <td>
                              {logistic.closed === 1 ? (
                                <span className="badge bg-success text-white rounded-pill">
                                  Fulfilled
                                </span>
                              ) : (
                                <button
                                  className="btn btn-warning"
                                  onClick={() => fulfillLogistic(logistic)}
                                  disabled={logistic.closed === 1}
                                >
                                  <i
                                    className="fa fa-check-circle"
                                    style={{ color: "white !important" }}
                                  ></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                    )
                  ) : (
                    <>
                      {!loading && logisticsData.length <= 0 && (
                        <tr>
                          <td colSpan="6" className="text-danger">
                            NO DATA FOUND!!!
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logistics;
