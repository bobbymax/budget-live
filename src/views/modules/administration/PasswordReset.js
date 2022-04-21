import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import TextInputField from "../../../components/forms/input/TextInputField";

const PasswordReset = (props) => {
  const [password, setPassword] = useState("");
  const [changeOnLogin, setChangeOnLogin] = useState(false);

  const changePassword = (e) => {
    e.preventDefault();

    const data = {
      user_id: props.user.id,
      passwordChangeOnLogin: changeOnLogin ? 0 : 1,
      password_confirmation: password,
      password,
    };

    props.handlePasswordChange(data);

    setPassword("");
    setChangeOnLogin(false);
    props.onHide();
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
      <form onSubmit={changePassword}>
        <div className="modal-header">
          <h2 className="modal-title" id="contained-modal-title-vcenter">
            Modify User
          </h2>
        </div>

        <div className="modal-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <TextInputField
                  placeholder="Enter Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="col-md-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    value={changeOnLogin}
                    onChange={(e) => setChangeOnLogin(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    User should change password on login
                  </label>
                </div>
              </div>

              {/* <div className="col-md-6">
                <TextInputField
                  placeholder="Enter Fullname (Surname First)"
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                />
              </div> */}
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
              onClick={() => {
                setPassword("");
                setChangeOnLogin(false);
                props.onHide();
              }}
            >
              <i className="fa fa-close mr-2"></i>
              Close
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordReset;
