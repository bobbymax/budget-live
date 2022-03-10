/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../../../services/classes/Alert";
import { collection, fetch, store } from "../../../services/utils/controllers";
import {
  formatCurrency,
  getPaymentType,
  userHasRole,
} from "../../../services/utils/helpers";

const Approvals = (props) => {
  const auth = useSelector((state) => state.auth.value.user);

  const initialState = {
    batch_code: "",
    batch: null,
    expenditure: null,
    batch_id: 0,
    expenditure_id: 0,
    description: "",
    beneficiary: "",
    amount: 0,
    modification: 0,
    previousTotal: 0,
    grandTotal: 0,
    status: "",
    isUpdating: false,
    showDetails: false,
  };

  const [state, setState] = useState(initialState);

  const fetchPaymentBatch = (e) => {
    e.preventDefault();

    if (state.batch_code !== "") {
      collection("batches/" + state.batch_code)
        .then((res) => {
          const data = res.data.data;
          setState({
            ...state,
            batch: data,
            batch_id: data.id,
            batch_code: "",
            showDetails: true,
            grandTotal: parseFloat(data.amount),
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleExpenditureUpdate = (e) => {
    e.preventDefault();

    const data = {
      amount: state.amount,
    };
  };

  const getBatches = () => {
    collection("batches")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const fetchExpenditureSubBudgetHead = (batch) => {
    return batch.expenditures[0].subBudgetHead.budgetCode;
  };

  const fetchExpenditureSubBudgetHeadDesc = (batch) => {
    return batch.expenditures[0].subBudgetHead.description;
  };

  const modifyExpenditure = (exp) => {
    setState({
      ...state,
      expenditure: exp,
      expenditure_id: exp.id,
      description: exp.description,
      beneficiary: exp.beneficiary,
      amount: exp.amount,
      previousTotal: exp.amount,
      isUpdating: true,
    });
  };

  const handlePaymentAction = (status) => {
    const data = {
      batchId: state.batch_id,
      work_flow: "budget-payment-process",
      level: state.batch.level,
      description: state.description,
      status: status,
    };

    // console.log(status);

    store("clear/payments", data)
      .then((res) => {
        const data = res.data;
        Alert.success("Payment Status!!", data.message);
        console.log(data.data);
      })
      .catch((err) => console.log(err));

    setState(initialState);
  };

  const handleClearQuery = (batch) => {
    const id = batch && batch.id;

    fetch("batches/clear/query", id)
      .then((res) => {
        const data = res.data.data;

        setState({
          ...state,
          batch: data,
          batch_id: data.id,
          grandTotal: parseFloat(data.amount),
        });
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    if (state.batch && state.batch !== null && !state.showDetails) {
      setState({
        ...state,
        batch: state.batch,
        batch_id: state.batch.id,
        grandTotal: parseFloat(state.batch.amount),
      });
    }
  }, [state.batch, state.showDetails]);

  return (
    <>
      <h4 className="mb-4">Approve Payments</h4>

      <form onSubmit={fetchPaymentBatch}>
        <div className="row">
          <div className="col-md-12">
            <input
              className="form-control"
              type="text"
              placeholder="ENTER BATCH NUMBER"
              value={state.batch_code}
              onChange={(e) =>
                setState({ ...state, batch_code: e.target.value })
              }
            />
          </div>
        </div>
      </form>

      {/* <button className="btn btn-primary" onClick={getBatches}>
        Get Batch
      </button> */}

      <div className={"payments-container mt-4"}>
        {state.expenditure !== null && state.isUpdating ? (
          <form onSubmit={handleExpenditureUpdate}>
            <div className="card card-invoice mb-3">
              <div className="card-header">
                <div>
                  <h5 className="mg-b-3">Expenditure</h5>
                </div>

                <div className="btn-group-invoice">
                  <button
                    className="btn btn-white btn-uppercase btn-sm"
                    type="button"
                    onClick={() => {
                      setState({
                        ...state,
                        expenditure: null,
                        expenditure_id: 0,
                        description: "",
                        beneficiary: "",
                        amount: 0,
                        isUpdating: false,
                      });
                    }}
                  >
                    <i className="fa fa-close"></i>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success btn-sm btn-uppercase"
                  >
                    <div className="fa fa-pen"></div>
                    Update Expenditure
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-8">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Expenditure Title"
                      value={state.beneficiary}
                      onChange={(e) =>
                        setState({ ...state, beneficiary: e.target.value })
                      }
                      readOnly
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Amount"
                      value={state.amount}
                      onChange={(e) =>
                        setState({ ...state, amount: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <input
                      className="form-control"
                      as="textarea"
                      rows={2}
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : null}

        {state.batch && state.showDetails ? (
          <div className="card">
            <div className="card-header">
              <div>
                <h5 className="mg-b-3">
                  {state.batch !== ""
                    ? getPaymentType(state.batch.batch_no)
                    : ""}
                </h5>

                <span className="text-muted">
                  {state.batch && state.batch.controller
                    ? `Expenditure raised by ${
                        state.batch.controller.name
                      } on ${moment(state.batch.created_at).format("LL")}`
                    : ""}
                </span>
              </div>

              <div className="btn-group btn-rounded">
                {state.batch &&
                state.batch.steps === 3 &&
                state.batch.editable === 1 &&
                userHasRole(auth, "audit-officer") ? (
                  <>
                    {state.batch.queried && (
                      <button
                        type="button"
                        className="btn btn-primary btn-uppercase btn-sm"
                        onClick={() => handleClearQuery(state.batch)}
                      >
                        Clear Query
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-danger btn-uppercase btn-sm"
                      disabled={
                        state.status === "approved" ||
                        state.expenditure !== null ||
                        state.description === "" ||
                        state.batch.queried
                      }
                      onClick={() => {
                        setState({ ...state, status: "queried" });
                        handlePaymentAction("queried");
                      }}
                    >
                      Query
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  className="btn btn-success btn-sm btn-uppercase"
                  disabled={
                    state.status === "queried" ||
                    state.expenditure !== null ||
                    state.batch.status === "paid"
                  }
                  onClick={() => {
                    setState({ ...state, status: "approved" });
                    handlePaymentAction("approved");
                  }}
                >
                  <i className="fa fa-send mr-2"></i>
                  {state.batch && state.batch.steps === 4
                    ? "Post"
                    : "Clear"}{" "}
                  Payment
                </button>
              </div>
            </div>

            <div className="card-body table-responsive">
              <div className="row">
                <div className="col-sm-6">
                  <label className="content-label text-success">
                    Billed From
                  </label>

                  <h6 className="tx-15 mg-b-10 text-muted">
                    {state.batch && state.batch.expenditures
                      ? fetchExpenditureSubBudgetHead(state.batch)
                      : ""}
                  </h6>
                </div>

                <div className="col-sm-6 tx-right d-none d-md-block">
                  <label className="content-label text-muted">
                    Batch Number
                  </label>

                  <h2 className="tx-normal tx-gray-400 mg-b-10 tx-spacing--2 text-success">
                    {state.batch ? state.batch.batch_no : ""}
                  </h2>
                </div>
              </div>

              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    {state.batch &&
                    state.batch.editable === 1 &&
                    state.batch.steps >= 2 &&
                    userHasRole(auth, "treasury-officer") ? (
                      <th>Modify</th>
                    ) : null}
                    <th className="wd-40p d-none d-sm-table-cell">
                      Description
                    </th>

                    <th className="tx-center">Beneficiary</th>
                    <th className="tx-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {state.batch && state.batch.expenditures
                    ? state.batch.expenditures.map((exp) => {
                        return (
                          <tr key={exp.id}>
                            {state.batch &&
                            state.batch.editable === 1 &&
                            state.batch.steps >= 2 &&
                            userHasRole(auth, "treasury-officer") ? (
                              <td>
                                <button
                                  className="btn btn-warning btn-sm btn-rounded"
                                  type="button"
                                  onClick={() => modifyExpenditure(exp)}
                                >
                                  <i className="fa fa-edit text-white"></i>
                                </button>
                              </td>
                            ) : null}

                            <td>{exp.description}</td>
                            <td className="tx-center">{exp.beneficiary}</td>
                            <td className="tx-right">{exp.amount}</td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>

              <div className="row justify-content-between mg-t-25">
                <div className="col-sm-6 order-2 order-sm-0 mg-t-40 mg-sm-t-0">
                  {state.batch &&
                  state.batch.steps === 3 &&
                  state.batch.editable === 1 &&
                  userHasRole(auth, "audit-officer") ? (
                    <>
                      <label className="content-label mg-b-10">Action</label>
                      <div className="row">
                        <div className="col-md-12">
                          <textarea
                            className="form-control"
                            placeholder="Enter Description"
                            value={state.description}
                            onChange={(e) =>
                              setState({
                                ...state,
                                description: e.target.value,
                              })
                            }
                            rows={4}
                          ></textarea>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="col-sm-6 order-1 order-sm-0">
                  <ul className="list-unstyled lh-7 pd-r-10">
                    {state.expenditure !== null ? (
                      <>
                        <li className="d-flex justify-content-between">
                          <span>Expenditure Amount</span>
                          <span>NGN {state.previousTotal}</span>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span>Alteration</span>
                          <span>NGN {state.amount - state.previousTotal}</span>
                        </li>
                      </>
                    ) : null}
                    <li className="d-flex justify-content-between">
                      <strong>TOTAL DUE</strong>
                      <strong>{formatCurrency(state.grandTotal)}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Approvals;
