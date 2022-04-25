import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextInputField from "../../forms/TextInputField";
import TablePagination from "./TablePagination";
import "./data-table.css";
import TableLoader from "./TableLoader";
import { formatCurrencyWithoutSymbol } from "../../../services/utils/helpers";

const DataTableComponent = ({
  action = undefined,
  pageName,
  columns,
  downloadButton = null,
  batch,
  rows,
  handleEdit = undefined,
  handleDelete = undefined,
  term = "",
  searchKeyWord = undefined,
  isFetching = false,
  exportable = false,
  manageStaff = undefined,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getSearchTerm = (e) => {
    searchKeyWord(e.target.value);
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">{pageName}</h4>

          {downloadButton}
        </div>

        <div className="card-body">
          <div className="searchable">
            <div className="row">
              <div className="col-md-12">
                <TextInputField
                  placeholder={`Search ${pageName}`}
                  value={term}
                  onChange={getSearchTerm}
                  additionalClasses={`search-input`}
                />
              </div>
            </div>
          </div>
          <div className="table-responsive tableWrapper">
            <table className="table table-bordered table-striped verticle-middle table-responsive-sm data-custom-table">
              {/* Table Head */}
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>{col.label.toUpperCase()}</th>
                  ))}
                  {handleEdit !== undefined && <th scope="col">Action</th>}
                  {action !== undefined && <th scope="col">BREAKDOWN</th>}

                  {manageStaff !== undefined && (
                    <th scope="col">Manage Staff</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {isFetching && <TableLoader columnsLength={columns.length} />}
                {!isFetching &&
                  rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <tr key={i}>
                        {columns &&
                          columns.length > 0 &&
                          columns.map((col, index) => (
                            <td key={index}>
                              {"format" in col && col.format === "currency"
                                ? formatCurrencyWithoutSymbol(row[col.key])
                                : row[col.key]}
                            </td>
                          ))}

                        {handleEdit !== undefined && (
                          <td>
                            <span>
                              {handleEdit !== undefined && (
                                <Link
                                  to="#"
                                  onClick={() => handleEdit(row)}
                                  className="mr-4"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Edit"
                                >
                                  <i className="fa fa-pencil color-muted"></i>
                                </Link>
                              )}
                              {handleDelete !== undefined && (
                                <Link
                                  to="#"
                                  onClick={() => handleDelete(row)}
                                  className="mr-4"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Edit"
                                >
                                  <i className="fa fa-trash color-muted"></i>
                                </Link>
                              )}
                            </span>
                          </td>
                        )}

                        {action !== undefined && (
                          <td>
                            <span>
                              <button
                                onClick={() => action(row)}
                                className="mr-4 btn-sm btn btn-primary"
                              >
                                <i className="fa fa-gavel"></i>
                              </button>
                            </span>
                          </td>
                        )}

                        {manageStaff !== undefined && (
                          <td>
                            <span>
                              <Link
                                to="#"
                                onClick={() => manageStaff(row)}
                                className="mr-4"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Edit"
                              >
                                <i className="fa fa-edit color-muted"></i>
                              </Link>
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>

            {!isFetching && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTableComponent;
