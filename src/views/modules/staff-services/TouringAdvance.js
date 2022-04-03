/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../components/commons/Loading";
import TextInputField from "../../../components/forms/input/TextInputField";
import {
  alter,
  collection,
  fetch,
  store,
} from "../../../services/utils/controllers";
import { formatCurrency } from "../../../services/utils/helpers";

const TouringAdvance = () => {
  const initialState = {
    id: 0,
    staff_no: "",
    reference_no: "",
    user_id: 0,
    beneficiary: "",
    title: "",
    amount: 0,
    start_date: "",
    end_date: "",
    submitted: false,
    formDisplay: false,
    type: "touring-advance",
    update: false,
  };

  const auth = useSelector((state) => state.auth.value.user);

  const [state, setState] = useState(initialState);
  const [tourings, setTourings] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const code = Math.floor(Math.random() * 90000) + 10000;
    const subs = state.beneficiary.substring(0, 2);

    const data = {
      user_id: state.user_id,
      reference_no: "TA" + code + subs.toUpperCase(),
      start_date: state.start_date,
      end_date: state.end_date,
      amount: state.amount,
      title: state.title,
      status: "pending",
      type: state.type,
    };

    if (state.update) {
      alter("touringAdvances", state.id, data)
        .then((res) => {
          const data = res.data.data;

          setTourings(
            tourings.map((tour) => {
              if (tour.id === data.id) {
                return data;
              }

              return tour;
            })
          );
          setOpen(false);
          setState(initialState);

          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } else {
      store("touringAdvances", data)
        .then((res) => {
          const data = res.data.data;

          setTourings([data, ...tourings]);
          setOpen(false);
          setState(initialState);

          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    }
  };

  const handleUpdate = (data) => {
    setState({
      id: data.id,
      user_id: data.claim && data.claim.owner.id,
      beneficiary: data.claim && data.claim.owner.name,
      staff_no: data.claim && data.claim.owner.staff_no,
      title: data.claim && data.claim.title,
      amount: data.claim && data.claim.total_amount,
      start_date: data.start_date,
      end_date: data.end_date,
      formDisplay: true,
      update: true,
    });
    setOpen(true);
  };

  const handleRaised = (data) => {
    setLoading(true);

    try {
      alter("raise/touringAdvances", data.id, { status: "raised" })
        .then((res) => {
          const data = res.data.data;

          setTourings(
            tourings.map((tour) => {
              if (tour.id === data.id) {
                return data;
              }

              return tour;
            })
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth !== null) {
      setLoading(true);
      try {
        collection("touringAdvances")
          .then((res) => {
            const data = res.data.data;
            setTourings(data.filter((tour) => tour.user_id === auth.id));
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }, [auth]);

  useEffect(() => {
    if (state.staff_no !== "" && state.staff_no.length >= 5) {
      setLoading(true);
      try {
        fetch("fetch/users", state.staff_no).then((res) => {
          const data = res.data.data;

          setState({
            ...state,
            user_id: data.id,
            beneficiary: data.name,
            formDisplay: true,
          });

          setLoading(false);
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }, [state.staff_no]);

  return (
    <>
      {loading && <Loading />}
      <div className="row">
        {open && (
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <TextInputField
                  label="Staff Number"
                  value={state.staff_no}
                  onChange={(e) =>
                    setState({ ...state, staff_no: e.target.value })
                  }
                  placeholder="Enter Staff Number"
                  disabled={state.formDisplay}
                />
              </div>
              {state.formDisplay && (
                <>
                  <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-7">
                              <TextInputField
                                label="Beneficiary"
                                value={state.beneficiary}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    beneficiary: e.target.value,
                                  })
                                }
                                disabled
                              />
                            </div>
                            <div className="col-md-5">
                              <TextInputField
                                label="Amount"
                                type="number"
                                value={state.amount}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    amount: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-12">
                              <TextInputField
                                label="Title"
                                value={state.title}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Enter Title Here"
                              />
                            </div>
                            <div className="col-md-6">
                              <TextInputField
                                label="Start Date"
                                type="date"
                                value={state.start_date}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    start_date: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-6">
                              <TextInputField
                                label="End Date"
                                type="date"
                                value={state.end_date}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    end_date: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-12 mt-5">
                              <div className="btn-group btn-rounded">
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                  disabled={
                                    state.amount === 0 ||
                                    state.title === "" ||
                                    state.start_date === "" ||
                                    state.end_date === ""
                                  }
                                >
                                  Submit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => {
                                    setState(initialState);
                                    setOpen(false);
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <button
                type="button"
                className="btn btn-success btn-rounded"
                onClick={() => setOpen(!open)}
                disabled={open || state.formDisplay}
              >
                <i className="fa fa-plus mr-2"></i>Add Touring Adavance
              </button>
            </div>
            <div className="card-body">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Reference Code</th>
                    <th>Beneficiary</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Start Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tourings.length > 0 ? (
                    tourings.map((tour) => (
                      <tr key={tour.id}>
                        <td>{tour.reference_no}</td>
                        <td>
                          {tour.claim && tour.claim.owner.name.toUpperCase()}
                        </td>
                        <td>{tour.claim && tour.claim.title.toUpperCase()}</td>
                        <td>
                          {tour.claim &&
                            formatCurrency(tour.claim.total_amount)}
                        </td>
                        <td>{moment(tour.start_date).format("LL")}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-warning btn-xs"
                              type="button"
                              onClick={() => handleUpdate(tour)}
                              disabled={tour.status === "raised"}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-success btn-xs"
                              onClick={() => handleRaised(tour)}
                              disabled={tour.status === "raised"}
                            >
                              <i className="fa fa-check"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-danger">
                        No Data Found!!!
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

export default TouringAdvance;
