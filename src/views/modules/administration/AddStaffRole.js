/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Alert from "../../../services/classes/Alert";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { store } from "../../../services/utils/controllers";

const AddStaffRole = (props) => {
  const [roles, setRoles] = useState([]);

  const handleModalStateChange = (e) => {
    e.preventDefault();

    const data = {
      user_id: props.user.id,
      roles: roles,
    };

    store(`users/${props.user.id}/roles`, data)
      .then((res) => {
        Alert.success("Role", res.message);
        setRoles([]);
        props.onHide();
      })
      .catch((err) => console.log(err.message));
  };

  const formatRole = () => {
    return (
      props.roles &&
      props.roles.length > 0 &&
      props.roles.map((role) => ({
        value: role.id,
        label: role.name,
      }))
    );
  };

  return (
    <>
      <Modal
        className="modal"
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <>
          <form onSubmit={handleModalStateChange}>
            <div className="modal-header">
              <h5 className="modal-title" id="contained-modal-title-vcenter">
                Add Role
              </h5>
            </div>

            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <>
                      <label className="form-label">Select Role</label>

                      <Select
                        components={makeAnimated()}
                        options={formatRole()}
                        placeholder="Select Roles"
                        onChange={setRoles}
                        value={roles}
                        isMulti={true}
                      />
                    </>
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
                  onClick={props.onHide}
                >
                  <i className="fa fa-times-circle mr-2"></i>
                  Close
                </button>
              </div>
            </div>
          </form>
        </>
      </Modal>
    </>
  );
};

export default AddStaffRole;
