import React, { useEffect, useState } from "react";
import DataTables from "../../../components/DataTables";
import { collection } from "../../../services/utils/controllers";
import { columns } from "../../../resources/columns";

const Testing = () => {
  const [users, setUsers] = useState([]);

  const handleRow = (data) => {
    console.log(data);
  };

  useEffect(() => {
    try {
      collection("users")
        .then((res) => {
          setUsers(res.data.data);
        })
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <DataTables
        pillars={columns.staff}
        rows={users}
        manageRow={handleRow}
        canManage
        selectable
      />
    </>
  );
};

export default Testing;
