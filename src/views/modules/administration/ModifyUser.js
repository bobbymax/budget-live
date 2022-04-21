// /* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";

const ModifyUser = (props) => {
  const initialState = {
    id: 0,
    staff_no: "",
    grade_level_id: 0,
    department_id: 0,
    name: "",
    email: "",
  };

  const formatLevels = () => {
    return (
      props.levels.length > 0 &&
      props.levels.map((levl) => ({
        key: levl.id,
        label: levl.code,
        name: levl.name,
      }))
    );
  };

  useEffect(() => {
    if (props.user) {
      setState({
        ...state,
        id: props.user.id,
        staff_no: props.user.staff_no,
        grade_level_id: props.user.grade_level_id,
        department_id: props.user.department_id,
        name: props.user.name,
        email: props.user.email,
      });
    }
  }, [props.user]);

  const [state, setState] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      staff_no: state.staff_no,
      grade_level_id: parseInt(state.grade_level_id),
      department_id: parseInt(state.department_id),
      name: state.name,
      email: state.email,
    };

    props.alterStaffDetails(state.id, data);
    setState(initialState);
    props.onHide();
  };

  const formatDept = () => {
    return (
      props.departments.length > 0 &&
      props.departments.map((dept) => ({
        key: dept.id,
        label: dept.name,
        code: dept.code,
      }))
    );
  };

  return (
    <Modal
      className="modal"
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={props.onHide}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2 className="modal-title" id="contained-modal-title-vcenter">
            Modify User
          </h2>
        </div>

        <div className="modal-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <TextInputField
                  placeholder="Enter Staff Number"
                  value={state.staff_no}
                  onChange={(e) =>
                    setState({ ...state, staff_no: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <TextInputField
                  placeholder="Enter Fullname (Surname First)"
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                />
              </div>

              <div className="col-md-3">
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
                />
              </div>

              <div className="col-md-6">
                <TextInputField
                  placeholder="Enter Email Address"
                  value={state.email}
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
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
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-success" type="submit">
            Submit
          </button>

          <button
            className="btn btn-danger"
            type="button"
            onClick={props.onHide}
          >
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModifyUser;
