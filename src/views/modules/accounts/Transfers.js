import React, { useEffect, useState } from "react";
import { collection } from "../../../services/utils/controllers";

const Transfers = () => {
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);

  useEffect(() => {
    try {
      const subBudgetHeadsData = collection("subBudgetHeads");
      const departmentsData = collection("departments");
    } catch (error) {
      console.log(error);
    }
  }, []);

  return <div>Transfers</div>;
};

export default Transfers;
