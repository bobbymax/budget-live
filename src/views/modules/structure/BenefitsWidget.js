import React from "react";
// import { FiTrash2, FiEdit, FiWind } from "react-icons/fi";
// import { button } from "react-bootstrap";

const BenefitsWidget = ({ benefit, onEdit, onDestroy, modalControl }) => {
  return (
    <tr>
      <td>{benefit.name}</td>
      <td>{benefit.parent}</td>
      <td>
        <div className="btn-group btn-rounded">
          <button
            className="btn btn-success btn-sm"
            onClick={() => modalControl(benefit)}
            disabled={!benefit.canAddEntitlement}
          >
            {/* <FiWind style={{ marginRight: 8 }} /> */}
            Add Entitlement
          </button>
          <button
            onClick={() => onEdit(benefit)}
            className="btn btn-warning btn-sm"
          >
            <i className="fa fa-edit"></i>
            {/* <FiEdit /> */}
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDestroy(benefit)}
          >
            <i className="fa fa-trash"></i>
            {/* <FiTrash2 /> */}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BenefitsWidget;
