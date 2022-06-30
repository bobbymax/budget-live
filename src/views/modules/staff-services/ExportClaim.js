/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import Pdf from "react-to-pdf";
import logo from "../../../assets/images/claim_logo.png";
import Alert from "../../../services/classes/Alert";
import { formatDate, amountToWords } from "../../../services/utils/helpers";
import "./Claim.css";

const ref = React.createRef();

// const options = {
//   orientation: "potrait",
//   unit: "in",
//   format: [8.27, 11.69],
// };

const ExportClaim = ({ claim, auth, handlePrintClaim, onClose }) => {
  const [state, setState] = useState(null);
  // const [user, setUser] = useState(null);

  const printClaim = (claim) => {
    Alert.flash("Print Claim!!", "info", "Do you wish to continue?")
      .then((result) => {
        if (result.isConfirmed) {
          const balance =
            parseFloat(claim?.total_amount) - parseFloat(claim?.spent_amount);
          const totalAmountInWords = amountToWords(claim?.total_amount);
          const balanceInWords = amountToWords(balance);
          handlePrintClaim(
            claim,
            claim?.type,
            totalAmountInWords,
            balanceInWords
          );
        }
      })
      .catch((err) => console.log(err.message));
  };

  const styles = {
    container: {
      padding: 30,
      height: "100%",
    },
    outter: {
      border: "1px solid rgba(39, 174, 96,0.7)",
      width: 742,
      paddingBottom: 80,
    },
    claim_id: {
      fontSize: 14,
      float: "right",
      marginTop: 75,
      marginRight: 90,
    },
    logo: {
      width: "58%",
      float: "left",
      marginLeft: 15,
    },
    clearfix: {
      clear: "both",
    },
    midFontSize: {
      fontSize: 18,
    },
    lgFontSize: {
      fontSize: 22,
    },
    topSection: {
      padding: "10px 0 15px 0",
      borderBottom: "3px solid #028a0e",
      marginBottom: 30,
      width: "100%",
    },
    tableStyle: {
      width: "100%",
    },
    thBorders: {
      border: "1px solid #777",
      padding: 7,
    },
    bottonDiv: {
      borderBottom: "1px solid #777",
      padding: "0 0 0 10px",
      marginBottom: 40,
    },
  };

  useEffect(() => {
    if (claim && auth) {
      setState(claim);
      // setUser(auth);
    }
  }, [claim, auth]);

  // console.log(user);

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
          className="btn btn-success btn-lg mb-4"
          onClick={() => printClaim(claim)}
        >
          <i className="fa fa-print mr-2"></i> Print
        </button>

        <button
          className="btn btn-danger btn-lg mb-4"
          style={{ marginLeft: 4 }}
          onClick={() => onClose()}
        >
          <i className="fa fa-close mr-2"></i> Close
        </button>
      </div>

      <div className="claim" ref={ref} style={styles.container}>
        <div className="claimBackground" style={styles.outter}>
          <div style={styles.topSection}>
            <img src={logo} alt="claim ncdmb logo" style={styles.logo} />

            <h5 style={styles.claim_id}>
              CLAIM ID:{" "}
              <strong>{state ? state.reference_no.toUpperCase() : null}</strong>
            </h5>
            <div style={styles.clearfix}></div>
          </div>

          <div className="mb-3" style={{ padding: "0 10px" }}>
            <h5 style={styles.midFontSize}>PURPOSE OF EXPENDITURE:</h5>
            <h4 style={styles.lgFontSize} className="claimTitle">
              {state ? state.title : null}
            </h4>
          </div>

          <div className="mb-5">
            <table style={styles.tableStyle} className="table">
              <thead>
                <tr>
                  <th style={styles.thBorders}>DATE</th>
                  <th style={styles.thBorders}>DESCRIPTION</th>
                  <th style={styles.thBorders}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {state && state.instructions.length !== 0
                  ? state.instructions.map((instruction) => (
                      <tr key={instruction.id}>
                        <td style={styles.thBorders}>{`${formatDate(
                          instruction.from
                        ).toUpperCase()}  -  ${formatDate(
                          instruction.to
                        ).toUpperCase()}`}</td>
                        <td style={styles.thBorders}>
                          {instruction.description}
                        </td>
                        <td style={styles.thBorders}>
                          {new Intl.NumberFormat().format(instruction.amount)}
                        </td>
                      </tr>
                    ))
                  : null}
                <tr>
                  <td colSpan="2" style={styles.thBorders}>
                    <strong>TOTAL:</strong>
                  </td>
                  <td style={styles.thBorders}>
                    <strong>
                      {state
                        ? new Intl.NumberFormat().format(state.total_amount)
                        : null}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={styles.bottonDiv}>
            <p>
              Amount in words:{" "}
              <strong>
                {state ? amountToWords(state.total_amount) : null}
              </strong>
            </p>
          </div>

          <div className="rowConts">
            <div className="keepers lefters">
              <div className="liners mt-4"></div>
              <h6 className="claimTitle">SIGNATURE OF CLAIMANT</h6>
            </div>
            <div className="keepers lefters">
              <div className="liners">
                <h6>{auth ? auth.level.toUpperCase() : null}</h6>
              </div>
              <h6 className="claimTitle">GRADE LEVEL</h6>
            </div>
            <div className="keepers righters">
              <div className="liners mt-4"></div>
              <h6 className="claimTitle">APPROVED</h6>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="rowConts">
            <div className="keepers lefters">
              <div className="liners mt-4">
                <h6>{auth ? auth.name.toUpperCase() : null}</h6>
              </div>
              <h6 className="claimTitle">NAME IN BLOCKS</h6>
            </div>
            <div className="keepers lefters">
              <div className="liners mt-4">
                <h6>{auth ? auth.staff_no : null}</h6>
              </div>
              <h6 className="claimTitle">STAFF NUMBER</h6>
            </div>
            <div className="keepers righters">
              <div className="liners mt-5"></div>
              <h6 className="claimTitle">NAME IN BLOCKS</h6>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportClaim;
