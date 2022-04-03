import React from "react";
import { Link } from "react-router-dom";
import "../cards/custom-card.css";

const ModuleCard = ({
  name,
  path,
  children,
  entity,
  color = "success",
  handleNav = undefined,
}) => {
  return (
    <>
      <Link to={path} state={{ module: entity }}>
        <div className={`widget-stat card bg-${color} budget-box-shadow`}>
          <div className="card-body p-4">
            <div className="media">
              <span className="me-3">
                <i className="flaticon-381-settings" />
              </span>

              <div className="media-body text-white text-end">
                <p className="mb-1" style={{ textAlign: "right" }}>
                  {name}
                </p>

                <h3 className="text-white" style={{ textAlign: "right" }}>
                  {children.length}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ModuleCard;
