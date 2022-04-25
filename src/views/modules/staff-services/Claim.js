/* eslint-disable react-hooks/exhaustive-deps */
// import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ClaimDetails from "../../../components/commons/widgets/ClaimDetails";
import Alert from "../../../services/classes/Alert";
import { printBatch } from "../../../services/utils/controllers";
import { amountToWords } from "../../../services/utils/helpers";
// import ExportClaimPDF from "../../exports/ExportClaimPDF";
import ExportClaim from "./ExportClaim";
// import ExportClaimPDF from "../../exports/ExportClaimPDF";

export const Claim = (props) => {
  const params = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.value.user);

  const initialState = {
    claim: null,
    printed: false,
  };

  const [state, setState] = useState(initialState);

  const handleDownload = () => {
    setState({
      ...state,
      printed: false,
    });

    navigate("/claims");
  };

  const handlePrintClaim = (data, paymentType) => {
    try {
      const body = {
        type: paymentType,
      };

      printBatch("print/claims", data.id, body)
        .then((res) => {
          const link = document.createElement("a");
          link.href = res.data.data;
          link.setAttribute("download", res.data.data);
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();

          Alert.success("Printed!!", "Document printed successfully!!");
          setState({
            ...state,
            batch: null,
            isPrinting: !state.isPrinting,
          });
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.pathname && params.state) {
      const claim = params.state.claim;

      setState({
        ...state,
        claim,
      });
    }
  }, []);

  return (
    <>
      {!state.printed ? (
        <>
          <h5>PURPOSE OF EXPENDITURE:</h5>
          <h4>
            <strong>
              {state.claim ? state.claim.title.toUpperCase() : null}
            </strong>
          </h4>

          <button
            className="btn btn-success btn-rounded mt-3"
            variant="success"
            onClick={() =>
              setState({
                ...state,
                printed: true,
              })
            }
          >
            <i className="fa fa-print mr-2"></i>
            PRINT CLAIM
          </button>

          <div className="card mt-4">
            <div className="card-body">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>DESCRIPTION</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>

                <tbody>
                  {state.claim && state.claim.instructions.length !== 0
                    ? state.claim.instructions.map((instruction) => (
                        <ClaimDetails
                          key={instruction.id}
                          instruction={instruction}
                        />
                      ))
                    : null}
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      <strong>TOTAL:</strong>
                    </td>
                    <td>
                      <strong>
                        {state.claim
                          ? new Intl.NumberFormat().format(
                              state.claim.total_amount
                            )
                          : null}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="row">
                <div className="col mt-4">
                  <p style={{ textDecoration: "underline" }}>
                    <strong>
                      Amount in Words:{" "}
                      {state.claim
                        ? amountToWords(state.claim.total_amount).toUpperCase()
                        : null}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ExportClaim
          claim={state.claim}
          handlePrintClaim={handlePrintClaim}
          auth={auth}
          onClose={handleDownload}
        />
        // <ExportClaimPDF />
      )}
    </>
  );
};

export default Claim;
