import React, { useEffect, useState } from "react";
import DataTables from "../../../components/DataTables";
import { collection, store } from "../../../services/utils/controllers";
import { columns } from "../../../resources/columns";
import Alert from "../../../services/classes/Alert";

const ClearPayments = () => {
  const [batches, setBatches] = useState([]);

  const handleSelected = (selected) => {
    // console.log(selected);

    const data = {
      payments: selected,
    };

    store("clear/all/payments", data)
      .then((res) => {
        const result = res.data;
        setBatches(result.data);
        Alert.success("Payments Posted!!", result.message);
      })
      .catch((err) => err.response.data.message);
  };

  useEffect(() => {
    try {
      collection("all/payments")
        .then((res) => {
          const result = res.data.data;
          setBatches(result.filter((batch) => batch?.shouldPost === "cleared"));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  //   console.log(batches);

  return (
    <>
      <div className="row">
        <DataTables
          pillars={columns.payments}
          rows={batches}
          handleSelected={handleSelected}
          selectable
          exportable
          printable
          payments
        />
      </div>
    </>
  );
};

export default ClearPayments;
