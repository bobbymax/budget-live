/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Aside from "./components/layout/partials/Aside";
import Footer from "./components/layout/partials/Footer";
import Header from "./components/layout/partials/Header";
import Navigation from "./components/layout/partials/Navigation";
import { fetchSiteConfig } from "./features/config/configSlice";
import { collection } from "./services/utils/controllers";
import AdminDashboard from "./views/AdminDashboard";

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth.value.user);
  const dash = useSelector((state) => state.auth.value.dashboardState);

  const dispatch = useDispatch();

  const [active, setActive] = useState(false);
  const [dashboardState, setDashboardState] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };

  useEffect(() => {
    if (auth) {
      try {
        collection("settings")
          .then((res) => {
            dispatch(fetchSiteConfig(res.data));
          })
          .catch();
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth]);

  useEffect(() => {
    if (active) {
      const intervalI = setInterval(() => {
        setActive(false);
      }, 2500);

      return () => clearInterval(intervalI);
    }
  }, [active]);

  useEffect(() => {
    setDashboardState(dash);
  }, [dash]);

  return (
    <>
      <div
        id="main-wrapper"
        style={{ opacity: 1 }}
        className={`${active ? "show menu-toggle" : ""}`}
      >
        <Navigation active={active} handleToggle={handleToggle} />
        <Header />
        <Aside active={active} />

        <div className="content-body">
          <div className="container-fluid">
            {auth ? (
              auth.hasChangedPassword ? (
                dashboardState ? (
                  <AdminDashboard />
                ) : (
                  children
                )
              ) : (
                <Navigate to="reset-password" />
              )
            ) : (
              <Navigate to="/login" />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProtectedRoute;
