import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../services/utils/helpers";

const TrackPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [batch, setBatch] = useState({});
  const [tracks, setTracks] = useState([]);

  useState(() => {
    if (
      location.pathname !== "" &&
      typeof location.state === "object" &&
      Object.keys(location.state).length > 0
    ) {
      const batch = location.state.batch;
      setBatch(batch);
      setTracks(batch && batch.tracks);
    }
  }, []);

  // console.log(batch, tracks);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-4">
          <button
            type="button"
            className="btn btn-rounded btn-success btn-sm text-uppercase"
            onClick={() => navigate("/payments")}
          >
            <i className="fa fa-chevron-left mr-2"></i>
            Back to Payments
          </button>
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Batch Details</h3>
            </div>
            <div className="card-body">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>BATCH NO.</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{batch.batch_no}</td>
                    <td>{formatCurrency(batch.amount)}</td>
                    <td>
                      <span
                        className={`badge badge-pill badge-xs badge-rounded badge-${
                          batch.status === "pending" ? "warning" : "success"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">TRACKING</h3>
            </div>
            <div className="card-body">
              {tracks.length > 0 &&
                tracks.map((track, i) => (
                  <div
                    key={i}
                    className={`alert alert-${
                      track.controller === null ? "danger" : "light"
                    }`}
                    role="alert"
                  >
                    {track.controller === null
                      ? `Batch has not been cleared by ${track.stage.toUpperCase()}`
                      : `${track.remarks} BY ${
                          track.controller && track.controller.name
                        }`}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackPayment;
