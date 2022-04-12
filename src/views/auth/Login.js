/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo (2).png";
import ButtonField from "../../components/forms/ButtonField";
import TextInputField from "../../components/forms/TextInputField";
import { authenticate } from "../../features/auth/userSlice";
import { login } from "../../services/utils/auth/auth.controller";
import "./login.css";

const Login = () => {
  const [staffNo, setStaffNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSucess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      staff_no: staffNo,
      password,
    };

    try {
      setLoading(true);
      login(data)
        .then((res) => {
          setSucess(true);
          setLoading(false);
          setError(false);

          setTimeout(() => {
            dispatch(authenticate(res.data));

            setStaffNo("");
            setPassword("");

            navigate("/");
          }, 2000);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);

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
                      {success ? (
                        <div
                          className="alert alert-success text-center"
                          style={{ backgroundColor: "#17bf3e" }}
                        >
                          <b style={{ color: "white" }}>Login successful!!</b>
                        </div>
                      ) : null}

                      {error && (
                        <div className="alert alert-danger text-center">
                          <b>Login failed!!</b>
                        </div>
                      )}

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

                        <TextInputField
                          label="Password"
                          type="password"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading ? true : false}
                        />

                        <ButtonField
                          type="submit"
                          disabled={loading ? true : false}
                          variant="success"
                        >
                          {loading ? (
                            <i className="fa fa-spinner fa-spin"></i>
                          ) : (
                            "Sign Me In"
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

export default Login;
