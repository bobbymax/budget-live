/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import TableCard from "../../../components/commons/tables/customized/TableCard";
import Alert from "../../../services/classes/Alert";
import { alter, collection } from "../../../services/utils/controllers";

const ClearPendingPayments = () => {
  const [payments, setPayments] = useState([]);

  const columns = [
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "batch_no", label: "BATCH NO." },
    { key: "amount", label: "AMOUNT", format: "currency" },
    { key: "level", label: "STAGE" },
    { key: "created_at", label: "RAISED AT" },
    { key: "status", label: "STATUS" },
  ];

  const handlePost = (batch) => {
    console.log(batch);

    const data = {
      subBudgetHeadCode: batch?.subBudgetHeadCode,
      amount: batch?.amount,
      level: batch?.level,
      status: batch?.status,
    };

    try {
      alter("resolving/batches", batch?.id, data)
        .then((res) => {
          const response = res.data;
          setPayments(payments.filter((pay) => pay?.id != response.data?.id));
          Alert.success("Posted!!", response.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      collection("resolve/pending/payments")
        .then((res) => {
          setPayments(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h4 className="content-title content-title-xs mb-3">
            Pending Payments Cleared by Audit
          </h4>
        </div>

        <TableCard columns={columns} rows={payments} handleEdit={handlePost} />
      </div>
    </>
  );
};

export default ClearPendingPayments;
