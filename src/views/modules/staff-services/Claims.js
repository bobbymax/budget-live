/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimTable from "../../../components/commons/widgets/ClaimTable";
import { validate } from "../../../services/utils/validation";
import Alert from "../../../services/classes/Alert";
import {
  collection,
  store,
  destroy,
  alter,
} from "../../../services/utils/controllers";
import TextInputField from "../../../components/forms/TextInputField";
import Loading from "../../../components/commons/Loading";
import ClaimTracker from "../../../components/commons/modals/ClaimTracker";

const Claims = (props) => {
  const navigate = useNavigate();

  const initialState = {
    id: 0,
    title: "",
    type: "staff-claim",
    submitted: false,
    formDisplay: false,
    isUpdating: false,
  };

  const [claims, setClaims] = useState([]);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [collectables, setCollectables] = useState([]);
  const [modalState, setModalState] = useState({
    open: false,
    claim: null,
  });
  const [loading, setLoading] = useState(false);

  const unique = () => {
    const min = 10000;
    const max = 90000;
    const num = Math.floor(Math.random() * max) + min;
    return num;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const data = {
      title: state.title,
      type: state.type,
      reference_no: "SC" + unique(),
    };

    const formErrors = validate(rules, data);
    setErrors(formErrors);

    const status =
      Object.keys(formErrors).length === 0 && formErrors.constructor === Object;

    if (status) {
      if (update) {
        try {
          alter("claims", state.id, data)
            .then((res) => {
              const result = res.data.data;
              setLoading(false);
              setClaims(
                claims.map((el) => {
                  if (result.id === el.id) {
                    return result;
                  }

                  return el;
                })
              );
              Alert.success("Updated", res.data.message);
            })
            .catch((err) => {
              setLoading(false);
              console.log(err.message);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          store("claims", data)
            .then((res) => {
              const result = res.data.data;
              setLoading(false);
              setClaims([result, ...claims]);
              Alert.success("Created!!", res.data.message);
            })
            .catch((err) => {
              setLoading(false);
              console.log(err.message);
            });
        } catch (error) {
          console.log(error);
        }
      }

      setErrors({});

      setUpdate(false);
      setState(initialState);
      setOpen(false);
    } else {
      setLoading(false);
    }
  };

  const handlePrintOut = (claim) => {
    navigate(`/claims/${claim.reference_no}/print`, {
      state: {
        claim: claim,
        actionType: "print",
        type: "staff-claim",
      },
    });
  };

  const rules = [{ name: "title", rules: ["required", "integar"] }];

  const loadClaim = (data) => {
    setState({
      ...state,
      id: data.id,
      title: data.title,
      type: data.type,
      formDisplay: true,
      isUpdating: true,
    });

    setOpen(true);
  };

  const handleAddDetails = (claim) => {
    navigate(`/claims/${claim.reference_no}/add/details`, {
      state: {
        claim: claim,
        actionType: "update",
      },
    });
  };

  const handleTracking = (claim) => {
    // console.log(claim);

    setModalState({
      ...modalState,
      open: true,
      claim,
    });
  };

  const deleteClaim = (claim) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        destroy("claims", claim.id)
          .then((res) => {
            const result = res.data;
            setLoading(false);
            const newData = claims.filter((cla) => cla.id != result.data.id);
            console.log(newData);
            setClaims(newData);
            Alert.success("Deleted!!", result.message);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    try {
      collection("claims")
        .then((res) => {
          setLoading(false);
          setClaims(res.data.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setCollectables(
      claims.filter((claim) => claim && claim.type !== "touring-advance")
    );
  }, [claims]);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-success btn-rounded"
              disabled={open}
              onClick={() => setOpen(true)}
            >
              <i className="fa fa-plus-circle mr-2"></i> Add Claim
            </button>
          </div>
        </div>

        <ClaimTracker
          show={modalState.open}
          claim={modalState.claim}
          onHide={() => setModalState({ ...modalState, open: false })}
        />

        {open && (
          <>
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12">
                          <TextInputField
                            placeholder="Enter Claim Title"
                            type="text"
                            value={state.title}
                            onChange={(e) =>
                              setState({ ...state, title: e.target.value })
                            }
                            error={
                              errors && errors.title && errors.title.length > 0
                            }
                            errorMessage={
                              errors && errors.title && errors.title[0]
                            }
                          />
                        </div>

                        <div className="col-md-12 mt-3">
                          <div className="btn-group btn-rounded">
                            <button type="submit" className="btn btn-primary">
                              <i className="fa fa-send mr-2"></i>
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => {
                                setUpdate(false);
                                setState(initialState);
                                setOpen(false);
                                setErrors({});
                              }}
                            >
                              <i className="fa fa-times-circle mr-2"></i>
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-lg-12">
          <ClaimTable
            claims={collectables}
            onView={handlePrintOut}
            onEdit={loadClaim}
            addDetails={handleAddDetails}
            onDestroy={deleteClaim}
            loading={loading}
            track={handleTracking}
          />
        </div>
      </div>
    </>
  );
};

export default Claims;
