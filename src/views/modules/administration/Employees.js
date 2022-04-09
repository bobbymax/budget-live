import React, { useEffect, useState } from "react";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import {
  alter,
  collection,
  // destroy,
  store,
} from "../../../services/utils/controllers";
import { validate } from "../../../services/utils/validation";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Alert from "../../../services/classes/Alert";
// import BasicTable from "../../../components/commons/tables/BasicTable";
import { Link } from "react-router-dom";
import { formatDate } from "../../../services/utils/helpers";
import AddStaffRole from "./AddStaffRole";
import ModifyUser from "./ModifyUser";
import Loading from "../../../components/commons/Loading";
import TableCard from "../../../components/commons/tables/customized/TableCard";

const Employees = () => {
  const initialState = {
    id: 0,
    staff_no: "",
    grade_level_id: 0,
    department_id: 0,
    name: "",
    email: "",
    assignRole: false,
  };

  const modalState = {
    visibility: false,
  };

  const animated = makeAnimated();
  const [state, setState] = useState(initialState);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [update, setUpdate] = useState(false);
  const [rolesInput, setRolesInput] = useState([]);
  const [modalShow, setModalShow] = useState(modalState);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [staff, setStaff] = useState({});
  const [loading, setLoading] = useState(true);

  const columns = [
    { label: "Staff Number", key: "staff_no" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
  ];

  const rules = [
    { name: "name", rules: ["required", "string", "min:3"] },
    { name: "staff_no", rules: ["required"] },
    { name: "grade_level_id", rules: ["required", "integer"] },
    { name: "department_id", rules: ["required", "integer"] },
    { name: "email", rules: ["required", "string", "max:255"] },
  ];

  const formatLevels = () => {
    return (
      levels.length > 0 &&
      levels.map((levl) => ({
        key: levl.id,
        label: levl.code,
        name: levl.name,
      }))
    );
  };

  const formatDept = () => {
    return (
      departments.length > 0 &&
      departments.map((dept) => ({
        key: dept.id,
        label: dept.name,
        code: dept.code,
      }))
    );
  };

  const formatRole = () => {
    return (
      roles.length > 0 &&
      roles.map((role) => ({
        value: role.id,
        label: role.name,
      }))
    );
  };

  useEffect(() => {
    try {
      collection("users")
        .then((res) => {
          setEmployees(res.data.data);
          setLoading(false);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      collection("gradeLevels")
        .then((res) => {
          setLevels(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      collection("departments")
        .then((res) => {
          setDepartments(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      collection("roles")
        .then((res) => {
          setRoles(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const manageStaff = (user) => {
    setState({
      ...state,
      assignRole: true,
    });

    setStaff(user);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      staff_no: state.staff_no,
      grade_level_id: parseInt(state.grade_level_id),
      department_id: parseInt(state.department_id),
      name: state.name,
      email: state.email,
      roles: rolesInput,
    };

    const formErrors = validate(rules, data);
    setErrors(formErrors);
    const status =
      Object.keys(formErrors).length === 0 && formErrors.constructor === Object;

    if (status) {
      if (update) {
        try {
          alter("users", state.id, data)
            .then((res) => {
              const result = res.data.data;

              setEmployees(
                employees.map((el) => {
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
          store("users", data)
            .then((res) => {
              const result = res.data.data;
              setEmployees([result, ...employees]);
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
      setRolesInput([]);
    }
  };

  const handleUpdate = () => {
    setUpdateModalShow({
      ...updateModalShow,
      visibility: true,
    });
  };

  const addRole = () => {
    setModalShow({
      ...modalShow,
      visibility: true,
    });
  };

  // const handleDestroy = (data) => {
  //   Alert.flash(
  //     "Are you sure?",
  //     "warning",
  //     "You would not be able to revert this!!"
  //   ).then((result) => {
  //     if (result.isConfirmed) {
  //       destroy("users", data.id)
  //         .then((res) => {
  //           setEmployees([
  //             ...employees.filter((staff) => staff.id !== res.data.data.id),
  //           ]);
  //           Alert.success("Deleted!!", res.data.message);
  //         })
  //         .catch((err) => console.log(err.message));
  //     }
  //   });
  // };

  // console.log(staff);

  return (
    <>
      {loading && <Loading />}

      <div className="row">
        {!state.assignRole && (
          <>
            <div className="col-md-12">
              <div className="page-titles">
                <button
                  className="btn btn-success"
                  onClick={() => setOpen(!open)}
                  disabled={open}
                >
                  <i className="fa fa-plus"></i> Add Staff
                </button>
              </div>
            </div>

            <>
              {open && (
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="form-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-md-3">
                              <TextInputField
                                placeholder="Enter Staff Number"
                                value={state.staff_no}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    staff_no: e.target.value,
                                  })
                                }
                                error={
                                  errors &&
                                  errors.staff_no &&
                                  errors.staff_no.length > 0
                                }
                                errorMessage={
                                  errors &&
                                  errors.staff_no &&
                                  errors.staff_no[0]
                                }
                              />
                            </div>

                            <div className="col-md-6">
                              <TextInputField
                                placeholder="Enter Fullname (Surname First)"
                                value={state.name}
                                onChange={(e) =>
                                  setState({ ...state, name: e.target.value })
                                }
                                error={
                                  errors &&
                                  errors.name &&
                                  errors.name.length > 0
                                }
                                errorMessage={
                                  errors && errors.name && errors.name[0]
                                }
                              />
                            </div>

                            <div className="col-md-3">
                              {/*  */}
                              <CustomSelect
                                defaultText="Select Grade Level"
                                options={formatLevels()}
                                value={state.grade_level_id}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    grade_level_id: e.target.value,
                                  })
                                }
                                error={
                                  errors &&
                                  errors.grade_level_id &&
                                  errors.grade_level_id.length > 0
                                }
                                errorMessage={
                                  errors &&
                                  errors.grade_level_id &&
                                  errors.grade_level_id[0]
                                }
                              />
                            </div>

                            <div className="col-md-6">
                              <TextInputField
                                placeholder="Enter Email Address"
                                value={state.email}
                                onChange={(e) =>
                                  setState({ ...state, email: e.target.value })
                                }
                                error={
                                  errors &&
                                  errors.email &&
                                  errors.email.length > 0
                                }
                                errorMessage={
                                  errors && errors.email && errors.email[0]
                                }
                              />
                            </div>

                            <div className="col-md-6">
                              {/*  */}
                              <CustomSelect
                                defaultText="Select Department"
                                options={formatDept()}
                                value={state.department_id}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    department_id: e.target.value,
                                  })
                                }
                                error={
                                  errors &&
                                  errors.department_id &&
                                  errors.department_id.length > 0
                                }
                                errorMessage={
                                  errors &&
                                  errors.department_id &&
                                  errors.department_id[0]
                                }
                              />
                            </div>

                            <div className="col-md-12">
                              {/*  */}
                              <Select
                                closeMenuOnSelect={false}
                                components={animated}
                                options={formatRole()}
                                value={rolesInput}
                                onChange={setRolesInput}
                                isMulti
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
                                  setRolesInput([]);
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
            </>
            <div className="col-md-12">
              <TableCard
                columns={columns}
                rows={employees}
                manageStaff={manageStaff}
              />
            </div>
          </>
        )}

        {state.assignRole && (
          <>
            <AddStaffRole
              show={modalShow.visibility}
              onHide={() =>
                setModalShow({
                  ...modalShow,
                  visibility: false,
                })
              }
              roles={roles}
              user={staff}
            />

            <ModifyUser
              roles={roles}
              user={staff}
              show={updateModalShow}
              onHide={() => setUpdateModalShow(false)}
              levels={levels}
              departments={departments}
            />

            <div className="col-md-6">
              <div className="card h-auto">
                <div className="card-header bg-primary">
                  <h2 className="text-white">
                    <i className="fa fa-user-circle"></i> {staff.name}
                  </h2>
                </div>

                <div className="card-body">
                  <h3>User Profile</h3>
                  <div className="dropdown-divider"></div>

                  <div className="list-group">
                    <p className="list-group-item">
                      <b>Staff ID:</b> {staff.staff_no}
                    </p>
                    <p className="list-group-item">
                      <b>Department:</b> {staff.department.name}
                    </p>
                    <p className="list-group-item">
                      <b>Full Name:</b> {staff.name}
                    </p>
                    <p className="list-group-item">
                      <b>Email:</b> {staff.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="list-group">
                  <Link
                    to="#"
                    className="list-group-item list-group-item-action list-group-action-hover-primary text-center"
                    onClick={() => {
                      setState({
                        ...state,
                        assignRole: false,
                      });
                      setStaff({});
                    }}
                  >
                    Close <i className="fa fa-close"></i>
                  </Link>

                  <Link
                    to="#"
                    className="list-group-item list-group-item-action text-center"
                  >
                    Reset Password <i className="fa fa-lock"></i>
                  </Link>

                  <Link
                    to="#"
                    className="list-group-item list-group-item-action text-center"
                  >
                    Reset Security Question <i className="fa fa-question"></i>
                  </Link>

                  <Link
                    to="#"
                    className="list-group-item list-group-item-action text-center"
                  >
                    Modification Log
                  </Link>

                  <Link
                    to="#"
                    onClick={() => handleUpdate()}
                    className="list-group-item list-group-item-action text-center"
                  >
                    Modify Account <i className="fa fa-user-edit"></i>
                  </Link>

                  <Link
                    to="#"
                    className="list-group-item list-group-item-action text-center"
                  >
                    User Activity <i className="fa fa-user-"></i>
                  </Link>

                  <Link
                    to="#"
                    className="list-group-item list-group-item-action text-center"
                  >
                    Block Account
                  </Link>

                  <Link
                    to="#"
                    className="list-group-item list-group-item-action text-center"
                  >
                    Reset Account Privilege
                  </Link>

                  <Link
                    to="#"
                    className="list-group-item list-group-item-action text-center"
                    onClick={() => addRole()}
                  >
                    Add Role <i className="fa fa-user-edit"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {staff.roles && staff.roles.length > 0 ? (
                        staff.roles.map((role, index) => (
                          <tr key={index}>
                            <td>{role.name}</td>
                            <td>{formatDate(role.start_date)}</td>
                            <td>
                              {role.expiry_date !== null
                                ? formatDate(role.expiry_date)
                                : "Cannot Expire"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-danger">
                            No User Roles!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Employees;
