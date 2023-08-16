import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { CSVLink } from "react-csv";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import {
  buildHeaders,
  formatCurrency,
  formatCurrencyWithoutSymbol,
} from "../../../../services/utils/helpers";
import "./custom.css";

const CustomTable = ({
  columns,
  data,
  manage = undefined,
  view = undefined,
  reverse = undefined,
  print = undefined,
  destroy = undefined,
  isSearchable = false,
  downloadable = false,
  breakdown = undefined,
}) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [headers, setHeaders] = useState([]);

  const actionBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__action__btn"
        onClick={() => manage(raw)}
      >
        <span className="material-icons-sharp">settings</span>
      </button>
    );
  };

  const breakdownActionTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__action__btn"
        onClick={() => breakdown(raw)}
      >
        <span className="material-icons-sharp">construction</span>
      </button>
    );
  };

  const destroyBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__action__btn"
        onClick={() => destroy(raw?.id)}
        disabled={raw?.status !== "cleared"}
      >
        <span className="material-icons-sharp">remove</span>
      </button>
    );
  };

  const printBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__dark"
        onClick={() => print(raw)}
      >
        <span className="material-icons-sharp">print</span>
      </button>
    );
  };

  const reverseBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__danger"
        onClick={() => reverse(raw)}
        disabled={!raw?.canBeReversed || raw?.status !== "pending"}
      >
        <span className="material-icons-sharp">history</span>
      </button>
    );
  };

  const dateBodyTemplate = (raw) => {
    for (const property in raw) {
      if (
        property === "created_at" ||
        property === "updated_at" ||
        property === "due_date" ||
        property === "paid_at"
      ) {
        return moment(raw[property]).format("LL");
      }
    }
  };

  const viewDataTemplate = (raw) => {
    return (
      <button
        type="button"
        className="view__action__btn"
        onClick={() => view(raw)}
      >
        <span className="material-icons-sharp">visibility</span>
      </button>
    );
  };

  const currencyTemplate = (raw) => {
    for (const property in raw) {
      if (
        property === "booked_expenditure" ||
        property === "amount" ||
        property === "actual_expenditure"
      ) {
        return formatCurrencyWithoutSymbol(raw[property]);
      }
    }
  };

  const hasCurrencyCol = (raw, col) => {
    return formatCurrencyWithoutSymbol(raw[col?.field]);
  };

  const specialCurrency = (raw) => {
    for (const property in raw) {
      if (
        property === "approved_amount" ||
        property === "total_amount" ||
        property === "booked_balance"
      ) {
        return formatCurrency(raw[property]);
      }
    }
  };

  const statusTemplate = (raw) => {
    for (const property in raw) {
      if (property === "status") {
        return (
          <span className={`stat_badge ${getStatus(raw[property])}`}></span>
        );
      }
    }
  };

  const getStatus = (text) => {
    let status;

    switch (text) {
      case "pending":
        status = "stat_warning";
        break;

      case "batched":
        status = "stat_secondary";
        break;

      case "paid":
        status = "stat_primary";
        break;

      case "reversed":
        status = "stat_danger";
        break;

      default:
        status = "stat_info";
        break;
    }

    return status;
  };

  const percentageTemplate = (raw) => {
    const keys = Object.keys(raw);
    // console.log(keys, raw);
    return `${raw[getPercentageKey(keys)]}%`;
  };

  const getPercentageKey = (keys) => {
    switch (keys) {
      case keys.includes("interest_rate"):
        return "interest_rate";

      default:
        return "commitment";
    }
  };

  useEffect(() => {
    if (columns?.length > 0 && data.length > 0) {
      setHeaders(buildHeaders(columns));
    }
  }, [columns, data]);

  return (
    <div className="col-md-12">
      <div className="prime__table">
        <div className="card">
          <div className="card-body">
            {downloadable && (
              <div className="csv__btn">
                <div className="pull-right">
                  <CSVLink
                    className="download__bttn"
                    data={data}
                    headers={headers}
                    filename="Budget Overview"
                  >
                    <span className="material-icons-sharp">download</span>
                    <p>Download CSV</p>
                  </CSVLink>
                </div>
              </div>
            )}

            <div className="table-search mb-3">
              {isSearchable && (
                <InputText
                  className="search__form"
                  placeholder="Search Record"
                  onInput={(e) =>
                    setFilters({
                      global: {
                        value: e.target.value,
                        matchMode: FilterMatchMode.CONTAINS,
                      },
                    })
                  }
                />
              )}
            </div>
            <div className="table-responsive">
              <DataTable
                value={data}
                filters={filters}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                totalRecords={data?.length}
              >
                {columns.map((col, i) => {
                  if (col?.currency) {
                    return (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.isSortable}
                        body={currencyTemplate}
                      />
                    );
                  } else if (col?.hasCurrency) {
                    return (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.isSortable}
                        body={hasCurrencyCol}
                      />
                    );
                  } else if (col?.approved_currency) {
                    return (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.isSortable}
                        body={specialCurrency}
                      />
                    );
                  } else if (col?.percentage) {
                    return (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.isSortable}
                        body={percentageTemplate}
                      />
                    );
                  } else if (col?.status) {
                    return (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.isSortable}
                        body={statusTemplate}
                      />
                    );
                  } else if (col?.date) {
                    return (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.isSortable}
                        body={dateBodyTemplate}
                      />
                    );
                  } else {
                    return (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.isSortable}
                      />
                    );
                  }
                })}
                {manage && <Column body={actionBodyTemplate} />}
                {view && <Column body={viewDataTemplate} />}
                {print !== undefined && <Column body={printBodyTemplate} />}
                {reverse !== undefined && <Column body={reverseBodyTemplate} />}
                {destroy !== undefined && <Column body={destroyBodyTemplate} />}
                {breakdown !== undefined && (
                  <Column body={breakdownActionTemplate} />
                )}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
