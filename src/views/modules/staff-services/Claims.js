/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimTable from "../../../components/commons/widgets/ClaimTable";
import { validate } from "../../../services/utils/validation";
import useApi from "../../../services/hooks/useApi";
import Alert from "../../../services/classes/Alert";
import {
  collection,
  store,
  destroy,
  alter,
} from "../../../services/utils/controllers";
import TextInputField from "../../../components/forms/TextInputField";
import Loading from "../../../components/commons/Loading";

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

  const {
    request,
    data: claims,
    setData: setClaims,
    loading,
  } = useApi(collection);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [collectables, setCollectables] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      title: state.title,
      type: state.type,
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
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          store("claims", data)
            .then((res) => {
              const result = res.data.data;
              setClaims([result, ...claims]);
              Alert.success("Created!!", res.data.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }

      setErrors({});

      setUpdate(false);
      setState(initialState);
      setOpen(false);
    }
  };

  const handlePrintOut = (claim) => {
    navigate(`/claims/${claim.reference_no}/print`, {
      state: {
        claim: claim,
        actionType: "print",
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

  const deleteClaim = (claim) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("claims", claim.id)
          .then((res) => {
            setClaims([
              ...claims.filter((claim) => claim.id !== res.data.data.id),
            ]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  useEffect(() => {
    request("claims");
  }, []);

  useEffect(() => {
    if (claims.length > 0) {
      setCollectables(
        claims.filter((claim) => claim && claim.type !== "touring-advance")
      );
    }
  }, [claims]);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-success"
              disabled={open}
              onClick={() => setOpen(true)}
            >
              <i className="fa fa-plus-square"></i> Add Claim
            </button>
          </div>
        </div>

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
                          <button type="submit" className="btn btn-primary">
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
                            Close
                          </button>
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
          />
        </div>
      </div>
    </>
  );
};

export default Claims;
