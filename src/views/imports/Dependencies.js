/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import * as XLSX from "xlsx";
import Loading from "../../components/commons/Loading";
import TableCard from "../../components/commons/tables/customized/TableCard";
import TextInputField from "../../components/forms/input/TextInputField";
import CustomSelect from "../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../components/forms/select/CustomSelectOptions";
import Alert from "../../services/classes/Alert";
import { bulk, collection } from "../../services/utils/controllers";

const EXTS = ["xlsx", "xls", "csv"];

const Dependencies = () => {
  const [cols, setCols] = useState([]);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState("");

  const types = [
    {
      id: 1,
      label: "Departments",
      value: "departments",
    },
    {
      id: 2,
      label: "Staff",
      value: "staff",
    },
    {
      id: 3,
      label: "Budget Heads",
      value: "budget-heads",
    },
    {
      id: 4,
      label: "Sub Budget Heads",
      value: "sub-budget-heads",
    },
    {
      id: 5,
      label: "Modules",
      value: "modules",
    },
    {
      id: 6,
      label: "Roles",
      value: "roles",
    },
    {
      id: 7,
      label: "Grade Levels",
      value: "grade-levels",
    },
    {
      id: 8,
      label: "Onboard Staff",
      value: "onboarding",
    },
  ];

  const importData = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      type: dataType,
      data,
    };

    // console.log(body);

    try {
      bulk("imports", body)
        .then((res) => {
          const result = res.data;
          console.log(result.data);
          setIsLoading(false);
          Alert.success("Imported", result.message);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err.message);
          Alert.error("Oops!!", "Something must have f=gone wrong");
        });
    } catch (error) {
      console.log(error);
    }

    setCols([]);
    setDataType("");
    setData([]);
  };

  const getExtension = (file) => {
    const parts = file.name.split(".");
    const ext = parts[parts.length - 1];
    return EXTS.includes(ext);
  };

  const convertToJson = (headers, data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((el, index) => {
        rowData[headers[index]] = el;
      });
      rows.push(rowData);
    });
    // console.log(headers)
    return rows;
  };

  const importExcel = (e) => {
    const file = e.target.files[0];

    setFileUpload(e.target.value);

    console.log(e.target);

    const reader = new FileReader();
    reader.onload = (event) => {
      // console.log(event)
      // parse data
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });

      // get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];

      // convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const heads = headers.map((head) => ({ key: head, label: head }));
      setCols(heads);

      fileData.splice(0, 1);
      setData(convertToJson(headers, fileData));
    };

    if (file) {
      if (getExtension(file)) {
        reader.readAsBinaryString(file);
      } else {
        alert("Invalid file input, Select Excel or CSV file");
      }
    } else {
      setData([]);
      setCols([]);
    }
  };

  return (
    <>
      {isLoading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={importData} className="mb-5">
                <div className="row">
                  <div className="col-md-6">
                    <TextInputField
                      type="file"
                      label="Upload File"
                      value={fileUpload}
                      onChange={importExcel}
                    />
                  </div>
                  <div className="col-md-6">
                    <CustomSelect
                      label="Select Data Type"
                      value={dataType}
                      onChange={(e) => setDataType(e.target.value)}
                    >
                      <CustomSelectOptions
                        label="Select Data Type"
                        value=""
                        disabled
                      />

                      {types.map((typ, i) => (
                        <CustomSelectOptions
                          key={i}
                          label={typ.label}
                          value={typ.value}
                        />
                      ))}
                    </CustomSelect>
                  </div>
                  <div className="col-md-12 mt-3">
                    <button
                      className="btn btn-success btn-sm btn-rounded"
                      type="submit"
                      disabled={dataType === ""}
                    >
                      Import Data
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <TableCard columns={cols} rows={data} />
      </div>
    </>
  );
};

export default Dependencies;
