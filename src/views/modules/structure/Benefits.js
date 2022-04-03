/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import BenefitsWidget from "./BenefitsWidget";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import {
  collection,
  alter,
  store,
  destroy,
} from "../../../services/utils/controllers";
import { validate } from "../../../services/utils/validation";
import useApi from "../../../services/hooks/useApi";
import AddEntitlements from "./AddEntitlements";
import { levelOptions } from "../../../services/utils/helpers";
import Loading from "../../../components/commons/Loading";

const Benefits = () => {
  const {
    data: benefits,
    setData: setBenefits,
    request: fetch,
    loading,
  } = useApi(collection);

  const initialState = {
    showForm: false,
    id: 0,
    name: "",
    label: "",
    parentId: 0,
    depends: 0,
    description: "",
    isUpdating: false,
  };

  const modalState = {
    entity: null,
    visibility: false,
  };

  const [state, setState] = useState(initialState);
  const [modalShow, setModalShow] = useState(modalState);
  const [update, setUpdate] = useState(false);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  const rules = [
    { name: "name", rules: ["required", "string"] },
    { name: "parentId", rules: ["required", "integar"] },
    { name: "numOfDays", rules: ["required"] },
    { name: "description", rules: ["required"] },
  ];

  const handleStateChange = (data) => {
    store("load/entitlements/", data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const getGradeLevels = () => {
    collection("gradeLevels")
      .then((res) => setGradeLevels(res.data.data))
      .catch((err) => console.log(err));
  };

  const handleUpdate = (data) => {
    setState(data);
    setUpdate(true);
    setOpen(true);
  };

  const requirementOptions = [
    { key: "0", label: "None" },
    { key: "1", label: "Number of Days" },
  ];

  const benefitOptions = (optionsArr) => {
    const arr = [{ key: 0, label: "None" }];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.name });
      });
    return arr;
  };

  const handleModalEvent = (data) => {
    setModalShow({
      ...modalShow,
      entity: data,
      visibility: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: state.name,
      parentId: state.parentId,
      numOfDays: state.depends,
      description: state.description,
    };

    const formErrors = validate(rules, data);
    setErrors(formErrors);

    const status =
      Object.keys(formErrors).length === 0 && formErrors.constructor === Object;

    if (status) {
      if (update) {
        try {
          alter("benefits", state.id, data)
            .then((res) => {
              const result = res.data.data;

              setBenefits(
                benefits.map((el) => {
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
          store("benefits", data)
            .then((res) => {
              const result = res.data.data;
              setBenefits([result, ...benefits]);
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

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("benefits", data.id)
          .then((res) => {
            setBenefits([
              ...benefits.filter((price) => price.id !== res.data.data.id),
            ]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  useEffect(() => {
    fetch("benefits");
    getGradeLevels();
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-primary btn-rounded"
              onClick={() => setOpen(!open)}
              disabled={open}
            >
              <i className="fa fa-plus mr-2"></i> Add Benefit
            </button>
          </div>
        </div>

        <AddEntitlements
          onSubmit={handleStateChange}
          show={modalShow.visibility}
          benefit={modalShow.entity}
          grades={levelOptions(gradeLevels)}
          onHide={() => {
            setModalShow({ ...modalShow, visibility: false });
          }}
        />

        {open && (
          <>
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-4">
                          <TextInputField
                            placeholder="Enter Benefit Name"
                            label="Benefit title"
                            type="text"
                            value={state.name}
                            onChange={(e) =>
                              setState({ ...state, name: e.target.value })
                            }
                            error={
                              errors && errors.name && errors.name.length > 0
                            }
                            errorMessage={
                              errors && errors.name && errors.name[0]
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <CustomSelect
                            defaultText="Select Parent"
                            defaultInputValue={""}
                            label="Select Parent"
                            options={benefitOptions(benefits)}
                            value={state.parentId}
                            onChange={(e) =>
                              setState({ ...state, parentId: e.target.value })
                            }
                            error={
                              errors &&
                              errors.parentId &&
                              errors.parentId.length > 0
                            }
                            errorMessage={
                              errors && errors.parentId && errors.parentId[0]
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <CustomSelect
                            label="Requirement"
                            defaultText="Choose Option"
                            defaultInputValue={""}
                            options={requirementOptions}
                            value={state.depends}
                            onChange={(e) =>
                              setState({ ...state, depends: e.target.value })
                            }
                            error={
                              errors &&
                              errors.depends &&
                              errors.depends.length > 0
                            }
                            errorMessage={
                              errors && errors.depends && errors.depends[0]
                            }
                          />
                        </div>
                        <div className="col-md-12">
                          <TextInputField
                            placeholder="Description"
                            type="text"
                            multiline={2}
                            value={state.description}
                            onChange={(e) =>
                              setState({
                                ...state,
                                description: e.target.value,
                              })
                            }
                            error={
                              errors &&
                              errors.description &&
                              errors.description.length > 0
                            }
                            errorMessage={
                              errors &&
                              errors.description &&
                              errors.description[0]
                            }
                          />
                        </div>
                        <div className="col-md-12 mt-3">
                          <div className="btn-group btn-rounded">
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
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Parent</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {benefits ? (
                      benefits.map((benefit) => {
                        return (
                          <BenefitsWidget
                            key={benefit.id}
                            benefit={benefit}
                            onEdit={handleUpdate}
                            onDestroy={handleDestroy}
                            modalControl={handleModalEvent}
                          />
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-danger">
                          NO DATA FOUND!!!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Benefits;
