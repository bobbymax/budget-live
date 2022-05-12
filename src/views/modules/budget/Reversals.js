/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../components/commons/Loading";
import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import {
  alter,
  collection,
  fetch,
  store,
} from "../../../services/utils/controllers";
import { formatCurrency, userHasRole } from "../../../services/utils/helpers";

const Reversals = () => {
  const initialState = {
    batch_id: 0,
    subBudgetHeadCode: "",
    amount: 0,
    batch_code: "",
    batch: null,
    description: "",
  };
  const auth = useSelector((state) => state.auth.value.user);
  const [reversals, setReversals] = useState([]);
  const [state, setState] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatus = (rev, status) => {
    const data = {
      status,
    };

    setLoading(true);

    try {
      alter("reversals", rev.id, data)
        .then((res) => {
          const result = res.data;
          setLoading(false);
          setReversals(
            reversals.map((rev) => {
              if (rev.id == result.data.id) {
                return result.data;
              }

              return rev;
            })
          );
          Alert.success("Updated!!", result.message);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
          Alert.error("Oops!!", "Something went wrong");
        });
    } catch (error) {
      console.log(error);
    }

    console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      user_id: auth.id,
      batch_id: state.batch_id,
      description: state.description,
    };

    setLoading(true);

    try {
      store("reversals", data)
        .then((res) => {
          const result = res.data;
          setLoading(false);
          setReversals([result.data, ...reversals]);
          Alert.success("Request Made!!", result.message);

          setState(initialState);
          setOpen(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
          Alert.error("Oops!!", "Something went wrong");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.batch_code !== "" && state.batch_code.length >= 6) {
      setLoading(true);
      try {
        fetch("batches", state.batch_code)
          .then((res) => {
            const result = res.data.data;

            setState({
              ...state,
              batch_id: result.id,
              subBudgetHeadCode: result.subBudgetHeadCode,
              amount: parseFloat(result.amount),
              batch: result,
            });
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [state.batch_code]);

  useEffect(() => {
    try {
      collection("reversals")
        .then((res) => {
          const result = res.data.data;
          if (userHasRole(auth, "budget-office-officer")) {
            setReversals(result);
          } else {
            setReversals(
              result.filter((reversal) => reversal.user_id == auth.id)
            );
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        {userHasRole(auth, "budget-controller") && (
          <>
            <div className="col-md-12 mb-3">
              <button
                className="btn btn-rounded btn-success btn-sm"
                onClick={() => setOpen(true)}
                disabled={open}
              >
                <i className="fa fa-repeat mr-3"></i>
                Request Batch Reversal
              </button>
            </div>

            {open && (
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Make Reversal Request</h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-4">
                          <TextInputField
                            placeholder="BATCH CODE"
                            value={state.batch_code}
                            onChange={(e) =>
                              setState({ ...state, batch_code: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <TextInputField
                            placeholder="SUB BUDGET HEAD"
                            value={state.subBudgetHeadCode}
                            onChange={(e) =>
                              setState({
                                ...state,
                                subBudgetHeadCode: e.target.value,
                              })
                            }
                            disabled
                          />
                        </div>
                        <div className="col-md-4">
                          <TextInputField
                            value={formatCurrency(state.amount)}
                            onChange={(e) =>
                              setState({ ...state, amount: e.target.value })
                            }
                            disabled
                          />
                        </div>
                        <div className="col-md-12">
                          <TextInputField
                            placeholder="ENTER DESCRIPTION HERE"
                            value={state.description}
                            onChange={(e) =>
                              setState({
                                ...state,
                                description: e.target.value,
                              })
                            }
                            multiline={4}
                          />
                        </div>
                        <div className="col-md-12 mt-3">
                          <div className="btn-group btn-rounded">
                            <button
                              type="submit"
                              className="btn btn-success btn-md"
                            >
                              <i className="fa fa-send mr-2"></i>
                              Make Request
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-md"
                              onClick={() => {
                                setState(initialState);
                                setOpen(false);
                              }}
                            >
                              <i className="fa fa-close mr-2"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Reversal Requests</h3>
            </div>
            <div className="card-body">
              <table className="table table-bordered table-hover table-striped">
                <thead>
                  <tr>
                    <th>BATCH CODE</th>
                    <th>INITIATOR</th>
                    <th>DESCRIPTION</th>
                    <th>BATCH STATUS</th>
                    <th>MANAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {reversals.length > 0 ? (
                    reversals.map((reversal) => (
                      <tr key={reversal.id}>
                        <td>{reversal.batch_code}</td>
                        <td>{reversal.name}</td>
                        <td>{reversal.description}</td>
                        <td>{reversal.batch_status}</td>
                        <td>
                          {reversal.status === "pending" &&
                          userHasRole(auth, "budget-office-officer") ? (
                            <div className="btn-group btn-rounded">
                              <button
                                type="button"
                                className="btn btn-success btn-xs"
                                onClick={() =>
                                  handleStatus(reversal, "approved")
                                }
                              >
                                <i className="fa fa-check mr-2"></i>
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-xs"
                                onClick={() => handleStatus(reversal, "denied")}
                              >
                                <i className="fa fa-close mr-2"></i>
                                Deny
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`badge badge-${
                                reversal.status === "approved"
                                  ? "success"
                                  : "danger"
                              }`}
                            >
                              {reversal.status}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-danger">
                        NO REVERSAL REQUEST!!
                      </td>
                    </tr>
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

export default Reversals;
