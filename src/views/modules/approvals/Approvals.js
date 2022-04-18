/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../components/commons/Loading";
import Alert from "../../../services/classes/Alert";
import {
  alter,
  collection,
  fetch,
  store,
} from "../../../services/utils/controllers";
import {
  approvals,
  formatCurrency,
  getPaymentType,
  userHasRole,
} from "../../../services/utils/helpers";
import CryptoJS from "crypto-js";

const Approvals = (props) => {
  const auth = useSelector((state) => state.auth.value.user);
  const budgetYear = useSelector((state) =>
    parseInt(state.config.value.budget_year)
  );

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
  const [approvalStage, setApprovalStage] = useState({});
  const [batches, setBatches] = useState();
  const [loading, setLoading] = useState(false);

  const fetchPaymentBatch = (e) => {
    e.preventDefault();

    if (state.batch_code !== "") {
      const batch = batches.filter(
        (batc) => batc.batch_no === state.batch_code
      );

      // console.log(batch[0]);

      const stage = approvals.filter(
        (approval) =>
          approval.stage === batch[0].level && approval.level == batch[0].steps
      );

      setApprovalStage(stage[0]);

      setState({
        ...state,
        batch: batch[0],
        batch_id: batch[0].id,
        batch_code: "",
        showDetails: true,
        grandTotal: parseFloat(batch[0].amount),
      });
    }
  };

  const getStageStatus = () => {
    const batch = state.batch;
    const trac =
      batch !== null && batch.tracks.filter((trk) => trk.stage === batch.level);
    const track = trac[0];

    const steps = batch !== undefined && batch.steps;
    const level = batch !== undefined && batch.level;

    return steps == 4 && level === "treasury" ? "pending" : track.status;
  };

  const handleExpenditureUpdate = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      expenditure_id: state.expenditure_id,
      amount: state.amount,
    };

    try {
      alter("batches", state.batch_id, data)
        .then((res) => {
          const result = res.data;
          setState({
            ...state,
            batch: result.data,
            batch_id: result.data.id,
            showDetails: true,
            grandTotal: parseFloat(result.data.amount),
            expenditure: null,
            expenditure_id: 0,
            description: "",
            beneficiary: "",
            amount: 0,
            previousTotal: 0,
            isUpdating: false,
          });
          setLoading(false);
          Alert.success("Updated!!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
          Alert.success("Oops!!", "Something has gone wrong!!");
        });
    } catch (error) {
      console.log(error);
    }

    console.log(data);
  };

  useEffect(() => {
    setLoading(true);
    try {
      collection("batches")
        .then((res) => {
          const result = res.data.data;
          setBatches(
            result.filter(
              (batch) =>
                (batch.status !== "paid" || batch.status !== "archived") &&
                moment(batch.created_at).year() == budgetYear
            )
          );
          setLoading(false);
          // console.log(result);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(auth, approvalStage);

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

    try {
      store("clear/payments", data)
        .then((res) => {
          const data = res.data;
          setBatches(
            batches.map((batch) => {
              if (batch.id == data.data.id) {
                return data.data;
              }

              return batch;
            })
          );
          Alert.success("Payment Status!!", data.message);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }

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

  // console.log(getStageStatus());

  return (
    <>
      {loading ? <Loading /> : null}
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

      <div className={"payments-container mt-4"}>
        {state.expenditure !== null && state.isUpdating ? (
          <form onSubmit={handleExpenditureUpdate}>
            <div className="card card-invoice mb-3">
              <div className="card-header">
                <div>
                  <h5 className="mg-b-3">Expenditure</h5>
                </div>

                <div className="btn-group btn-rounded">
                  <button
                    className="btn btn-danger btn-uppercase btn-sm"
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
                    <i className="fa fa-close mr-2"></i>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success btn-sm btn-uppercase"
                  >
                    <div className="fa fa-send mr-2"></div>
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
                approvalStage !== undefined &&
                userHasRole(auth, approvalStage.role) ? (
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
                        state.expenditure !== null ||
                        state.description === "" ||
                        state.batch.queried
                      }
                      onClick={() => {
                        setState({ ...state, status: "queried" });
                        handlePaymentAction("queried");
                      }}
                    >
                      <i className="fa fa-question mr-2"></i>
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
                    state.batch.status === "paid" ||
                    state.description !== "" ||
                    (approvalStage !== undefined &&
                      userHasRole(auth, approvalStage.role) === false)
                  }
                  onClick={() => {
                    setState({ ...state, status: "approved" });
                    handlePaymentAction("approved");
                  }}
                >
                  <i className="fa fa-send mr-2"></i>
                  {approvalStage !== undefined && approvalStage.action} Payment
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
                    {approvalStage !== undefined &&
                    approvalStage.canModify &&
                    userHasRole(auth, approvalStage.role) ? (
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
                            {approvalStage !== undefined &&
                            approvalStage.canModify &&
                            userHasRole(auth, approvalStage.role) ? (
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
                            <td className="tx-right">
                              {formatCurrency(exp.amount)}
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>

              <div className="row justify-content-between mg-t-25">
                <div className="col-sm-6 order-2 order-sm-0 mg-t-40 mg-sm-t-0">
                  {approvalStage !== undefined &&
                  approvalStage.canQuery &&
                  userHasRole(auth, approvalStage.role) ? (
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
