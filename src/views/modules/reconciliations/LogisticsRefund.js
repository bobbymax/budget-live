/* eslint-disable eqeqeq */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../components/commons/Loading";
import TableCard from "../../../components/commons/tables/customized/TableCard";
import TextInputField from "../../../components/forms/input/TextInputField";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import Alert from "../../../services/classes/Alert";
import {
  alter,
  collection,
  fetch,
  store,
} from "../../../services/utils/controllers";
import { formatCurrency } from "../../../services/utils/helpers";
import "./refunds.css";

const LogisticsRefund = () => {
  const initialState = {
    id: 0,
    batch_code: "",
    subBudgetHeadId: 0,
    subBudgetHeadName: "",
    subBudgetHeadCode: "",
    paymentType: "",
    expenditures: [],
    expenditure_id: 0,
    department_id: 0,
    department: "",
    amount: 0,
    beneficiary: "",
    description: "",
    expLoaded: false,
    logisticsRequest: false,
    update: false,
  };

  const [state, setState] = useState(initialState);
  const [departments, setDepartments] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(false);

  const budgetYear = useSelector((state) =>
    parseInt(state?.config?.value?.budget_year)
  );
  const columns = [
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "beneficiary", label: "BENEFICIARY" },
    { key: "description", label: "DESCRIPTION" },
    { key: "amount", label: "AMOUNT", format: "currency" },
    { key: "requested_at", label: "DATE REQUESTED" },
    { key: "status", label: "STATUS" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      budget_year: budgetYear,
      expenditure_id: state.expenditure_id,
      department_id: state.department_id,
      beneficiary: state.beneficiary,
      description: state.description,
    };

    setLoading(true);

    if (state.update) {
      try {
        alter("reconciliations", state.id, data)
          .then((res) => {
            const result = res.data;

            setReconciliations(
              reconciliations.map((recon) => {
                if (recon.id == result.data.id) {
                  return result.data;
                }

                return recon;
              })
            );

            setLoading(false);
            Alert.success("Updated", result.message);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
            Alert.error("Oops!!", "Something went wrong!!");
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      try {
        store("reconciliations", data)
          .then((res) => {
            const result = res.data;
            setReconciliations([result.data, ...reconciliations]);
            setLoading(false);
            Alert.success("Requested!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
            Alert.error("Oops!!", "Something went wrong!!");
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    setState(initialState);
  };

  const handleFetchBatch = () => {
    if (state.batch_code !== "") {
      try {
        fetch("batches", state.batch_code)
          .then((res) => {
            const result = res.data.data;
            // console.log(result);
            if (result?.type === "tpp") {
              setState({
                ...state,
                subBudgetHeadId: result.subBudgetHead,
                subBudgetHeadName: result.subBudgetHeadName,
                subBudgetHeadCode: result.subBudgetHeadCode,
                expenditures: result.expenditures,
                paymentType: result.payment_type,
              });
            } else {
              Alert.error(
                "Oops!!",
                "You cannot request a refund for a Third Party or an unfulfilled payment!!"
              );
              setState(initialState);
            }
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = (recon) => {
    setState({
      ...state,
      id: recon.id,
      subBudgetHeadName: recon.expSubBudgetHeadName,
      subBudgetHeadCode: recon.expSubBudgetHead,
      department_id: recon.department_id,
      amount: recon.amount,
      beneficiary: recon.beneficiary,
      description: recon.description,
      expLoaded: true,
      logisticsRequest: true,
      update: true,
    });
  };

  const loadExpenditure = (exp) => {
    setState({
      ...state,
      expenditures: [],
      expenditure_id: exp?.id,
      amount: exp?.amount,
      beneficiary: exp?.beneficiary,
      description: exp?.description,
      expLoaded: true,
    });
  };

  useEffect(() => {
    try {
      collection("departments")
        .then((res) => {
          const result = res.data.data;
          const depts = result.filter(
            (dept) => dept?.subBudgetHeads?.length > 0 && dept?.code !== "FLD"
          );
          setDepartments(depts);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      collection("reconciliations")
        .then((res) => {
          let result;
          if (res.status == 204) {
            result = [];
          } else {
            result = res.data.data;
          }
          setReconciliations(result);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(departments);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-12">
          <button
            type="button"
            className="btn btn-success btn-rounded mb-3"
            onClick={() => setState({ ...state, logisticsRequest: true })}
            disabled={state.logisticsRequest}
          >
            <i className="fa fa-inbox mr-2"></i>
            MAKE REQUEST
          </button>
        </div>
        <div className="col-md-12">
          {state.logisticsRequest && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Logistics Refund Request</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-9">
                    <TextInputField
                      placeholder="ENTER BATCH CODE"
                      value={state.batch_code}
                      onChange={(e) =>
                        setState({ ...state, batch_code: e.target.value })
                      }
                      disabled={state.expLoaded}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-success btn-block"
                      disabled={state.batch_code === "" || state.expLoaded}
                      onClick={handleFetchBatch}
                    >
                      FETCH BATCH
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  {state.expenditures.length > 0 &&
                    state.expenditures.map((exp, i) => (
                      <div className="col-md-4" key={i}>
                        <div className="custom-card">
                          <small
                            style={{
                              display: "block",
                              fontSize: 9,
                              color: "#ecf0f1",
                            }}
                            className="mb-0"
                          >
                            {state?.paymentType?.toUpperCase()}
                          </small>
                          <small className="mb-0">{exp.description}</small>
                          <h4 className="mb-0 text-white">{exp.beneficiary}</h4>
                          <p>{formatCurrency(exp.amount)}</p>
                          <button
                            type="button"
                            className="btn btn-warning btn-xs btn-block"
                            style={{ fontSize: 12 }}
                            onClick={() => loadExpenditure(exp)}
                          >
                            <i className="fa fa-plus mr-2"></i>
                            SELECT EXPENDITURE
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {state.expLoaded && (
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-12">
                            <TextInputField
                              placeholder="SUB BUDGET HEAD"
                              value={state.subBudgetHeadName}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  subBudgetHeadName: e.target.value,
                                })
                              }
                              disabled
                            />
                          </div>
                          <div className="col-md-3">
                            <TextInputField
                              placeholder="BUDGET CODE"
                              value={state.subBudgetHeadCode}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  subBudgetHeadCode: e.target.value,
                                })
                              }
                              disabled
                            />
                          </div>
                          <div className="col-md-9">
                            <TextInputField
                              placeholder="BENEFICIARY"
                              value={state.beneficiary}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  beneficiary: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="col-md-7">
                            <CustomSelect
                              value={state.department_id}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  department_id: e.target.value,
                                })
                              }
                            >
                              <CustomSelectOptions
                                value={0}
                                label="SELECT DEPARTMENT"
                                disabled
                              />
                              {departments?.length > 0 &&
                                departments.map((dept) => (
                                  <CustomSelectOptions
                                    key={dept.id}
                                    label={dept.code}
                                    value={dept.id}
                                  />
                                ))}
                            </CustomSelect>
                          </div>
                          <div className="col-md-5">
                            <TextInputField
                              placeholder="AMOUNT"
                              value={state.amount}
                              onChange={(e) =>
                                setState({ ...state, amount: e.target.value })
                              }
                              disabled
                            />
                          </div>
                          <div className="col-md-12">
                            <TextInputField
                              placeholder="DESCRIPTION"
                              value={state.description}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  description: e.target.value,
                                })
                              }
                              multiline={4}
                            />
                          </div>
                          <div className="col-md-12">
                            <div className="btn-group btn-rounded">
                              <button
                                type="submit"
                                className="btn btn-success"
                                disabled={state.department_id == 0}
                              >
                                <i className="fa fa-send mr-2"></i>
                                REQUEST REFUND
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => setState(initialState)}
                              >
                                <i className="fa fa-close mr-2"></i>
                                CLOSE
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <TableCard
          columns={columns}
          rows={reconciliations}
          handleEdit={handleEdit}
        />
      </div>
    </>
  );
};

export default LogisticsRefund;
