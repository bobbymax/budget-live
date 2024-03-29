/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  batchRequests,
  collection,
  destroy,
  fetch,
  store,
} from "../../../services/utils/controllers";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import axios from "axios";
import Loading from "../../../components/commons/Loading";
import { formatCurrencyWithoutSymbol } from "../../../services/utils/helpers";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomTable from "../../../components/commons/tables/customized/CustomTable";

const Expenditures = () => {
  const navigate = useNavigate();
  // const auth = useSelector((state) => state?.auth?.value?.user);
  const reconciliations = useSelector(
    (state) => state?.auth?.value?.user?.department?.reconciliations
  );

  // console.log(auth);

  const initialState = {
    claim: null,
    code: "",
    title: "",
    beneficiary: "",
    amount: 0,
    sub_budget_head_id: 0,
    available_balance: 0,
    new_balance: 0,
    budget_code: "",
    claim_id: 0,
    type: "",
    payment_type: "",
    status: "cleared",
    additional_info: "",
  };

  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [exp, setExp] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disableBttn, setDisableBttn] = useState(false);
  const [budgetClosed, setBudgetClosed] = useState(false);

  const columns = [
    {
      field: "subBudgetHeadCode",
      header: "BUDGET CODE",
      isSortable: true,
      currency: false,
    },
    {
      field: "beneficiary",
      header: "Beneficiary",
      isSortable: true,
      currency: false,
    },
    {
      field: "amount",
      header: "Amount",
      isSortable: true,
      currency: true,
    },
    {
      field: "created_at",
      header: "Raised At",
      isSortable: true,
      currency: false,
    },
    {
      field: "status",
      header: "Status",
      isSortable: true,
      currency: false,
      status: true,
    },
  ];

  useEffect(() => {
    const single =
      state.sub_budget_head_id > 0 &&
      subBudgetHeads.filter((sub) => sub.id == state.sub_budget_head_id && sub);

    if (single.length > 0) {
      setState({
        ...state,
        budget_code: single[0]?.budgetCode,
        available_balance: parseFloat(single[0]?.booked_balance),
      });
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (state.available_balance > 0 && state.amount > 0) {
      const value =
        parseFloat(state.available_balance) - parseFloat(state.amount);

      if (value < 0) {
        Alert.error(
          "Oops!!",
          "It seems you have entered an amount greater than what is available!!"
        );
        setState({
          ...state,
          amount: 0,
          new_balance: 0,
        });
      } else {
        setState({
          ...state,
          new_balance: value,
        });
      }
    }
  }, [state.available_balance, state.amount]);

  const handleDestroy = (data) => {
    setLoading(true);

    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          destroy("expenditures", data)
            .then((res) => {
              const result = res.data;
              setExpenditures(
                expenditures.filter((exp) => exp.id != result.data.id)
              );
              setLoading(false);
              Alert.success("Deleted!!", result.message);
            })
            .catch((err) => {
              setLoading(false);
              Alert.error("Oops!!", "Something went wrong!!");
              console.log(err.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });

    setLoading(false);
  };

  const handleChange = (value) => {
    if (value.length >= 7) {
      setLoading(true);
      collection(`fetch/claims/${value}`)
        .then((res) => {
          const claim = res.data.data;
          setLoading(false);

          if (res.status == 204) {
            console.log(res);
            Alert.warning(
              "Warning!!",
              "This claim exists but has already been cleared!!"
            );
          } else {
            Alert.success("Details!!", res.data.message);
            setState({
              ...state,
              code: claim.reference_no,
              claim: claim,
              title: claim.title,
              beneficiary: claim.owner.name.toUpperCase(),
              amount: claim.total_amount,
              claim_id: claim.id,
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          Alert.error("Not Found!!", "Claim does not exist");
          console.log(err.message);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const data = {
      payment_type: state.payment_type,
      type: state.payment_type === "staff-payment" ? state.type : "other",
      claim_id: state.claim_id,
      sub_budget_head_id: state.sub_budget_head_id,
      amount: state.amount,
      new_balance: state.new_balance,
      beneficiary: state.beneficiary,
      description: state.title,
      status: state.status,
      additional_info: state.additional_info,
    };

    try {
      store("expenditures", data)
        .then((res) => {
          const result = res.data;
          // const expense = result.data

          setLoading(false);
          setExp(result.data);
          setExpenditures([result.data, ...expenditures]);
          Alert.success("Expenditure", result.message);
          setState(initialState);
          setErrors({});
          setOpen(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const paymentType = [
    { key: "staff-claim", label: "STAFF CLAIM" },
    { key: "touring-advance", label: "TOURING ADVANCE" },
    { key: "other", label: "OTHER" },
  ];

  const options = [
    { key: "staff-payment", label: "STAFF" },
    { key: "third-party", label: "THIRD PARTY" },
    { key: "others", label: "OTHERS" },
  ];

  useEffect(() => {
    try {
      setLoading(true);
      const expenditureData = collection("expenditures");
      const subBudgetHeadsData = collection("subBudgetHeads");
      const settings = collection("settings");

      batchRequests([expenditureData, subBudgetHeadsData, settings])
        .then(
          axios.spread((...res) => {
            const exp = res[0].data.data;
            const subs = res[1].data.data;
            const sets = res[2].data?.data;

            const status = sets?.filter(
              (setting) => setting?.key === "budget_status"
            );
            const stat = status?.length > 0 ? status[0] : null;

            const value = stat !== null ? stat?.value === "closed" : false;

            // const allowed =
            //   auth?.staff_no === "10041" || auth?.staff_no === "SUPER"
            //     ? subs
            //     : subs.filter((sub) => Array.from(sub?.budgetCode)[0] === "C");

            setLoading(false);

            setExpenditures(exp);
            setSubBudgetHeads(subs.filter((budget) => budget.fund !== null));
            setBudgetClosed(value);
          })
        )
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (exp !== null) {
      setDisableBttn(true);
      const subBudgetHeadId = exp?.sub_budget_head_id;

      try {
        fetch("subBudgetHeads", subBudgetHeadId)
          .then((res) => {
            const response = res.data.data;

            setSubBudgetHeads(
              subBudgetHeads?.map((sub) => {
                if (sub?.id == response?.id) {
                  return response;
                }

                return sub;
              })
            );

            setExp(null);
            setDisableBttn(false);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [exp]);

  // console.log(expenditures);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-6">
          {reconciliations?.length > 0 ? (
            <div className="alert alert-danger">
              Please you have pending logistics refund{" "}
              <button
                type="button"
                className="btn btn-primary btn-sm btn-rounded mt-2"
                onClick={() => navigate("/reconciliations/fulfillments")}
              >
                <i className="fa fa-send mr-2"></i>
                Go To Refund
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-rounded mb-4"
              onClick={() => setOpen(true)}
              disabled={open || disableBttn || budgetClosed}
              // disabled
            >
              <i className="fa fa-send mr-2"></i>
              CREATE EXPENDITURE
            </button>
          )}
        </div>
        <div className="col-md-6">
          <button
            type="button"
            className="btn btn-warning btn-rounded mb-4 float-right"
            onClick={() => navigate("/batch/claim")}
            disabled={open}
          >
            <i className="fa fa-object-group mr-2"></i>
            BATCH EXPENDITURES
          </button>
        </div>
        {open && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">New Expenditure</h3>
              </div>
              <div className="card-body">
                <div className="form-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-4">
                        <CustomSelect
                          value={state.payment_type}
                          onChange={(e) => {
                            setState({
                              ...state,
                              payment_type: e.target.value,
                            });
                          }}
                        >
                          <CustomSelectOptions
                            label="SELECT PAYMENT"
                            value=""
                            disabled
                          />

                          {options.map((opt, i) => (
                            <CustomSelectOptions
                              key={i}
                              label={opt.label}
                              value={opt.key}
                            />
                          ))}
                        </CustomSelect>
                      </div>

                      <div className="col-md-4">
                        <CustomSelect
                          value={state.type}
                          onChange={(e) => {
                            setState({
                              ...state,
                              type: e.target.value,
                            });
                          }}
                          disabled={state.payment_type === "third-party"}
                        >
                          <CustomSelectOptions
                            label="SELECT PAYMENT TYPE"
                            value=""
                            disabled
                          />

                          {paymentType.map((opt, i) => (
                            <CustomSelectOptions
                              key={i}
                              label={opt.label}
                              value={opt.key}
                            />
                          ))}
                        </CustomSelect>
                      </div>

                      <div className="col-md-4">
                        <TextInputField
                          placeholder="ENTER CLAIM ID"
                          type="text"
                          value={state.code}
                          onChange={(e) => {
                            setState({ ...state, code: e.target.value });
                            handleChange(e.target.value);
                          }}
                          error={
                            errors && errors.code && errors.code.length > 0
                          }
                          errorMessage={errors && errors.code && errors.code[0]}
                          readOnly={
                            state.payment_type === "third-party" ||
                            state.payment_type === "others" ||
                            state.type === "other"
                          }
                        />
                      </div>

                      <div className="col-md-12">
                        <CustomSelect
                          value={state.sub_budget_head_id}
                          onChange={(e) => {
                            setState({
                              ...state,
                              sub_budget_head_id: e.target.value,
                            });
                          }}
                        >
                          <CustomSelectOptions
                            label="SELECT SUB BUDGET HEAD"
                            value={0}
                            disabled
                          />

                          {subBudgetHeads.length > 0 &&
                            subBudgetHeads.map((subBudgetHead) => (
                              <CustomSelectOptions
                                key={subBudgetHead.id}
                                label={subBudgetHead.name}
                                value={subBudgetHead.id}
                              />
                            ))}
                        </CustomSelect>
                      </div>

                      <div className="col-md-6">
                        <TextInputField
                          placeholder="BUDGET CODE"
                          type="text"
                          value={state.budget_code}
                          onChange={(e) =>
                            setState({ ...state, budget_code: e.target.value })
                          }
                          error={
                            errors &&
                            errors.budget_code &&
                            errors.budget_code.length > 0
                          }
                          errorMessage={
                            errors &&
                            errors.budget_code &&
                            errors.budget_code[0]
                          }
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <TextInputField
                          placeholder="AVAILABLE BALANCE"
                          type="text"
                          value={formatCurrencyWithoutSymbol(
                            state.available_balance
                          )}
                          onChange={(e) =>
                            setState({
                              ...state,
                              available_balance: parseFloat(e.target.value),
                            })
                          }
                          error={
                            errors &&
                            errors.available_balance &&
                            errors.available_balance.length > 0
                          }
                          errorMessage={
                            errors &&
                            errors.available_balance &&
                            errors.available_balance[0]
                          }
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <TextInputField
                          placeholder="AMOUNT"
                          value={state.amount}
                          onChange={(e) =>
                            setState({ ...state, amount: e.target.value })
                          }
                          error={
                            errors &&
                            errors.new_balance &&
                            errors.new_balance.length > 0
                          }
                          errorMessage={
                            errors &&
                            errors.new_balance &&
                            errors.new_balance[0]
                          }
                          readOnly={
                            state.payment_type === "staff-payment" &&
                            state.type !== "other"
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <TextInputField
                          placeholder="NEW BALANCE"
                          value={formatCurrencyWithoutSymbol(state.new_balance)}
                          onChange={(e) =>
                            setState({
                              ...state,
                              new_balance: parseFloat(e.target.value),
                            })
                          }
                          error={
                            errors &&
                            errors.new_balance &&
                            errors.new_balance.length > 0
                          }
                          errorMessage={
                            errors &&
                            errors.new_balance &&
                            errors.new_balance[0]
                          }
                          readOnly
                        />
                      </div>

                      <div className="col-md-12">
                        <TextInputField
                          placeholder="BENEFICIARY"
                          type="text"
                          value={state.beneficiary}
                          onChange={(e) =>
                            setState({ ...state, beneficiary: e.target.value })
                          }
                          error={
                            errors &&
                            errors.beneficiary &&
                            errors.beneficiary.length > 0
                          }
                          errorMessage={
                            errors &&
                            errors.beneficiary &&
                            errors.beneficiary[0]
                          }
                          readOnly={
                            state.payment_type === "staff-payment" &&
                            state.type !== "other"
                          }
                        />
                      </div>

                      <div className="col-md-12">
                        <TextInputField
                          placeholder="DESCRIPTION"
                          multiline={2}
                          type="text"
                          value={state.title}
                          onChange={(e) =>
                            setState({ ...state, title: e.target.value })
                          }
                          readOnly={
                            state.payment_type === "staff-payment" &&
                            state.type !== "other"
                          }
                        />
                      </div>

                      <div className="col-md-12">
                        <TextInputField
                          placeholder="ADDITIONAL INFO"
                          value={state.additional_info}
                          onChange={(e) =>
                            setState({
                              ...state,
                              additional_info: e.target.value,
                            })
                          }
                          error={
                            errors &&
                            errors.cannot_expire &&
                            errors.cannot_expire.length > 0
                          }
                          errorMessage={
                            errors &&
                            errors.cannot_expire &&
                            errors.cannot_expire[0]
                          }
                        />
                      </div>

                      <div className="col-md-12 mt-3">
                        <div className="btn-group btn-rounded">
                          <button
                            type="submit"
                            className="btn btn-success"
                            disabled={
                              state.amount == 0 ||
                              state.beneficiary === "" ||
                              state.payment_type === "" ||
                              state.description
                            }
                          >
                            <i className="fa fa-send mr-2"></i> Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              setState(initialState);
                              setErrors({});
                              setOpen(false);
                            }}
                          >
                            <i className="fa fa-close mr-2"></i> Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        <CustomTable
          columns={columns}
          data={expenditures}
          destroy={handleDestroy}
          isSearchable
        />
      </div>
    </>
  );
};

export default Expenditures;
