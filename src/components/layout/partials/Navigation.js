/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/newLogoAlone.png";
import logoCompact from "../../../assets/images/logo-text-again.png";
import brand from "../../../assets/images/STAFF SERVICES PORTAL.png";

const Navigation = ({ active, handleToggle }) => {
  return (
    <div className="nav-header">
      <Link to="/" className="brand-logo">
        <img className="logo-abbr" src={logo} alt="logo top" />
        <img className="logo-compact" src={logoCompact} alt="logo compact" />
        <img
          className="brand-title"
          style={{ width: "70% !important" }}
          src={brand}
          alt="brand logo"
        />
      </Link>

      <div className="nav-control" onClick={() => handleToggle()}>
        <div className={`hamburger ${active && "is-active"}`}>
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
