/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import BatchPrintOut from "../../../components/commons/BatchPrintOut";
import Loading from "../../../components/commons/Loading";
import useApi from "../../../services/hooks/useApi";
import { collection } from "../../../services/utils/controllers";

const Payments = (props) => {
  const { request, data: batches, loading } = useApi(collection);

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

  const [state, setState] = useState(initialState);

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

  useEffect(() => {
    request("batches");
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}

      {!state.isPrinting ? (
        <>
          <>
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Payments</h4>
                </div>

                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped vertical middle table reponsive-sm">
                      <thead>
                        <tr>
                          <th>BUDGET CODE</th>
                          <th>AMOUNT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {batches.length > 0 ? (
                          batches.map((batch) => (
                            <tr key={batch.id}>
                              <td>
                                <button
                                  className="btn btn-success mr-3"
                                  onClick={() => handleBatchPrint(batch)}
                                >
                                  <i className="fa fa-print"></i>
                                  {/* <FiPrinter /> */}
                                </button>
                                {batch.batch_no}
                              </td>
                              <td>{`NGN ${new Intl.NumberFormat().format(
                                batch.amount
                              )}`}</td>
                              <td>
                                <span
                                  className={
                                    "badge badge-" + currentStat(batch.status)
                                  }
                                >
                                  {batch.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-danger">
                              NO DATA FOUND!!!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        </>
      ) : (
        <BatchPrintOut batch={state.batch} onClose={printingDone} />
      )}
    </>
  );
};

export default Payments;
