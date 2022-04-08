import React from "react";

const TableHeader = ({
  columns,
  handleEdit,
  handleDelete,
  assignRole,
  manageStaff,
}) => {
  return (
    <thead>
      <tr>
        {columns.length > 0 &&
          columns.map((col, i) => <th key={i}>{col.label}</th>)}
        {(handleEdit !== undefined ||
          handleDelete !== undefined ||
          assignRole !== undefined ||
          manageStaff !== undefined) && (
          <th>{manageStaff !== undefined ? "Manage" : "Action"}</th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
