import React from "react";
import "./batch.css";
// import Pdf from "react-to-pdf";
import logo from "../../assets/images/batch_logo.png";
import {
  formatCurrency,
  getPaymentType,
  getPaymentTypeSmall,
} from "../../services/utils/helpers";
import { useSelector } from "react-redux";
import Alert from "../../services/classes/Alert";

const ref = React.createRef();

// const options = {
//   orientation: "portrait",
//   unit: "in",
//   format: [8.27, 11.69],
// };

const BatchPrintOut = ({ batch, onClose, handlePrintBatch }) => {
  const budgetYear = useSelector((state) => state.config.value.budget_year);

  const printBatch = (batch) => {
    Alert.flash("Print Batch!!", "info", "Do you wish to continue?")
      .then((result) => {
        if (result.isConfirmed) {
          const paymentType = getPaymentTypeSmall(batch.batch_no);
          handlePrintBatch(batch, paymentType);
        }
      })
      .catch((err) => console.log(err.message));
  };

  console.log(getPaymentType(batch.batch_no));

  return (
    <>
      {/* <div className="btn-group btn-rounded btn-lg">
        <Pdf targetRef={ref} filename="claim.pdf" options={options}>
          {({ toPdf }) => (
            <button className="btn btn-success btn-lg mb-4" onClick={toPdf}>
              <i className="fa fa-print mr-2"></i> Print
            </button>
          )}
        </Pdf>

        <button
          className="btn btn-danger btn-lg mb-4"
          style={{ marginLeft: 4 }}
          onClick={() => onClose()}
        >
          <i className="fa fa-close mr-2"></i> Close
        </button>
      </div> */}

      <div className="btn-group btn-rounded btn-lg">
        <button
          type="button"
          className="btn btn-success btn-lg mb-4"
          onClick={() => printBatch(batch)}
        >
          <i className="fa fa-print mr-2"></i> Print
        </button>

        <button
          type="button"
          className="btn btn-danger btn-lg mb-4"
          style={{ marginLeft: 4 }}
          onClick={() => onClose()}
        >
          <i className="fa fa-close mr-2"></i> Close
        </button>
      </div>

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
                            <td>
                              {expenditure.claim !== null &&
                              expenditure.claim.owner
                                ? expenditure.claim.owner.staff_no
                                : "NULL"}
                            </td>
                            <td>{expenditure.beneficiary.toUpperCase()}</td>
                            <td>
                              {formatCurrency(expenditure.amount)}
                              .00
                            </td>
                            <td>{expenditure.subBudgetHead.budgetCode}</td>
                            <td>{expenditure.description.toUpperCase()}</td>
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
              <h4 className="text-white">APPROVALS</h4>
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
