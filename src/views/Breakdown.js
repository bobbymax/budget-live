import React from "react";
import TableCard from "../components/commons/tables/customized/TableCard";

const Breakdown = ({ data = [], headers = [], title = "" }) => {
  return (
    <>
      <TableCard rows={data} columns={headers} />
    </>
  );
};

export default Breakdown;
