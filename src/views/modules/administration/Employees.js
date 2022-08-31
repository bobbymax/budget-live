import React, { useEffect, useState } from "react";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import {
  alter,
  batchRequests,
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
import { formatDate, userHasRole } from "../../../services/utils/helpers";
import AddStaffRole from "./AddStaffRole";
import ModifyUser from "./ModifyUser";
import Loading from "../../../components/commons/Loading";
import PasswordReset from "./PasswordReset";
import { useSelector } from "react-redux";
import axios from "axios";
import { columns } from "../../../resources/columns";
import DataTables from "../../../components/DataTables";

const Employees = () => {
  const auth = useSelector((state) => state.auth.value.user);
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
    passwordReset: false,
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

  const detachRole = (staff, role) => {
    setLoading(false);

    const data = {
      role_id: role.id,
    };

    try {
      alter("detach/roles", staff.id, data)
        .then((res) => {
          const result = res.data;

          setStaff(result.data);
          setLoading(false);
          Alert.success("Role Revoked!!", result.message);
        })
        .catch((err) => {
          setLoading(false);
          Alert.success("Oops!!", "Something went wrong!!");
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

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

  const alterStaffDetails = (id, data) => {
    setLoading(true);
    try {
      alter("users", id, data)
        .then((res) => {
          const result = res.data;
          setStaff(result.data);
          setLoading(false);
          Alert.success("Updated", result.message);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
          Alert.error("Oops!", "Something went wrong");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addRoleToStaff = (staff, data) => {
    setLoading(true);
    try {
      store(`users/${staff.id}/roles`, data)
        .then((res) => {
          const result = res.data;
          setLoading(false);
          setStaff(result.data);
          Alert.success("Role", result.message);
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

  const addRole = () => {
    setModalShow({
      ...modalShow,
      visibility: true,
    });
  };

  const resetStaffPassword = () => {
    setModalShow({
      ...modalShow,
      passwordReset: true,
    });
  };

  const handlePasswordChange = (data) => {
    console.log(data);
    setLoading(true);
    try {
      store("change/password", data)
        .then((res) => {
          const result = res.data;
          setLoading(false);
          Alert.success("Password Reset!", result.message);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      const usersData = collection("users");
      const levelsData = collection("gradeLevels");
      const departmentsData = collection("departments");
      const rolesData = collection("roles");

      batchRequests([usersData, levelsData, departmentsData, rolesData])
        .then(
          axios.spread((...res) => {
            const staff = res[0].data.data;
            const levels = res[1].data.data;
            const depts = res[2].data.data;
            const roles = res[3].data.data;

            setRoles(roles);
            setDepartments(depts);
            setEmployees(staff);
            setLevels(levels);
            setLoading(false);
          })
        )
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

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
                  className="btn btn-success btn-rounded btn-sm"
                  onClick={() => setOpen(!open)}
                  disabled={open}
                  style={{ letterSpacing: 1.5 }}
                >
                  <i className="fa fa-user-plus mr-2"></i> ADD STAFF
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

            <DataTables
              pillars={columns.staff}
              rows={employees}
              manageRow={manageStaff}
              canManage
            />
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
              addRoleToStaff={addRoleToStaff}
            />

            <ModifyUser
              roles={roles}
              user={staff}
              show={updateModalShow}
              onHide={() => setUpdateModalShow(false)}
              levels={levels}
              departments={departments}
              alterStaffDetails={alterStaffDetails}
            />

            <PasswordReset
              show={modalShow.passwordReset}
              onHide={() =>
                setModalShow({
                  ...modalShow,
                  passwordReset: false,
                })
              }
              user={staff}
              handlePasswordChange={handlePasswordChange}
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
                    onClick={() => resetStaffPassword()}
                    // onClick={() => console.log("here")}
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
                        {userHasRole(auth, "super-administrator") && (
                          <th>Action</th>
                        )}
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
                            {userHasRole(auth, "super-administrator") && (
                              <td>
                                <button
                                  className="btn btn-rounded btn-danger btn-xs text-uppercase"
                                  onClick={() => detachRole(staff, role)}
                                  disabled={role.label === "staff"}
                                >
                                  <i className="fa fa-close"></i>
                                </button>
                              </td>
                            )}
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
