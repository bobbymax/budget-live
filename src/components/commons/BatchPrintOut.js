import React from "react";
import "./batch.css";
import Pdf from "react-to-pdf";
// import { FiPrinter, FiX } from "react-icons/fi";
import logo from "../../assets/images/batch_logo.png";
// import { Row, Col, Table } from "react-bootstrap";
import { getPaymentType } from "../../services/utils/helpers";
import { useSelector } from "react-redux";

const ref = React.createRef();

const options = {
  orientation: "portrait",
  unit: "in",
  format: [8.27, 11.69],
};

const BatchPrintOut = ({ batch, onClose }) => {
  const budgetYear = useSelector((state) => state.config.value.budget_year);
  return (
    <>
      <Pdf targetRef={ref} filename="claim.pdf" options={options}>
        {({ toPdf }) => (
          <button className="btn btn-success mb-4" onClick={toPdf}>
            <i className="fa fa-print"></i> Print
          </button>
        )}
      </Pdf>

      <button
        className="btn btn-danger mb-4"
        style={{ marginLeft: 4 }}
        onClick={() => onClose()}
      >
        <i className="fa fa-close"></i> Close
      </button>

      <div id="batch" ref={ref}>
        <div className="outer">
          <div className="brandSection">
            <img src={logo} alt="claim ncdmb logo" className="batch-logo" />

            <>
              <div className="row">
                <div className="col-md-8">
                  <h4 className="top-header-name">{`NCDF ${
                    batch ? getPaymentType(batch.batch_no) : null
                  } APPROVAL FORM`}</h4>
                </div>

                <div className="col-md-4">
                  <h5 className="header-topper">{`BATCH NO: ${
                    batch ? batch.batch_no : null
                  }`}</h5>
                </div>
              </div>
            </>
          </div>

          <div className="content-wrap">
            <div className="row">
              <div className="col-md-4">
                <h5 className="aligner">ORIGINATING DIVISION:</h5>
              </div>

              <div className="col-md-8">
                <div className="boax-enter">
                  {batch
                    ? batch.controller.department.name.toUpperCase()
                    : null}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <h5 className="aligner">DIRECTORATE:</h5>
              </div>

              <div className="col-md-8">
                <div className="boax-enter">
                  {batch &&
                  batch.controller.originator !== null &&
                  batch.controller.originator.type === "directorate"
                    ? batch.controller.originator.name.toUpperCase()
                    : batch.controller.department.name.toUpperCase()}
                </div>
              </div>
            </div>
            {batch &&
            getPaymentType(batch.batch_no) === "THIRD PARTY PAYMENT" ? (
              <>
                <div className="row">
                  <div className="col-md-4">
                    <h5 className="aligner">PURPOSE:</h5>
                  </div>

                  <div className="col-md-8">
                    <div className="boax-enter">
                      {batch
                        ? batch.expenditures[0].description.toUpperCase()
                        : null}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <h5 className="aligner">BUDGET HEAD:</h5>
                  </div>

                  <div className="col-md-8">
                    <div className="boax-enter">
                      {batch
                        ? batch.expenditures[0].subBudgetHead.name.toUpperCase()
                        : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="row">
              <div className="col-md-4">
                <h5 className="aligner">BUDGET PERIOD:</h5>
              </div>

              <div className="col-md-8">
                <div className="boax-enter">{budgetYear}</div>
              </div>
            </div>

            {batch && getPaymentType(batch.batch_no) === "STAFF PAYMENT" ? (
              <div className="row">
                <div className="col-md-4">
                  <h5 className="aligner">NO OF CLAIMS IN BATCH:</h5>
                </div>

                <div className="col-md-8">
                  <div className="boax-enter">
                    {batch ? batch.noOfClaim : 0}
                  </div>
                </div>
              </div>
            ) : null}

            {batch &&
            getPaymentType(batch.batch_no) === "THIRD PARTY PAYMENT" ? (
              <>
                <div className="row">
                  <div className="col-md-4">
                    <h5 className="aligner">AMOUNT:</h5>
                  </div>

                  <div className="col-md-8">
                    <div className="boax-enter">
                      {batch
                        ? new Intl.NumberFormat().format(
                            batch.expenditures[0].amount
                          )
                        : null}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <h5 className="aligner">BENEFICIARY:</h5>
                  </div>

                  <div className="col-md-8">
                    <div className="boax-enter">
                      {batch
                        ? batch.expenditures[0].beneficiary.toUpperCase()
                        : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {batch && getPaymentType(batch.batch_no) === "STAFF PAYMENT" ? (
              <div className="staff-list">
                <table className="striped bordered responsive table-sm">
                  <thead id="top-headers-table">
                    <tr>
                      <th>SN</th>
                      <th>BENEFICIARY</th>
                      <th>AMOUNT</th>
                      <th>BUDGET HEAD</th>
                      <th>PURPOSE</th>
                      <th>PV NUMBER</th>
                    </tr>
                  </thead>

                  <tbody>
                    {batch && batch.expenditures.length !== 0
                      ? batch.expenditures.map((expenditure) => (
                          <tr key={expenditure.id}>
                            <td>{expenditure.claim.owner.staff_no}</td>
                            <td>
                              {expenditure.claim.owner.name.toUpperCase()}
                            </td>
                            <td>
                              {new Intl.NumberFormat().format(
                                expenditure.claim.total_amount
                              )}
                              .00
                            </td>
                            <td>{expenditure.subBudgetHead.budgetCode}</td>
                            <td>{expenditure.claim.title}</td>
                            <td></td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>

                <div className="grandTotal">
                  <h5>
                    TOTAL:{" "}
                    {batch ? new Intl.NumberFormat().format(batch.amount) : 0}
                  </h5>
                </div>
              </div>
            ) : null}

            <div className="approval-bar">
              <h4>APPROVALS</h4>
            </div>
            <div className="signatures">
              <div className="row mb-3">
                <div className="col-md-4">
                  <h6>Head of Originating Division:</h6>
                </div>

                <div className="col-md-4">
                  <div className="signature-lines"></div>
                </div>

                <div className="col-md-1">
                  <h6>Date:</h6>
                </div>

                <div className="col-md-3">
                  <div className="signature-lines"></div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-1">
                  <h6>Director:</h6>
                </div>

                <div className="col-md-7">
                  <div className="signature-lines"></div>
                </div>

                <div className="col-md-1">
                  <h6>Date:</h6>
                </div>

                <div className="col-md-3">
                  <div className="signature-lines"></div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-3">
                  <h6>Executive Secretary:</h6>
                </div>

                <div className="col-md-5">
                  <div className="signature-lines"></div>
                </div>

                <div className="col-md-1">
                  <h6>Date:</h6>
                </div>

                <div className="col-md-3">
                  <div className="signature-lines"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BatchPrintOut;
