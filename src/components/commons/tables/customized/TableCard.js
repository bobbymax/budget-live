/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";
import TableHeader from "./tables/TableHeader";
import TableBody from "./tables/TableBody";
import TableRow from "./tables/TableRow";
import CustomPagination from "./tables/CustomPagination";
import "./tables/table.css";
import {
  elapsed,
  formatCurrency,
  search,
} from "../../../../services/utils/helpers";
import { Link } from "react-router-dom";

const TableCard = ({
  columns,
  rows,
  handleEdit = undefined,
  handleDelete = undefined,
  assignRole = undefined,
  manageStaff = undefined,
  handleBatchPrint = undefined,
  reverseBatch = undefined,
  destroyExpenditure = undefined,
  trackPayment = undefined,
  badge = undefined,
  batchData = false,
  expenditureData = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [computed, setComputed] = useState([]);

  useEffect(() => {
    if (searchKey !== "") {
      setComputed(search(searchKey, rows));
    } else {
      setComputed(rows);
    }
  }, [rows, searchKey]);

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <div className="table-search mb-3">
            <div className="row">
              <div className="col-md-2">
                <select
                  className="form-select btn-square digits"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                >
                  {[2, 10, 15, 25, 50, 100].map((dist, i) => (
                    <option key={i} value={dist}>
                      Show {dist} Entries
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-10">
                <div className="pull-right">
                  <input
                    className="form-control"
                    placeholder="Search Entries Here"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-responsive-sm">
              <TableHeader
                columns={columns}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                assignRole={assignRole}
                manageStaff={manageStaff}
                reverseBatch={reverseBatch}
                destroyExpenditure={destroyExpenditure}
                trackPayment={trackPayment}
              />
              <TableBody>
                {computed.length > 0 ? (
                  computed
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      (currentPage - 1) * itemsPerPage + itemsPerPage
                    )
                    .map((row, i) => (
                      <TableRow key={i}>
                        {columns.map((col) => (
                          <td key={col.key}>
                            {batchData &&
                              "format" in col &&
                              col.format === "button" && (
                                <button
                                  className="btn btn-success mr-3"
                                  onClick={() => handleBatchPrint(row)}
                                >
                                  <i className="fa fa-print"></i>
                                </button>
                              )}
                            {batchData &&
                              "format" in col &&
                              col.format === "button" &&
                              row[col.key]}

                            {"format" in col
                              ? col.format === "currency"
                                ? formatCurrency(row[col.key])
                                : col.format === "badge" && (
                                    <span
                                      className={`text-white badge badge-rounded badge-xs badge-${badge(
                                        row[col.key]
                                      )}`}
                                    >
                                      {row[col.key].toUpperCase()}
                                    </span>
                                  )
                              : row[col.key]}
                          </td>
                        ))}
                        {(handleEdit !== undefined ||
                          handleDelete !== undefined ||
                          assignRole !== undefined ||
                          manageStaff !== undefined ||
                          reverseBatch !== undefined ||
                          destroyExpenditure !== undefined) && (
                          <td>
                            {handleEdit !== undefined && (
                              <Icon.Edit2
                                size={16}
                                onClick={() => handleEdit(row)}
                              />
                            )}{" "}
                            {handleDelete !== undefined && (
                              <Icon.Trash2
                                size={16}
                                onClick={() => handleDelete(row.id)}
                              />
                            )}
                            {destroyExpenditure !== undefined && (
                              <button
                                className="btn btn-xs btn-danger btn-rounded"
                                onClick={() => destroyExpenditure(row.id)}
                                disabled={row.status !== "cleared"}
                              >
                                <Icon.Trash2 size={14} className="mr-2" />
                                Delete
                              </button>
                            )}
                            {assignRole !== undefined && (
                              <Icon.Bookmark
                                size={16}
                                onClick={() => assignRole(row)}
                              />
                            )}
                            {reverseBatch !== undefined && (
                              <span>
                                <Link
                                  to="#"
                                  onClick={() => reverseBatch(row)}
                                  // className={`mr-4 btn btn-danger btn-rounded btn-xs ${
                                  //   (row.status !== "pending" ||
                                  //     elapsed(row.created_at)) &&
                                  //   "disabled"
                                  // }`}
                                  className={`mr-4 btn btn-danger btn-rounded btn-xs ${
                                    (!row.reverseable ||
                                      row.status !== "pending") &&
                                    "disabled"
                                  }`}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Manage"
                                >
                                  <i className="fa fa-repeat color-muted mr-2"></i>
                                  reverse
                                </Link>
                              </span>
                            )}
                            {manageStaff !== undefined && (
                              <span>
                                <Link
                                  to="#"
                                  onClick={() => manageStaff(row)}
                                  className="mr-4"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Manage"
                                >
                                  <i className="fa fa-user-plus color-muted"></i>
                                </Link>
                              </span>
                            )}
                          </td>
                        )}
                        {trackPayment !== undefined && (
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs btn-rounded btn-info"
                              onClick={() => trackPayment(row)}
                              disabled={
                                row.status === "paid" ||
                                row.status === "reversed"
                              }
                            >
                              <i className="fa fa-truck mr-2"></i>
                              track payment
                            </button>
                          </td>
                        )}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={
                        handleEdit !== undefined ||
                        manageStaff !== undefined ||
                        handleBatchPrint !== undefined ||
                        destroyExpenditure !== undefined ||
                        trackPayment !== undefined
                          ? columns.length + 1
                          : columns.length
                      }
                      className="text-danger"
                    >
                      No Data Found!!!
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>
          <div className="pagination justify-content-center">
            <CustomPagination
              total={rows.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCard;
