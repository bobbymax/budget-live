/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BatchPrintOut from "../../../components/commons/BatchPrintOut";
import Loading from "../../../components/commons/Loading";
import TableCard from "../../../components/commons/tables/customized/TableCard";
import Alert from "../../../services/classes/Alert";
// import useApi from "../../../services/hooks/useApi";
import { collection, destroy } from "../../../services/utils/controllers";

const Payments = (props) => {
  // const { request, data: batches, loading } = useApi(collection);

  const initialState = {
    batch: null,
    isPrinting: false,
  };

  const stats = [
    {
      value: "pending",
      label: "warning",
    },
    {
      value: "registered",
      label: "info",
    },
    {
      value: "queried",
      label: "danger",
    },
    {
      value: "paid",
      label: "success",
    },
    {
      value: "archived",
      label: "secondary",
    },
  ];

  const columns = [
    { key: "batch_no", label: "Batch Code", format: "button" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "status", label: "Status", format: "badge" },
  ];

  const [state, setState] = useState(initialState);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = useSelector((state) => state.auth.value.user);

  const currentStat = (stat) => {
    const curr = stats.filter((s) => stat === s.value);
    return curr[0].label;
  };

  const handleBatchPrint = (batch) => {
    setState({
      ...state,
      batch,
      isPrinting: !state.isPrinting,
    });
  };

  const printingDone = () => {
    setState({
      ...state,
      batch: null,
      isPrinting: !state.isPrinting,
    });
  };

  const handleReverse = (data) => {
    console.log(data);
    setLoading(true);
    try {
      destroy("batches", data.id)
        .then((res) => {
          const result = res.data;
          setBatches(batches.filter((batch) => batch.id != result.data.id));
          setLoading(false);
          Alert.success("Reversed!!", result.message);
        })
        .catch((err) => {
          setLoading(false);
          Alert.error("Oops!!", "Something went wrong!!");
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      collection("batches")
        .then((res) => {
          const result = res.data.data;
          setBatches(result.filter((batch) => batch.user_id == auth.id));
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}

      {!state.isPrinting ? (
        <TableCard
          columns={columns}
          rows={batches}
          batchData
          handleBatchPrint={handleBatchPrint}
          badge={currentStat}
          reverseBatch={handleReverse}
        />
      ) : (
        <BatchPrintOut batch={state.batch} onClose={printingDone} />
      )}
    </>
  );
};

export default Payments;
