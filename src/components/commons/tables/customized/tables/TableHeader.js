import React from "react";

const TableHeader = ({
  columns,
  handleEdit,
  handleDelete,
  assignRole,
  manageStaff,
  reverseBatch,
  destroyExpenditure,
  trackPayment,
}) => {
  return (
    <thead>
      <tr>
        {columns.length > 0 &&
          columns.map((col, i) => <th key={i}>{col.label}</th>)}
        {(handleEdit !== undefined ||
          handleDelete !== undefined ||
          assignRole !== undefined ||
          manageStaff !== undefined ||
          reverseBatch !== undefined ||
          destroyExpenditure !== undefined) && (
          <th>{manageStaff !== undefined ? "Manage" : "Action"}</th>
        )}
        {trackPayment !== undefined && <th>Track</th>}
      </tr>
    </thead>
  );
};

export default TableHeader;
