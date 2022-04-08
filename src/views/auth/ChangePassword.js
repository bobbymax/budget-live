import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonField from "../../components/forms/ButtonField";
import TextInputField from "../../components/forms/input/TextInputField";
import { disembark } from "../../features/auth/userSlice";
import Alert from "../../services/classes/Alert";
import { store } from "../../services/utils/controllers";

const ChangePassword = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const data = {
      user_id: auth.id,
      password_confirmation: confirmPassword,
      password,
    };

    if (password === confirmPassword) {
      try {
        store("change/password", data)
          .then((res) => {
            const result = res.data;
            dispatch(disembark(result));
            setLoading(false);
            setError("");
            Alert.success("Password Reset!", result.message);
            navigate("/");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      setError("Password does not match!!!");
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  {error && (
                    <div className="col-xl-12 mb-3">
                      <div className="alert alert-danger">{error}</div>
                    </div>
                  )}
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <form onSubmit={handleSubmit}>
                        <TextInputField
                          label="Password"
                          type="password"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading ? true : false}
                        />

                        <TextInputField
                          label="Confirm Password"
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                            "RESET PASSWORD"
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

export default ChangePassword;
