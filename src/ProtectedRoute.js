/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import ChatBox from "./components/commons/ChatBox"
import Aside from "./components/layout/partials/Aside";
import Footer from "./components/layout/partials/Footer";
import Header from "./components/layout/partials/Header";
import Navigation from "./components/layout/partials/Navigation";
import { fetchSiteConfig } from "./features/config/configSlice";
import { collection } from "./services/utils/controllers";

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth.value.user);

  const dispatch = useDispatch();

  const [active, setActive] = useState(false);

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
                children
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
