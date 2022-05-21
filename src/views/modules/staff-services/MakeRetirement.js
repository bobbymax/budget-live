/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import InstructionWidget from "../../../components/commons/widgets/InstructionWidget";
import TextInputField from "../../../components/forms/input/TextInputField";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import { collection, store } from "../../../services/utils/controllers";
import {
  formatCurrency,
  verifyNumOfDays,
} from "../../../services/utils/helpers";

const MakeRetirement = () => {
  const initialState = {
    claim_id: 0,
    title: "",
    claim: null,
    todo: "",
    status: "",
    instructions: [],
    claimTotal: 0,
    total: 0,
    update: false,
  };

  const instructionState = {
    from: "",
    to: "",
    benefit: null,
    categories: [],
    benefit_id: 0,
    additional_benefit_id: 0,
    category: null,
    description: "",
    amount: 0,
    numOfDays: 0,
    unitPrice: 0,
    daysRequired: false,
  };

  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.value.user);

  const [state, setState] = useState(initialState);
  const [instruction, setInstruction] = useState(instructionState);
  const [open, setOpen] = useState(false);
  const [benefits, setBenefits] = useState([]);

  const handleInstructionDestroy = (ins) => {
    const newInstructions =
      state.instructions.length > 0 &&
      state.instructions.filter((instruction) => instruction.id !== ins.id);
    const prevTotal = state.total + ins.amount;

    setState({
      ...state,
      instructions: newInstructions,
      total: prevTotal,
    });
  };

  const handleRetirementSubmit = () => {
    const data = {
      claim_id: state.claim_id,
      instructions: state.instructions,
      status: "registered",
    };

    const url = "claim/instructions";

    try {
      store(url, data)
        .then((res) => {
          const result = res.data;
          setOpen(false);
          setBenefits([]);
          setState(initialState);
          setInstruction(instructionState);
          navigate("/retire", {
            state: {
              claim: result.data,
              status: result.message,
            },
          });
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }

    // console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let count = 1000000000;

    const data = {
      id: Math.random(count),
      from: instruction.from,
      to: instruction.to,
      benefit_id: parseInt(instruction.benefit_id),
      additional_benefit_id: parseInt(instruction.additional_benefit_id),
      description: instruction.description,
      numOfDays: instruction.numOfDays,
      amount: parseFloat(instruction.amount),
      benefit: instruction.benefit,
    };

    setState({
      ...state,
      instructions: [data, ...state.instructions],
    });

    setInstruction(instructionState);
    setOpen(false);
  };

  const getFee = (benefit, daysDiff) => {
    const entitlement =
      benefit && benefit.entitlements && benefit.entitlements.length > 0
        ? benefit.entitlements.filter((ent) => ent && ent.grade === auth.level)
        : [];

    const fee = entitlement.length > 0 ? parseFloat(entitlement[0].amount) : 0;
    return benefit && benefit.numOfDays ? fee * daysDiff : fee;
  };

  useEffect(() => {
    const boardLength = state.instructions.length;
    if (boardLength > 0) {
      const total = state.instructions
        .map((inst) => inst && inst.amount)
        .reduce((sum, prev) => sum + prev, 0);

      const newTotal = state.claimTotal - total;

      setState({
        ...state,
        total: newTotal,
      });
    }
  }, [state.instructions.length]);

  useEffect(() => {
    if (instruction.benefit_id > 0) {
      const benf = benefits.filter(
        (bent) => bent && bent.id == instruction.benefit_id
      );

      const benefit = benf[0];

      setInstruction({
        ...instruction,
        categories: benefit.hasChildren ? benefit.children : [],
        daysRequired: benefit.numOfDays,
        amount: 0,
        benefit,
      });
    }
  }, [instruction.benefit_id]);

  useEffect(() => {
    if (instruction.additional_benefit_id > 0) {
      const benf =
        instruction.categories.length > 0
          ? instruction.categories.filter(
              (cat) => cat && cat.id == instruction.additional_benefit_id
            )
          : [];
      const benefit = benf.length > 0 ? benf[0] : null;
      const fee = getFee(benefit, instruction.numOfDays);

      setInstruction({
        ...instruction,
        amount: fee,
      });
    }
  }, [instruction.additional_benefit_id]);

  useEffect(() => {
    if (
      instruction.benefit_id > 0 &&
      instruction.from !== "" &&
      instruction.to !== ""
    ) {
      const daysDiff = verifyNumOfDays(instruction.from, instruction.to);
      const fee = getFee(instruction.benefit, daysDiff);

      setInstruction({
        ...instruction,
        numOfDays: daysDiff,
        amount: fee,
      });
    }
    // return () => console.log("cleanup");
  }, [instruction.from, instruction.to]);

  useEffect(() => {
    try {
      collection("benefits")
        .then((res) => {
          const data = res.data.data;
          setBenefits(data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (location.pathname && location.state) {
      const claim = location.state.claim;
      const todo = location.state.todo;

      setState({
        ...state,
        claim_id: claim && claim.id,
        title: claim && claim.title,
        claimTotal: claim && claim.total_amount,
        total: claim && claim.total_amount,
        claim,
        todo,
      });
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-4">
          <button
            className="btn btn-success btn-rounded"
            onClick={() => setOpen(!open)}
            disabled={open}
          >
            <i className="fa fa-plus mr-2"></i>
            Add Instructions
          </button>
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <TextInputField
                    label="Title"
                    value={state.title.toUpperCase()}
                    onChange={(e) =>
                      setState({ ...state, title: e.target.value })
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {open && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <CustomSelect
                        label="Benefit"
                        value={instruction.benefit_id}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            benefit_id: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Benefit"
                          value={0}
                          disabled
                        />

                        {benefits.length > 0 &&
                          benefits.map(
                            (benefit) =>
                              benefit.parentId === 0 && (
                                <CustomSelectOptions
                                  key={benefit.id}
                                  label={benefit.name}
                                  value={benefit.id}
                                />
                              )
                          )}
                      </CustomSelect>
                    </div>

                    <div className="col-md-4">
                      <TextInputField
                        label="From"
                        type="date"
                        value={instruction.from}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            from: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <TextInputField
                        label="To"
                        type="date"
                        value={instruction.to}
                        onChange={(e) =>
                          setInstruction({ ...instruction, to: e.target.value })
                        }
                      />
                    </div>

                    {instruction.categories.length > 0 && (
                      <div className="col-md-12">
                        <CustomSelect
                          label="Category"
                          value={instruction.additional_benefit_id}
                          onChange={(e) =>
                            setInstruction({
                              ...instruction,
                              additional_benefit_id: e.target.value,
                            })
                          }
                        >
                          <CustomSelectOptions
                            label="Select Category"
                            value={0}
                            disabled
                          />

                          {instruction.categories.length > 0 &&
                            instruction.categories.map((child) => (
                              <CustomSelectOptions
                                key={child.id}
                                label={child.name}
                                value={child.id}
                              />
                            ))}
                        </CustomSelect>
                      </div>
                    )}

                    {instruction.daysRequired && (
                      <div className="col-md-12">
                        <TextInputField
                          label="Number of Days"
                          type="number"
                          value={instruction.numOfDays}
                          onChange={(e) =>
                            setInstruction({
                              ...instruction,
                              numOfDays: e.target.value,
                            })
                          }
                          disabled
                        />
                      </div>
                    )}

                    <div className="col-md-12">
                      <TextInputField
                        label="Number of Days"
                        value={instruction.description}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter Description"
                        multiline={4}
                      />
                    </div>

                    <div className="col-md-12">
                      <TextInputField
                        label="Amount"
                        value={formatCurrency(instruction.amount)}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            amount: e.target.value,
                          })
                        }
                        disabled={
                          instruction.benefit &&
                          instruction.benefit.label !== "others"
                        }
                      />
                    </div>

                    <div className="col-md-12 mt-3">
                      <div className="btn-group btn-rounded">
                        <button className="btn btn-success" type="submit">
                          Add Detail
                        </button>
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => {
                            setInstruction(instructionState);
                            setOpen(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.instructions.length > 0 ? (
                    state.instructions.map((ins, i) => (
                      <InstructionWidget
                        key={i}
                        instruction={ins}
                        onDestroy={handleInstructionDestroy}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-danger">
                        NO DETAILS ADDED AT THIS TIME!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <h4 className="mb-4 pull-right">
                TOTAL:{" "}
                <span style={{ marginLeft: 10 }}>
                  <strong>{formatCurrency(state.total)}</strong>
                </span>
              </h4>
              <div className="mt-5 btn-group btn-rounded">
                <button
                  type="button"
                  className="btn btn-success btn-md"
                  disabled={state.instructions.length == 0}
                  onClick={handleRetirementSubmit}
                >
                  <i className="fa fa-send mr-2"></i>
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-md"
                  onClick={() => {
                    setOpen(false);
                    setBenefits([]);
                    setState(initialState);
                    setInstruction(instructionState);
                    navigate("/retirement");
                  }}
                >
                  <i className="fa fa-close mr-2"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MakeRetirement;
