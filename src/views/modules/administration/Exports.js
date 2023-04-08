import React, { useEffect, useState } from "react";
import TableCard from "../../../components/commons/tables/customized/TableCard";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import { CSVLink } from "react-csv";
import { fetch } from "../../../services/utils/controllers";
import { fetchers } from "../../../services/utils/helpers";

const URI = "admin/exports";

const Exports = () => {
  const [dependency, setDependency] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const csvExport = {
    data,
    headers: columns,
    filename: `${dependency}-data.csv`,
  };

  useEffect(() => {
    if (dependency !== "") {
      const cols = fetchers?.filter((ln) => ln?.key === dependency)[0];

      setColumns(cols?.cloumns);

      try {
        fetch(URI, dependency)
          .then((res) => {
            const response = res.data.data;

            setData(response);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    } else {
      setColumns([]);
      setData([]);
    }
  }, [dependency]);

  //   console.log(columns, data);

  return (
    <>
      <div className="row">
        <div className="col-md-5 mb-3">
          <div className="card">
            <div className="card-header">
              <h3>Export Dependencies</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <CustomSelect
                    label="Dependency"
                    value={dependency}
                    onChange={(e) => setDependency(e.target.value)}
                  >
                    <CustomSelectOptions
                      label="Select Dependency"
                      value=""
                      disabled
                    />

                    {fetchers?.map((dep, i) => (
                      <CustomSelectOptions
                        key={i}
                        label={dep?.value}
                        value={dep?.key}
                      />
                    ))}
                  </CustomSelect>
                </div>
                {columns?.length > 0 && data?.length > 0 && (
                  <div className="col-md-12">
                    <CSVLink
                      {...csvExport}
                      className="btn btn-success btn-block"
                    >
                      Export to CSV
                    </CSVLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {columns?.length > 0 && data?.length > 0 && (
          <TableCard columns={columns} rows={data} />
        )}
      </div>
    </>
  );
};

export default Exports;
