/* eslint-disable eqeqeq */
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../../components/commons/Loading";
import TableCard from "../../../components/commons/tables/customized/TableCard";
import TextInputField from "../../../components/forms/input/TextInputField";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import Alert from "../../../services/classes/Alert";
import {
  alter,
  batchRequests,
  collection,
} from "../../../services/utils/controllers";

const Fulfillments = () => {
  const initialState = {
    id: 0,
    sub_budget_head_id: 0,
    expenditure_id: 0,
    amount: 0,
    balance: 0,
    newBalance: 0,
    description: "",
    beneficiary: "",
    expSubBudgetHeadCode: "",
    expSubBudgetHeadName: "",
    expSubBudgetHeadId: 0,
    updating: false,
  };

  const [state, setState] = useState(initialState);
  const [reconciliations, setReconciliations] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "beneficiary", label: "BENEFICIARY" },
    { key: "description", label: "DESCRIPTION" },
    { key: "amount", label: "AMOUNT", format: "currency" },
    { key: "requested_at", label: "DATE REQUESTED" },
    { key: "status", label: "STATUS" },
  ];

  const manageAction = (recon) => {
    setState({
      ...state,
      id: recon.id,
      expenditure_id: recon.expenditure_id,
      amount: recon.amount,
      description: recon.description,
      beneficiary: recon.beneficiary,
      expSubBudgetHeadCode: recon.expSubBudgetHead,
      expSubBudgetHeadName: recon.expSubBudgetHeadName,
      expSubBudgetHeadId: recon.expSubBudgetId,
      updating: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      expenditure_id: state.expenditure_id,
      expSubBudgetHeadId: state.expSubBudgetHeadId,
      sub_budget_head_id: state.sub_budget_head_id,
    };
    setLoading(true);
    // console.log(data);

    try {
      alter("fulfill/reconciliations", state.id, data)
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
          Alert.success("Fulfilled!!", result.message);
          setState(initialState);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
          Alert.error("Error!!", "Something went wrong!!");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.sub_budget_head_id > 0) {
      const subBudgetHead = subBudgetHeads.filter(
        (sub) => sub.id == state.sub_budget_head_id
      )[0];

      const newBalance =
        parseFloat(subBudgetHead?.booked_balance) - parseFloat(state.amount);

      setState({
        ...state,
        balance: parseFloat(subBudgetHead?.booked_balance),
        newBalance,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    try {
      setLoading(true);
      const reconsData = collection("department/reconciliations");
      const subsData = collection("subBudgetHeads");
      batchRequests([reconsData, subsData])
        .then(
          axios.spread((...res) => {
            const recons = res[0].data.data;
            const subsData = res[1].data.data;

            setReconciliations(recons);
            setSubBudgetHeads(
              subsData.filter((budget) => budget?.fund !== null)
            );
            setLoading(false);
          })
        )
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  // console.log(reconciliations);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        {state.updating && (
          <>
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">MAKE REFUND</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-12">
                            <TextInputField
                              placeholder="SUB BUDGET HEAD"
                              value={state.expSubBudgetHeadName}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  expSubBudgetHeadName: e.target.value,
                                })
                              }
                              disabled
                            />
                          </div>
                          <div className="col-md-3">
                            <TextInputField
                              placeholder="BUDGET CODE"
                              value={state.expSubBudgetHeadCode}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  expSubBudgetHeadCode: e.target.value,
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
                              disabled
                            />
                          </div>
                          <div className="col-md-7">
                            <CustomSelect
                              value={state.sub_budget_head_id}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  sub_budget_head_id: e.target.value,
                                })
                              }
                            >
                              <CustomSelectOptions
                                value={0}
                                label="SELECT SUB BUDGET HEAD"
                                disabled
                              />
                              {subBudgetHeads?.length > 0 &&
                                subBudgetHeads.map((sub) => (
                                  <CustomSelectOptions
                                    key={sub.id}
                                    label={sub.name}
                                    value={sub.id}
                                  />
                                ))}
                            </CustomSelect>
                          </div>
                          <div className="col-md-5">
                            <TextInputField
                              placeholder="BALANCE"
                              value={state.balance}
                              onChange={(e) =>
                                setState({ ...state, balance: e.target.value })
                              }
                              disabled
                            />
                          </div>
                          <div className="col-md-7">
                            <TextInputField
                              placeholder="AMOUNT"
                              value={state.amount}
                              onChange={(e) =>
                                setState({ ...state, amount: e.target.value })
                              }
                              disabled
                            />
                          </div>
                          <div className="col-md-5">
                            <TextInputField
                              placeholder="NEW BALANCE"
                              value={state.newBalance}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  newBalance: e.target.value,
                                })
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
                              readOnly
                            />
                          </div>
                          <div className="col-md-12">
                            <div className="btn-group btn-rounded">
                              <button
                                type="submit"
                                className="btn btn-success"
                                disabled={state.sub_budget_head_id == 0}
                              >
                                <i className="fa fa-send mr-2"></i>
                                FULFILL REQUEST
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
                </div>
              </div>
            </div>
          </>
        )}
        <TableCard
          columns={columns}
          rows={reconciliations}
          manageStaff={manageAction}
        />
      </div>
    </>
  );
};

export default Fulfillments;
