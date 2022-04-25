/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { verifyNumOfDays } from "../../../services/utils/helpers";

const AddInstruction = (props) => {
  const initialState = {
    benefit_id: 0,
    from: "",
    to: "",
    numOfDays: 0,
    additional_benefit_id: 0,
    description: "",
    amount: 0,
  };

  const [state, setState] = useState(initialState);
  const [benefit, setBenefit] = useState(null);

  const auth = useSelector((state) => state.auth.value.user);

  const collectData = (e) => {
    e.preventDefault();

    let count = 1000000000;

    // const url = `claims/${state.claim_id}/instructions`;

    const data = {
      id: Math.random(count),
      benefit_id: state.benefit_id,
      from: state.from,
      to: state.to,
      additional_benefit_id: state.additional_benefit_id,
      numOfDays: state.numOfDays,
      description: state.description,
      amount: state.amount,
      benefit,
    };

    props.onSubmit(data);
    setState(initialState);
    props.onHide();
    setBenefit(null);
  };

  const closeModal = () => {
    props.onHide();
    setState(initialState);
    setBenefit(null);
  };

  const getFee = (benefit, daysDiff) => {
    const child =
      benefit &&
      benefit.children.filter((ben) => state.additional_benefit_id == ben.id);
    const fee = child[0].entitlements.filter((ent) => ent.grade === auth.level);
    const entitlement = fee[0];
    const total = entitlement.amount * daysDiff;

    return total;
  };

  useEffect(() => {
    if (state.from !== "" && state.to !== "") {
      const daysDiff = verifyNumOfDays(state.from, state.to);
      const prevAmount = state.amount;

      if (benefit && benefit.numOfDays) {
        const city =
          benefit.label === "intra-city-shuttle" ? daysDiff - 1 : daysDiff;
        const amount =
          state.additional_benefit_id > 0
            ? getFee(benefit, daysDiff)
            : state.amount;
        setState({
          ...state,
          numOfDays: city,
          amount,
        });
      } else {
        setState({
          ...state,
          numOfDays: 0,
          amount: prevAmount,
        });
      }
    }
  }, [state.from, state.to]);

  useEffect(() => {
    if (state.additional_benefit_id > 0) {
      const total = getFee(benefit, state.numOfDays);

      setState({
        ...state,
        amount: total,
      });
    }
  }, [state.additional_benefit_id]);

  useEffect(() => {
    if (
      benefit &&
      benefit.numOfDays &&
      benefit.entitlements.length > 0 &&
      state.numOfDays > 0
    ) {
      const fee = benefit.entitlements.filter(
        (entitlement) => entitlement.grade === auth.level
      );
      const entitlement = fee[0];
      const total = entitlement.amount * state.numOfDays;

      setState({
        ...state,
        amount: total,
      });
    }
  }, [benefit, state.numOfDays]);

  useEffect(() => {
    if (state.benefit_id > 0) {
      try {
        props
          .children(state.benefit_id)
          .then((res) => {
            const selected = res;
            setBenefit(res);

            if (!selected.numOfDays) {
              const fee =
                selected.entitlements.length > 0 &&
                selected.entitlements.filter((ent) => ent.grade === auth.level);

              const entitlement = fee && fee[0];
              setState({
                ...state,
                amount: entitlement.amount,
              });
            }
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [state.benefit_id]);

  useEffect(() => {
    if (
      benefit &&
      !benefit.numOfDays &&
      benefit.entitlements.length > 0 &&
      state.additional_benefit_id > 0
    ) {
      const fee = benefit.entitlements.filter(
        (entitlement) => entitlement.grade === auth.level
      );
      const entitlement = fee[0];

      const total = entitlement.amount * state.numOfDays;

      setState({
        ...state,
        amount: total,
      });
    }
  }, [benefit]);

  return (
    <>
      <Modal
        className="modal"
        show={props.show}
        onHide={closeModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <form onSubmit={collectData}>
          <div className="modal-header">
            <h5 className="modal-title">Add Detail</h5>
          </div>

          <div className="modal-body">
            <div className="container-fluid">
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">Type</label>

                    <select
                      value={state.benefit_id}
                      className="form-control"
                      onChange={(e) => {
                        setState({
                          ...state,
                          benefit_id: e.target.value,
                        });
                      }}
                    >
                      <option value="0">Select Type</option>

                      {props.benefits.length !== 0
                        ? props.benefits.map((benefit) => {
                            if (benefit.parentId === 0) {
                              return (
                                <option key={benefit.id} value={benefit.id}>
                                  {benefit.name}
                                </option>
                              );
                            } else {
                              return null;
                            }
                          })
                        : null}
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">From</label>
                    <input
                      type="date"
                      className="form-control"
                      value={state.from}
                      onChange={(e) =>
                        setState({ ...state, from: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">To</label>
                    <input
                      type="date"
                      className="form-control"
                      value={state.to}
                      onChange={(e) =>
                        setState({ ...state, to: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {state.benefit_id !== 0 && benefit && benefit.hasChildren ? (
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">Select Category</label>

                    <select
                      as="select"
                      className="form-control"
                      value={state.additional_benefit_id}
                      onChange={(e) => {
                        setState({
                          ...state,
                          additional_benefit_id: e.target.value,
                        });
                        props.children(e.target.value);
                      }}
                    >
                      <option value="0">Select Category</option>
                      {benefit !== null && benefit.children
                        ? benefit.children.map((child) => (
                            <option key={child.id} value={child.id}>
                              {child.name}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                </div>
              ) : null}

              {state.benefit_id !== 0 && benefit && benefit.numOfDays ? (
                <div className="row mb-3">
                  <div className="col">
                    <div className="form-group">
                      <label className="form-label">Number of Days</label>

                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Number of Days"
                        value={state.numOfDays}
                        onChange={(e) =>
                          setState({ ...state, numOfDays: e.target.value })
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="row mb-3">
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Amount"
                      value={state.amount}
                      onChange={(e) =>
                        setState({ ...state, amount: e.target.value })
                      }
                      readOnly={benefit && benefit.label !== "other"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="btn-group btn-rounded">
              <button className="btn btn-success" type="submit">
                <i className="fa fa-send mr-2"></i>
                Submit
              </button>

              <button
                className="btn btn-danger"
                type="button"
                onClick={closeModal}
              >
                <i className="fa fa-close mr-2"></i>
                Close
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddInstruction;
