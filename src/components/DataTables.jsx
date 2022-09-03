/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import Checkbox from "./forms/Checkbox";
import GlobalFilter from "./GlobalFilter";
import {
  FiChevronDown,
  FiChevronUp,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiSettings,
  FiChevronLeft,
} from "react-icons/fi";
import "./commons/tables/customized/tables/table.css";

const DataTables = ({
  pillars,
  rows,
  isFetching = false,
  canManage = false,
  manageRow = undefined,
  handleSelected = undefined,
  selectable = false,
  printable = false,
  exportable = false,
  payments = false,
}) => {
  const columns = useMemo(() => pillars, []);
  const data = useMemo(() => rows, [rows]);

  const selectedHooks = (hooks) => {
    hooks.visibleColumns.push((cols) => {
      return [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
        },
        ...cols,
      ];
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
    selectedFlatRows,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    selectable && selectedHooks
  );

  const { globalFilter, pageIndex, pageSize } = state;

  const handleSelectedRows = (selectedRows) => {
    const selected = [];
    selectedRows?.map((row) => selected.push(row.original));
    return handleSelected(selected);
  };

  const columnLength = selectable ? pillars?.length + 2 : pillars?.length + 1;

  return (
    <div className="col-md-12">
      <div className="card">
        {(printable || exportable || payments) && (
          <div className="card-header">
            <div className="btn-group btn-rounded">
              {printable && (
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  disabled={selectedFlatRows?.length < 1}
                >
                  <i className="fa fa-print mr-2"></i>
                  Print
                </button>
              )}
              {exportable && (
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  disabled={selectedFlatRows?.length < 1}
                >
                  <i className="fa fa-download mr-2"></i>
                  Export CSV
                </button>
              )}
              {payments && (
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  onClick={() => handleSelectedRows(selectedFlatRows)}
                  disabled={selectedFlatRows?.length < 1}
                >
                  <i className="fa fa-send mr-2"></i>
                  Post Payments
                </button>
              )}
            </div>
          </div>
        )}
        <div className="card-body">
          <div className="table-search mb-3">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
          <div className="table-responsive">
            <table
              id="custom-table"
              {...getTableProps()}
              className="table table-striped table-hover table-responsive-sm table-bordered"
            >
              <thead className="bg-dark" style={{ color: "white" }}>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FiChevronDown />
                            ) : (
                              <FiChevronUp />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                      </th>
                    ))}
                    {canManage && <th>Modify</th>}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {isFetching && (
                  <tr>
                    <td colSpan={columnLength} className="text-default">
                      Loading Please wait......
                    </td>
                  </tr>
                )}
                {!isFetching &&
                  (page?.length > 0 ? (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          ))}
                          {canManage && (
                            <td>
                              <button
                                type="button"
                                onClick={() => manageRow(row.original)}
                                className="btn btn-dark btn-sm btn-rounded"
                              >
                                <FiSettings />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columnLength}
                        style={{ color: "red" }}
                        className="uppercase"
                      >
                        No Data Found!!
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div id="table-footer" className="row">
            <div className="col-md-7">
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length} |
                </strong>
              </span>
              <span>
                Go to page:{" "}
                <input
                  type="number"
                  min={1}
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(pageNumber);
                  }}
                  style={{
                    width: 75,
                    padding: "3px 7px",
                    border: "1px solid #e1e1e1",
                    color: "rgba(0,0,0,0.6)",
                  }}
                />
              </span>
            </div>
            <div className="col-md-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{
                  padding: "3px 7px",
                  width: 135,
                  border: "1px solid #e1e1e1",
                  color: "rgba(0,0,0,0.6)",
                }}
              >
                {[10, 25, 50].map((size, i) => (
                  <option value={size} key={i}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <div className="btn-group btn-rounded btn-block" role="group">
                <button
                  type="button"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className="btn btn-dark btn-sm"
                >
                  <FiChevronsLeft />
                </button>
                <button
                  type="button"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="btn btn-dark btn-sm"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="btn btn-dark btn-sm"
                >
                  <FiChevronRight />
                </button>
                <button
                  type="button"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className="btn btn-dark btn-sm"
                >
                  <FiChevronsRight />
                </button>
              </div>
            </div>
          </div>
          {/* <pre className="mt-10">
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre> */}
        </div>
      </div>
    </div>
  );
};

export default DataTables;
