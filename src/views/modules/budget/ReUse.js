/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import DataTableComponent from "../../../components/commons/tables/DataTableComponent";
import useApi from "../../../services/hooks/useApi";
import { collection, destroy } from "../../../services/utils/controllers";
import TextInputField from "../../../components/forms/TextInputField";
import CustomSelect from "../../../components/forms/CustomSelect";
import Alert from "../../../services/classes/Alert";

const Fund = () => {
  const initialState = {
    id: 0,
    sub_budget_head_id: 0,
    approved_amount: 0,
    amount: 0,
    new_balance: 0,
    description: "",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState(initialState);
  const [results, setResults] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [subBudgetHead, setSubBudgetHead] = useState({});

  const {
    data: funds,
    request: fetch,
    loading: isLoading,
    setData: setFunds,
  } = useApi(collection);

  const columns = [
    {
      label: "Budget Code",
      key: "budgetCode",
    },
    {
      label: "Sub Budget Head",
      key: "sub_budget_head_name",
    },
    {
      label: "Department",
      key: "department",
    },
    {
      label: "Approved Amount",
      key: "approved_amount",
    },
  ];

  const handleEdit = (data) => {
    setState(data);
    setUpdate(true);
    setOpen(true);
  };

  const subBudgetHeadsOptions = (optionsArr) => {
    const arr = [];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.name });
      });
    return arr;
  };

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("creditBudgetHeads", data.id)
          .then((res) => {
            setFunds([...funds.filter((role) => role.id !== res.data.data.id)]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  const handleSearch = (str) => {
    setSearchTerm(str);

    if (str !== "") {
      const filtered = funds.filter((row) => {
        return Object.data(row)
          .join(" ")
          .toLowerCase()
          .includes(str.toLowerCase());
      });

      setResults(filtered);
    } else {
      setResults(funds);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const data = {
  //     sub_budget_head_id: state.sub_budget_head_id,
  //     approved_amount: state.amount,
  //     description: state.description,
  //   };

  //   if (update) {
  //     try {
  //       alter("creditBudgetHeads", state.id, data)
  //         .then((res) => {
  //           const result = res.data.data;

  //           setFunds(
  //             funds.map((el) => {
  //               if (result.id === el.id) {
  //                 return result;
  //               }

  //               return el;
  //             })
  //           );

  //           Alert.success("Updated", res.data.message);
  //         })
  //         .catch((err) => console.log(err.message));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     store("creditBudgetHeads", data)
  //       .then((res) => {
  //         const result = res.data.data;

  //         setFunds([result, ...funds]);
  //         Alert.success("Created!!", res.data.message);
  //       })
  //       .catch((err) => console.log(err));
  //   }

  //   setUpdate(false);
  //   setState(initialState);
  //   // resetForm();
  //   setOpen(false);
  // };

  const fetchSubBudgetHead = (id) => {
    const subBud =
      id > 0 && subBudgetHeads.filter((sub) => sub.id === id && sub);

    setSubBudgetHead(subBud[0]);
    setState({
      ...state,
      approved_amount: 0,
      available_balance: 0,
      description: "",
    });
  };

  const getSubBudgetHeads = () => {
    collection("subBudgetHeads")
      .then((res) => {
        const result = res.data.data;

        setSubBudgetHeads(result);
      })
      .catch((err) => console.log("Error getting the sub budget heads", err));
  };

  useEffect(() => {
    fetch("creditBudgetHeads");
    getSubBudgetHeads();
  }, []);

  useEffect(() => {
    state.sub_budget_head_id > 0 &&
      fetchSubBudgetHead(state.sub_budget_head_id);
  }, [state.sub_budget_head_id]);

  console.log(subBudgetHead);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="page-titles">
          <button
            className="btn btn-primary"
            onClick={() => setOpen(!open)}
            disabled={open}
          >
            <i className="fa fa-plus-square"></i> Add Fund
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="form-body">
                  <>
                    <form>
                      <div className="row">
                        <div className="col-md-6">
                          <CustomSelect
                            options={subBudgetHeadsOptions(subBudgetHeads)}
                            value={state.sub_budget_head_id}
                            onChange={(e) => {
                              setState({
                                ...state,
                                sub_budget_head_id: e.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className="col-md-6">
                          <TextInputField
                            type="text"
                            placeholder="AVAILABLE BALANCE"
                            value={state.approved_amount}
                            onChange={(e) =>
                              setState({
                                ...state,
                                approved_amount: e.target.value,
                              })
                            }
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <TextInputField
                            type="number"
                            placeholder="ENTER AMOUNT"
                            value={state.amount}
                            onChange={(e) => {
                              setState({
                                ...state,
                                amount: e.target.value,
                              });
                              // handleChange(e.target.value);
                            }}
                          />
                        </div>

                        <div className="col-md-6">
                          <TextInputField
                            placeholder="New Amount"
                            value={state.new_balance}
                            onChange={(e) => {
                              setState({
                                ...state,
                                new_balance: e.target.value,
                              });
                            }}
                            type="text"
                            name="new_amount"
                            disabled
                          />
                        </div>

                        <div className="col-md-12">
                          <TextInputField
                            placeholder="Description"
                            value={state.description}
                            onChange={(e) => {
                              setState({
                                ...state,
                                description: e.target.value,
                              });
                            }}
                            type="text"
                            name="description"
                            multiline={true}
                          />
                        </div>

                        <div className="col-md-12 mt-3">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              // setUpdate(false);
                              setState(initialState);
                              setOpen(false);
                              // setErrors({});
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="col-md-12">
        <DataTableComponent
          pageName="Credit Sub Budget Head"
          columns={columns}
          rows={searchTerm.length < 1 ? funds : results}
          handleEdit={handleEdit}
          handleDelete={handleDestroy}
          term={searchTerm}
          searchKeyWord={handleSearch}
          isFetching={isLoading}
        />
      </div>
    </div>
  );
};

export default Fund;
