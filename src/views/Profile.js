/* eslint-disable no-unused-vars */

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate } from "../services/utils/helpers";

const Profile = () => {
  const user = useSelector((state) => state.auth.value.user);

  return (
    <div className="row">
      <div className="col-md-7">
        <div className="card h-auto">
          <div className="card-header text-center bg-success">
            <h2 className="text-white">
              <i className="la la-user"></i> {user.name}
            </h2>
          </div>

          <div className="card-body">
            <h3 className="text-warning">User Profile</h3>

            <div className="dropdown-divider"></div>

            <div className="list-group">
              <p className="list-group-item">
                <b>Staff ID: </b>
                {user.staff_no}
              </p>

              <p className="list-group-item">
                <b>Department: </b>
                {user.department.name}
              </p>

              <p className="list-group-item">
                <b>Email: </b>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="card">
          <div className="card-body d-flex align-items-center">
            <div className="list-group w-100">
              <Link
                to="#"
                className="list-group-item list-group-item-action list-group-action-hover-primary text-center"
              >
                <i className="fa fa-envelope"></i> Request Password Reset
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>

              <tbody>
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <tr key={index}>
                      <td>{role.name}</td>
                      <td>{formatDate(role.start_date)}</td>
                      <td>
                        {role.expiry_date !== null
                          ? formatDate(role.expiry_date)
                          : "Cannot Expire"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-danger">
                      No User Roles!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
