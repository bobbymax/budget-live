/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../components/commons/Loading";
import Alert from "../../../services/classes/Alert";
import { alter, fetch, store } from "../../../services/utils/controllers";
import {
  approvals,
  formatCurrency,
  getPaymentType,
  userHasRole,
} from "../../../services/utils/helpers";
// import CryptoJS from "crypto-js";

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
  const [approvalStage, setApprovalStage] = useState({});
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(false);

  const canReverseStage = (stage) => {
    let status = false;

    switch (stage) {
      case "treasury":
        if (state.batch && state.batch.steps == 2) {
          status = userHasRole(auth, "budget-office-officer");
        } else {
          status =
            state.batch && state.batch.status === "paid"
              ? userHasRole(auth, "treasury")
              : userHasRole(auth, "audit");
        }
        break;

      case "audit":
        status = userHasRole(auth, "treasury");
        break;

      default:
        status = false;
        break;
    }

    return status;
  };

  const fetchPaymentBatch = (e) => {
    e.preventDefault();

    if (state.batch_code !== "") {
      setLoading(true);
      try {
        fetch("batches", state.batch_code)
          .then((res) => {
            const result = res.data;

            const stage = approvals.filter(
              (approval) =>
                approval.stage === result.data.level &&
                approval.level == result.data.steps
            );

            setApprovalStage(stage[0]);
            setTracking(result.data.tracks);
            setState({
              ...state,
              batch: result.data,
              batch_id: result.data.id,
              batch_code: "",
              showDetails: true,
              grandTotal: parseFloat(result.data.amount),
            });

            setLoading(false);
            Alert.success("Found!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
            Alert.error("Oops!", "Something has gone wrong");
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
        Alert.error("Oops!", "Something has gone terribly wrong");
      }
    }
  };

  const reverseStage = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You are about to revert back a stage!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          fetch("stage/reversals", data.id)
            .then((res) => {
              const result = res.data;
              const stage = approvals.filter(
                (approval) =>
                  approval.stage === result.data.level &&
                  approval.level == result.data.steps
              );

              setApprovalStage(stage[0]);
              setTracking(result.data.tracks);
              setState({
                ...state,
                batch: result.data,
                batch_id: result.data.id,
                batch_code: "",
                showDetails: true,
                grandTotal: parseFloat(result.data.amount),
              });

              setLoading(false);
              Alert.success("All Done!!", result.message);
            })
            .catch((err) => {
              setLoading(false);
              Alert.error("Oops", "Something went wrong!!");
              console.log(err.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
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
  };

  const fetchExpenditureSubBudgetHead = (batch) => {
    return batch.expenditures[0].subBudgetHead.budgetCode;
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
      setLoading(true);
      store("clear/payments", data)
        .then((res) => {
          const data = res.data;
          setLoading(false);
          Alert.success("Payment Status!!", data.message);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          Alert.error("Oops!", "Something went wrong!!");
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.error("Oops!", "Something went terribly wrong!!");
    }

    setState(initialState);
    setApprovalStage({});
    setTracking([]);
  };

  const handleClearQuery = (batch) => {
    const id = batch.id;

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
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-9">
          <h4 className="mb-4">
            Approve Payments{" "}
            {approvalStage !== undefined ? (
              <span className="badge badge-pill badge-default badge-rounded badge-sm">
                {approvalStage.name}
              </span>
            ) : null}
          </h4>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-info btn-rounded btn-xs float-right"
            disabled={approvalStage && !canReverseStage(approvalStage.stage)}
            onClick={() => state.batch && reverseStage(state.batch)}
            type="button"
          >
            <i className="fa fa-undo mr-2"></i>
            Revert Back
          </button>
        </div>
      </div>

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
                    {state.batch.queried && approvalStage.clearQuery && (
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

      {state.batch && state.showDetails ? (
        <div className="tracking">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Tracking</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  {tracking.length > 0 &&
                    tracking.map((track) => (
                      <div
                        key={track.id}
                        className={`alert alert-${
                          track.controller === null ? "danger" : "light"
                        }`}
                        role="alert"
                      >
                        {track.controller === null
                          ? `Batch has not been cleared by ${track.stage.toUpperCase()}`
                          : `${track.remarks} BY ${
                              track.controller && track.controller.name
                            }`}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Approvals;
