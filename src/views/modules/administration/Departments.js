/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Loading from "../../../components/commons/Loading";
import BasicTable from "../../../components/commons/tables/BasicTable";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import {
  alter,
  batchRequests,
  collection,
  // destroy,
  store,
} from "../../../services/utils/controllers";
import { validate } from "../../../services/utils/validation";
import makeAnimated from "react-select/animated";
import axios from "axios";

const Departments = () => {
  const initialState = {
    id: 0,
    name: "",
    code: "",
    type: "",
    parentId: 0,
    user_id: 0,
    department_id: 0,
  };

  const [state, setState] = useState(initialState);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [budgetOwner, setBudgetOwner] = useState(false);

  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Code",
      key: "code",
    },
    {
      label: "Type",
      key: "type",
    },
  ];

  const types = [
    { key: "directorate", label: "Directorate" },
    { key: "division", label: "Division" },
    { key: "department", label: "Department" },
    { key: "unit", label: "Unit" },
  ];

  const rules = [
    { name: "name", rules: ["required", "string", "min:3"] },
    { name: "code", rules: ["required", "string"] },
    { name: "type", rules: ["required", "string"] },
    { name: "parentId", rules: ["required"] },
  ];

  const staffOptions = (optionsArr) => {
    const arr = [];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.name });
      });
    return arr;
  };

  const handleStaffSelect = (e) => {
    // console.log(e.key);

    setState({
      ...state,
      user_id: e.key,
    });
  };

  const formatDept = () => {
    return (
      departments.length > 0 &&
      departments.map((dept) => ({
        key: dept.id,
        label: dept.name,
        code: dept.code,
        parent: dept.parentId,
      }))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: state.name,
      code: state.code,
      type: state.type,
      parentId: state.parentId,
    };

    const formErrors = validate(rules, data);
    setErrors(formErrors);
    const status =
      Object.keys(formErrors).length === 0 && formErrors.constructor === Object;

    if (status) {
      if (update) {
        try {
          alter("departments", state.id, data)
            .then((res) => {
              const result = res.data.data;

              setDepartments(
                departments.map((el) => {
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
          store("departments", data)
            .then((res) => {
              const result = res.data.data;
              setDepartments([result, ...departments]);
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

  const handleUpdate = (data) => {
    setState(data);
    setUpdate(true);
    setOpen(true);
  };

  const addBudgetOwner = (data) => {
    // console.log(data);
    setBudgetOwner(true);
    setState({
      ...state,
      department_id: data.id,
    });
  };

  const handleBudgetOwner = (e) => {
    e.preventDefault();

    const data = {
      user_id: state.user_id,
      department_id: state.department_id,
    };

    console.log(data);

    setLoading(true);

    try {
      store("add/budget/owners", data)
        .then((res) => {
          const result = res.data;
          setDepartments(
            departments.map((dept) => {
              if (dept.id == result.data.id) {
                return result.data;
              }

              return dept;
            })
          );
          setLoading(false);
          Alert.success("Added!!", result.message);
          setState({
            ...state,
            department_id: 0,
            user_id: 0,
          });
          setBudgetOwner(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // const handleDestroy = (data) => {
  //   Alert.flash(
  //     "Are you sure?",
  //     "warning",
  //     "You would not be able to revert this!!"
  //   ).then((result) => {
  //     if (result.isConfirmed) {
  //       destroy("departments", data.id)
  //         .then((res) => {
  //           setDepartments([
  //             ...departments.filter((dept) => dept.id !== res.data.data.id),
  //           ]);
  //           Alert.success("Deleted!!", res.data.message);
  //         })
  //         .catch((err) => console.log(err.message));
  //     }
  //   });
  // };

  useEffect(() => {
    try {
      const departmentsData = collection("departments");
      const usersData = collection("users");

      batchRequests([departmentsData, usersData])
        .then(
          axios.spread((...res) => {
            const depts = res[0].data.data;
            const employees = res[1].data.data;

            setLoading(false);
            setDepartments(depts);
            setUsers(employees);
          })
        )
        .catch((err) => {
          setLoading(false);
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
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-success btn-lg btn-rounded"
              onClick={() => setOpen(!open)}
              disabled={open || budgetOwner}
            >
              <i className="fa fa-plus mr-2"></i> Add Department
            </button>
          </div>
        </div>

        {budgetOwner && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">ADD BUDGET OWNER</h3>
              </div>
              <div className="card-body">
                <div className="form-body">
                  <form onSubmit={handleBudgetOwner}>
                    <div className="row">
                      <div className="col-md-12">
                        <Select
                          styles={{ height: "40px" }}
                          components={makeAnimated()}
                          options={staffOptions(users)}
                          placeholder="Select Budget Owner"
                          onChange={handleStaffSelect}
                          isSearchable
                        />
                      </div>
                      <div className="col-md-12 mt-5">
                        <div className="btn-group btn-rounded">
                          <button
                            type="submit"
                            className="btn btn-success btn-sm"
                          >
                            <i className="fa fa-send mr-2"></i>
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setState({
                                ...state,
                                department_id: 0,
                                user_id: 0,
                              });
                              setBudgetOwner(false);
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
          </div>
        )}

        {open && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="form-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        <TextInputField
                          placeholder="Enter Department Name"
                          value={state.name}
                          onChange={(e) =>
                            setState({ ...state, name: e.target.value })
                          }
                          error={
                            errors && errors.name && errors.name.length > 0
                          }
                          errorMessage={errors && errors.name && errors.name[0]}
                        />
                      </div>
                      <div className="col-md-3">
                        <TextInputField
                          placeholder="Enter Code"
                          value={state.code}
                          onChange={(e) =>
                            setState({ ...state, code: e.target.value })
                          }
                          error={
                            errors && errors.code && errors.code.length > 0
                          }
                          errorMessage={errors && errors.code && errors.code[0]}
                        />
                      </div>
                      <div className="col-md-5">
                        <CustomSelect
                          defaultText="None"
                          options={formatDept()}
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
                          defaultText="Select Department Type"
                          options={types}
                          value={state.type}
                          onChange={(e) =>
                            setState({ ...state, type: e.target.value })
                          }
                          error={
                            errors && errors.type && errors.type.length > 0
                          }
                          errorMessage={errors && errors.type && errors.type[0]}
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
        )}

        <div className="col-lg-12">
          <BasicTable
            page="Departments"
            columns={columns}
            rows={departments}
            handleEdit={handleUpdate}
            addBudgetOwner={addBudgetOwner}
          />
        </div>
      </div>
    </>
  );
};

export default Departments;
