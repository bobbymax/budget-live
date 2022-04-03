import moment from "moment";
import React from "react";
import { formatCurrency } from "../../../services/utils/helpers";

const InstructionWidget = ({ instruction, onDestroy }) => {
  return (
    <tr>
      <td>{moment(instruction.from).format("LL")}</td>
      <td>{moment(instruction.to).format("LL")}</td>
      <td>{instruction.description}</td>
      <td>{formatCurrency(instruction.amount)}</td>

      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDestroy(instruction)}
        >
          <i className="fa fa-close"></i>
          {/* <FiX /> */}
        </button>
      </td>
    </tr>
  );
};

export default InstructionWidget;
