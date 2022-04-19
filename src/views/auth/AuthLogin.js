/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo (2).png";
import ButtonField from "../../components/forms/ButtonField";
import TextInputField from "../../components/forms/TextInputField";
import { getUrl } from "../../services/utils/auth/auth.controller";
import "./login.css";

const AuthLogin = () => {
  const [staffNo, setStaffNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [staff, setStaff] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      staff_no: staffNo,
    };

    try {
      setLoading(true);
      getUrl(data)
        .then((res) => {
          setMessage(res.data.message);
          setStaff(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-wrap">
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      {message !== "" && staff !== undefined ? (
                        <div className="alert alert-success text-center">
                          <b>{staff.name + " " + message}</b>
                        </div>
                      ) : null}

                      <div className="text-center mb-3">
                        <Link to="/">
                          <img
                            className="img-fluid"
                            src={logo}
                            alt="logo brand"
                          />
                        </Link>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <TextInputField
                          label="Staff Number"
                          placeholder="Enter Staff Number"
                          value={staffNo}
                          onChange={(e) => setStaffNo(e.target.value)}
                          required
                          disabled={loading ? true : false}
                        />

                        {/* <TextInputField
                          label="Password"
                          type="password"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading ? true : false}
                        /> */}

                        <ButtonField
                          type="submit"
                          disabled={loading ? true : false}
                          variant="success"
                        >
                          {loading ? (
                            <i className="fa fa-spinner fa-spin"></i>
                          ) : (
                            "GET LOGIN LINK"
                          )}
                        </ButtonField>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
