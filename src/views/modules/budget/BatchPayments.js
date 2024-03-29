/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { collection, store } from "../../../services/utils/controllers";
import { uniqueNumberGenerator } from "../../../services/utils/helpers";
import BatchWidget from "../../../components/commons/widgets/BatchWidget";
import BatchCard from "../../../components/commons/widgets/BatchCard";
import Loading from "../../../components/commons/Loading";
import { useNavigate } from "react-router-dom";

const BatchPayment = () => {
  const navigate = useNavigate();

  const initialState = {
    boardType: "",
    maxSlot: 0,
    code: "",
    total: 0,
    buttonDisabled: false,
    sub_budget_head_id: 0,
    subBudgetCode: "",
    added: 0,
    removed: null
  };

  const maxSlots = {
    staffPayment: 6,
    thirdParty: 1,
  };

  const [state, setState] = useState(initialState);
  const [expenditures, setExpenditures] = useState([])
  const [batchable, setBatchable] = useState([]);
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(false)

  const defaultData = [
    {
      id: 1,
      title: "STAFF PAYMENT",
      items: batchable.filter(
        (ex) => ex?.payment_type && ex?.payment_type === "staff-payment"
      ),
    },
    {
      id: 2,
      title: "THIRD PARTY",
      items: batchable.filter(
        (ex) => ex?.payment_type && ex?.payment_type === "third-party"
      ),
    },
  ];

  const boardLength = board.length;
  const disableActiveButton = state.maxSlot > 0 && boardLength == state.maxSlot;
  const boardTypeState = state.boardType !== "" && boardLength == 0 && "";

  const batchClaim = (expenditure) => {

    // Filter selected expenditure from expenditures
    const newLoads = expenditures.filter((exp) => exp.id != expenditure.id);
    // Check board length
    const availableSlots =
      expenditure.payment_type === "staff-payment"
        ? maxSlots.staffPayment
        : maxSlots.thirdParty;

    if (board.length == 0) {
      setExpenditures(newLoads);
      setBoard([expenditure, ...board]);
      setState({
        ...state,
        boardType: expenditure.payment_type,
        sub_budget_head_id: expenditure?.sub_budget_head_id,
        maxSlot: availableSlots,
        subBudgetCode: expenditure?.subBudgetHeadCode,
        added: parseInt(expenditure?.id)
      });
    } else {
      if (
        expenditure.payment_type === state.boardType &&
        board.length <= state.maxSlot &&
        expenditure?.sub_budget_head_id == state.sub_budget_head_id
      ) {
        setExpenditures(newLoads);
        setBoard([expenditure, ...board]);
        setState({
          ...state,
          added: parseInt(expenditure?.id)
        });
      }
    }
  };

  const grandPrettyTotal = (num) => {
    return `NGN ${new Intl.NumberFormat().format(num)}`;
  };

  const handleBatcher = () => {
    const data = {
      batch_no: state.code,
      expenditures: board,
      noOfClaim: board.length,
      subBudgetHeadCode: state.subBudgetCode,
      amount: state.total,
      steps: 1,
    };

    store("batches", data)
      .then((res) => {
        const data = res.data.data;
        setBoard([]);
        setState(initialState);
        navigate("/payments");
      })
      .catch((err) => console.log(err.message));
  };

  const handleDelete = (expenditure) => {
    if (board.length >= 1) {
      const claimChoosen = board.filter((b) => expenditure.id == b.id);
      const boardState = board.filter((b) => expenditure.id != b.id);

      if (boardState.length > 0) {
        const newExpenditure = [...expenditures, claimChoosen[0]];

        setExpenditures(newExpenditure);
        setBoard(boardState);

        setState({
          ...state,
          buttonDisabled: state.boardType !== "",
          removed: expenditure?.id
        });
      } else {
        const newExpenditure = [...expenditures, claimChoosen[0]];

        setExpenditures(newExpenditure);
        setBoard(boardState);

        setState({
          ...state,
          sub_budget_head_id: 0,
          boardType: "",
          buttonDisabled: false,
          code: "",
        });
      }
    }
  };

  // console.log(batchable, state)

  useEffect(() => {
    if (boardLength > 0) {
      const total = board.reduce(
        (sum, expenditure) => sum + parseFloat(expenditure.amount),
        0
      );

      setState({
        ...state,
        total: total,
        buttonDisabled: disableActiveButton,
      });
    } else {
      setState({
        ...state,
        total: 0,
        buttonDisabled: false,
      });
    }
  }, [boardLength]);

  useEffect(() => {
    if (state.code !== "") {
      setState({
        ...state,
        code: boardTypeState,
      });
    }
  }, [boardTypeState]);
  
  useEffect(() => {
    try {
      setLoading(true)
      collection("batch/cleared/expenditures")
      .then(res => {
        setBatchable(res.data.data)
        setExpenditures(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err.message)
        setLoading(false)
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    if (state.added > 0) {
      setBatchable(
        batchable?.filter(batch => parseInt(batch?.id) !== state.added)
      )
    }
  }, [state.added])

  useEffect(() => {
    setBatchable(expenditures)
  }, [expenditures])

  return (
    <>
      {loading ? <Loading /> : null}

      <h4 className="content-title content-title-xs mb-3">Expenditures</h4>

      <button
        className="btn btn-success btn-md btn-rounded"
        type="button"
        onClick={() =>
          setState({ ...state, code: uniqueNumberGenerator(state.boardType) })
        }
        disabled={boardLength === 0 || state.code !== ""}
      >
        Generate Batch Number
      </button>

      <div className="row mt-5">
        <div className="col-md-8">
          <BatchWidget
            data={defaultData}
            addToBatch={batchClaim}
            isButtonOff={state.buttonDisabled}
            paymentType={state.boardType}
            subBudgetHeadId={state.sub_budget_head_id}
            subBudgetHeadCode={state.subBudgetCode}
            maxSlots={state.maxSlot}
          />
        </div>

        <div className="col-md-4">
          <div className="row">
            <div className="col-md-12">
              <h4 className="content-title content-title-xs mb-3 text-muted">
                - BATCH - {state.code?.toUpperCase()}
              </h4>
            </div>

            {board.length > 0 &&
              board.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  onRemove={handleDelete}
                />
              ))}
            <div className="col-md-12">
              <div className="card bg-warning">
                <div className="card-body">
                  <div className="total mb-3">
                    <h3 className="card-value text-white">
                      {grandPrettyTotal(state.total)}
                    </h3>
                  </div>

                  <h5 className="text-default mb-4">{"GRAND TOTAL"}</h5>
                  <button
                    className="btn btn-success btn-rounded"
                    disabled={state.code === ""}
                    onClick={handleBatcher}
                  >
                    Batch Payments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BatchPayment;
