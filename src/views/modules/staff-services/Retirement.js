/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../components/commons/Loading";
import Alert from "../../../services/classes/Alert";
import { collection } from "../../../services/utils/controllers";

const Retirement = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRetirement = (data) => {
    navigate(`/retire/${data.reference_no}`, {
      state: {
        claim: data,
        todo: "retire",
      },
    });
  };

  const handlePrintOut = (claim) => {
    navigate(`/claims/${claim.reference_no}/print`, {
      state: {
        claim: claim,
        actionType: "print",
        type: "touring-advance",
      },
    });
  };

  useEffect(() => {
    if (auth !== null) {
      setLoading(true);
      collection("claims")
        .then((res) => {
          const data = res.data.data;

          setClaims(
            data.filter(
              (claim) =>
                claim.owner.id === auth.id && claim.type === "touring-advance"
            )
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    }
  }, [auth]);

  useEffect(() => {
    if (
      location.pathname &&
      location.state &&
      location.state.claim &&
      claims.length > 0
    ) {
      try {
        const claim = location.state.claim;
        const status = location.state.status;

        setClaims(
          claims.map((cla) => {
            if (cla.id == claim.id) {
              return claim;
            }

            return cla;
          })
        );

        Alert.success("Updated!!", status);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.length > 0 ? (
                    claims.map((claim) => (
                      <tr key={claim.id}>
                        <td>{claim.title}</td>
                        <td>
                          <div className="btn-group btn-rounded btn-sm">
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={() => handleRetirement(claim)}
                              disabled={claim && claim.rettired}
                            >
                              <i className="fa fa-skyatlas mr-2"></i>
                              RETIRE
                            </button>
                            <button
                              className="btn btn-info"
                              type="button"
                              onClick={() => handlePrintOut(claim)}
                            >
                              <i className="fa fa-eye mr-2"></i>
                              VIEW
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-danger">
                        No Data Found!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Retirement;
