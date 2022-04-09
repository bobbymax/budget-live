/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { alter, collection } from "../../../services/utils/controllers";
import Alert from "../../../services/classes/Alert";
import TextInputField from "../../../components/forms/input/TextInputField";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";

const RefundRequests = (props) => {
  const [refunds, setRefunds] = useState([]);
  const auth = useSelector((state) => state.auth.value.user);

  const initialState = {
    id: 0,
    subBudgetHeadId: 0,
    exp_id: 0,
    description: "",
    sub_budget_head_id: 0,
    subBudgetHeadName: "",
    budgetCode: "",
    amount: 0,
    balance: 0,
    newBalance: 0,
    status: "",
    showForm: false,
  };

  const [state, setState] = useState(initialState);
  const [subBudgetHead, setSubBudgetHead] = useState({});
  const [subBudgetHeads, setSubBudgetHeads] = useState({});

  const loadRefundDetails = (data) => {
    setState({
      ...state,
      id: data.id,
      exp_id: data.expenditure.id,
      sub_budget_head_id: data.expenditure.subBudgetHead.id,
      subBudgetHeadName: data.expenditure.subBudgetHead.name,
      budgetCode: data.expenditure.subBudgetHead.budgetCode,
      amount: data.expenditure.amount,
      showForm: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      oldSubBudgetHead: state.sub_budget_head_id,
      sub_budget_head_id: state.subBudgetHeadId,
      description: state.description,
      amount: state.amount,
      status: "approved",
    };

    alter("refunds", state.id, data).then((res) => {
      Alert.success("Created!!", res.data.message);

      setState(initialState);
    });

    setState({
      ...state,
      id: 0,
      subBudgetHeadId: 0,
      exp_id: 0,
      description: "",
      sub_budget_head_id: 0,
      subBudgetHeadName: "",
      budgetCode: "",
      amount: 0,
      balance: 0,
      newBalance: 0,
      status: "",
      showForm: false,
    });
  };

  const loadRefunds = () => {
    collection("refunds")
      .then((res) => setRefunds(res.data.data))
      .catch((err) => console.log(err.message));
  };

  const loadSubBudgetHeads = () => {
    collection("subBudgetHeads")
      .then((res) => {
        setSubBudgetHeads(res.data.data);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    loadRefunds();
    loadSubBudgetHeads();
  }, []);

  useEffect(() => {
    if (state.isFunded) {
      setState({
        ...state,
        id: subBudgetHead.fund.id,
      });
    } else {
    }
  }, [state.isFunded]);

  useEffect(() => {
    const single =
      state.sub_budget_head_id > 0 &&
      subBudgetHeads.filter((sub) => sub.id == state.sub_budget_head_id && sub);

    if (single.length > 0) {
      setSubBudgetHead(single[0]);
      setState({
        ...state,
        approved_amount: parseFloat(single[0].approved_amount),
        description: single[0].fund !== null ? single[0].fund.description : "",
      });
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (state.approved_amount && state.amount) {
      const newBalance = state.approved_amount + state.amount;

      setState({
        ...state,
        newBalance: newBalance,
      });
    }
  }, [state.amount]);

  return (
    <>
      {state.showForm ? (
        <>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">HANDLE REQUEST</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <TextInputField
                      value={state.subBudgetHeadName}
                      onChange={(e) =>
                        setState({
                          ...state,
                          subBudgetHeadName: e.target.value,
                        })
                      }
                      placeholder="ENTER SUB BUDGET NAME HERE"
                      readOnly
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInputField
                      value={state.budgetCode}
                      onChange={(e) =>
                        setState({ ...state, budgetCode: e.target.value })
                      }
                      readOnly
                      placeholder="SUB BUDGET CODE"
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInputField
                      type="number"
                      value={state.amount}
                      onChange={(e) =>
                        setState({ ...state, amount: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                  <div className="col-md-8">
                    <CustomSelect
                      value={state.subBudgetHeadId}
                      onChange={(e) => {
                        setState({ ...state, subBudgetHeadId: e.target.value });
                      }}
                    >
                      <CustomSelectOptions
                        label="SELECT SUB BUDGET HEAD"
                        value={0}
                      />
                      {subBudgetHeads.length > 0 &&
                        subBudgetHeads.map((sub) => (
                          <CustomSelectOptions
                            key={sub.id}
                            value={sub.id}
                            label={sub.name}
                          />
                        ))}
                    </CustomSelect>
                  </div>
                  <div className="col-md-6">
                    <TextInputField
                      type="number"
                      value={state.balance}
                      onChange={(e) =>
                        setState({ ...state, balance: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <TextInputField
                      type="number"
                      value={state.newBalance}
                      onChange={(e) =>
                        setState({ ...state, newBalance: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                  <div className="col-md-12">
                    <TextInputField
                      multiline={4}
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                      placeholder="ENTER DESCRIPTION HERE!!"
                    />
                  </div>
                  <div className="col-md-12 mt-3">
                    <div className="btn-group btn-rounded">
                      <button
                        type="submit"
                        className="btn btn-success btn-sm"
                        disabled={
                          state.description === "" ||
                          state.subBudgetHeadId === 0
                        }
                      >
                        <i className="fa fa-send mr-2"></i>
                        APPROVE REFUND
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setState(initialState)}
                      >
                        <i className="fa fa-close mr-2"></i>
                        CANCEL
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : null}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title text-muted">REFUND REQUESTS</h3>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped table-hover table-bordered ">
            <thead>
              <tr>
                <th>BUDGET NAME</th>
                <th>BENEFICIARY</th>
                <th>DESCRIPTION</th>
                <th>AMOUNT</th>
                <th>DATE REQUESTED</th>
                <th>DATE REFUNDED</th>
                <th>MODIFY</th>
              </tr>
            </thead>

            <tbody>
              {refunds && refunds.length > 0 ? (
                refunds.map((refund) => {
                  if (auth && auth.department.id === refund.department_id) {
                    return (
                      <tr key={refund.id}>
                        <td>{refund.expenditure.subBudgetHead.name}</td>
                        <td>{refund.expenditure.beneficiary}</td>
                        <td>{refund.expenditure.description}</td>
                        <td>{refund.expenditure.amount}</td>
                        <td>{refund.created_at}</td>
                        <td>
                          {refund.closed === 0
                            ? "Not Refunded"
                            : refund.updated_at}
                        </td>

                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => loadRefundDetails(refund)}
                            disabled={refund.closed === 1}
                          >
                            {refund.closed === 1 ? "REFUNDED" : "LOAD REQUEST"}
                          </Button>
                        </td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-danger">
                    NO DATA FOUND!!!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RefundRequests;
