/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../components/commons/Loading";
import InstructionWidget from "../../../components/commons/widgets/InstructionWidget";
import TextInputField from "../../../components/forms/TextInputField";
import { alter, collection, store } from "../../../services/utils/controllers";
import AddInstruction from "./AddInstruction";

export const Instructions = (props) => {
  const params = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.value.user);

  const initialState = {
    claim: null,
    claim_id: 0,
    title: "",
    instructions: [],
    status: "",
  };

  const [state, setState] = useState(initialState);
  const [modal, setModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [benefits, setBenefits] = useState([]);
  const [benefit, setBenefit] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data) => {
    setState({
      ...state,
      instructions: [data, ...state.instructions],
    });
  };

  const fetchBen = (value) => {
    collection("benefits/" + value)
      .then((res) => setBenefit(res.data.data))
      .catch((err) => console.log(err));
  };

  const fetchChild = async (value) => {
    const benefits = await collection("benefits/" + value);
    const data = benefits.data.data;

    return data;
  };

  const handleInstructionDestroy = (value) => {
    setState({
      ...state,
      instructions: state.instructions.filter(
        (instruction) => instruction.id !== value.id
      ),
    });
  };

  const updateGrandTotal = (sum) => {
    return setTotal(sum);
  };

  const registerClaim = () => {
    setLoading(true);
    const data = {
      claim_id: state.claim_id,
      instructions: state.instructions,
      status: "registered",
    };

    try {
      store("claim/instructions", data)
        .then((res) => {
          // console.log(res);
          setLoading(false);
          navigate("/claims");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.path && params.state) {
      const claim = params.state.claim;

      setState({
        ...state,
        claim: claim,
        claim_id: claim.id,
        title: claim.title,
      });
    }

    if (state.instructions && state.instructions.length !== 0) {
      const sum = state.instructions.reduce(
        (sum, instruction) => sum + parseFloat(instruction.amount),
        0
      );
      updateGrandTotal(sum);
    }
  }, [state.instructions]);

  const getBenefits = () => {
    collection("benefits")
      .then((res) => setBenefits(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (params.pathname && params.state) {
      const claim = params.state.claim;
      const status = params.state.actionType;

      setState({
        ...state,
        claim: claim,
        claim_id: claim.id,
        title: claim.title,
      });
    }

    getBenefits();
  }, []);

  // console.log(state.instructions);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="form-group">
        <label className="form-label">CLAIM TITLE</label>
        <TextInputField
          className="form-control"
          type="text"
          disabled={state.claim}
          value={state.title}
          onChange={(e) => setState({ ...state, title: e.target.value })}
        />
      </div>

      <AddInstruction
        show={modal}
        claim={state.claim}
        onSubmit={handleSubmit}
        benefits={benefits}
        benefit={benefit}
        fetcher={fetchBen}
        children={fetchChild}
        onHide={() => {
          setModal(false);
        }}
      />

      <div className="">
        <div className="row mb-3">
          <div className="col">
            <button
              className="btn btn-success btn-rounded"
              onClick={() => setModal(true)}
            >
              <i className="fa fa-plus mr-2" style={{ marginRight: "2px" }}></i>
              ADD DETAILS
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-striped table-hover table-bordered">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {state.instructions && state.instructions.length !== 0
                  ? state.instructions.map((instruction, i) => {
                      if (state.instructions) {
                        return (
                          <InstructionWidget
                            key={i}
                            instruction={instruction}
                            onDestroy={handleInstructionDestroy}
                          />
                        );
                      } else {
                        return null;
                      }
                    })
                  : null}
              </tbody>
            </table>
            <h4 className="mb-4 pull-right">
              TOTAL: <span style={{ marginLeft: 25 }}>NGN {total}</span>
            </h4>
          </div>
        </div>
      </div>

      <div className="">
        <button
          className="btn btn-success btn-lg btn-rounded"
          type="button"
          onClick={registerClaim}
          disabled={state.instructions.length === 0 || loading}
        >
          <i
            className="fa fa-paper-plane mr-2"
            style={{ marginRight: "2px" }}
          ></i>
          Submit
        </button>
      </div>
    </>
  );
};

export default Instructions;
