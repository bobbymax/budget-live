/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo (2).png";
import { authenticate } from "../../features/auth/userSlice";
import { login } from "../../services/utils/auth/auth.controller";
import "./login.css";

const StaffLoginVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSucess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const breaks = location.pathname;
    const parts = breaks.split("/");
    setLoading(true);

    const data = {
      staff_no: parts[3],
      password: parts[4],
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
  }, []);

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

export default StaffLoginVerification;
