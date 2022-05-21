/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import BasicTable from "../../../components/commons/tables/BasicTable";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import {
  collection,
  alter,
  store,
  destroy,
} from "../../../services/utils/controllers";
import { validate } from "../../../services/utils/validation";
import useApi from "../../../services/hooks/useApi";
import Loading from "../../../components/commons/Loading";

const Wages = () => {
  const {
    data: prices,
    setData: setPrices,
    request,
    loading,
  } = useApi(collection);

  const initialState = {
    id: 0,
    benefit_id: 0,
    amount: 0,
  };

  const [state, setState] = useState(initialState);
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  const columns = [
    {
      label: "Benefit",
      key: "benefit_name",
    },
    {
      label: "Amount",
      key: "amount",
    },
  ];

  const getBenefits = () => {
    collection("benefits")
      .then((res) => setOptions(res.data.data))
      .catch((err) => console.log(err));
  };

  const benefitOptions = (optionsArr) => {
    const arr = [];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.name });
      });
    return arr;
  };

  const rules = [
    { name: "benefit_id", rules: ["required", "integar"] },
    { name: "amount", rules: ["required", "integar"] },
  ];

  const handleUpdate = (data) => {
    setState(data);
    setUpdate(true);
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      benefit_id: state.benefit_id,
      amount: state.amount,
    };

    const formErrors = validate(rules, data);
    setErrors(formErrors);

    const status =
      Object.keys(formErrors).length === 0 && formErrors.constructor === Object;

    if (status) {
      if (update) {
        try {
          alter("priceLists", state.id, data)
            .then((res) => {
              const result = res.data.data;

              setPrices(
                prices.map((el) => {
                  if (result.id === el.id) {
                    return result;
                  }

                  return el;
                })
              );
              Alert.success("Updated", res.data.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          store("priceLists", data)
            .then((res) => {
              const result = res.data.data;
              setPrices([result, ...prices]);
              Alert.success("Created!!", res.data.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }

      setErrors({});

      setUpdate(false);
      setState(initialState);
      // setOpen(false);
    }
  };

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("priceLists", data.id)
          .then((res) => {
            setPrices([
              ...prices.filter((price) => price.id !== res.data.data.id),
            ]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  useEffect(() => {
    request("priceLists");
    getBenefits();
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-primary"
              onClick={() => setOpen(!open)}
              disabled={open}
            >
              <i className="fa fa-plus-square"></i> Add Price
            </button>
          </div>
        </div>

        {open && (
          <>
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <CustomSelect
                            defaultText="Select Benefit"
                            options={benefitOptions(options)}
                            value={state.benefit_id}
                            onChange={(e) =>
                              setState({ ...state, benefit_id: e.target.value })
                            }
                            error={
                              errors &&
                              errors.benefit_id &&
                              errors.benefit_id.length > 0
                            }
                            errorMessage={
                              errors &&
                              errors.benefit_id &&
                              errors.benefit_id[0]
                            }
                          />
                        </div>

                        <div className="col-md-6">
                          <TextInputField
                            placeholder="Amount"
                            type="number"
                            value={state.amount}
                            onChange={(e) =>
                              setState({ ...state, amount: e.target.value })
                            }
                            error={
                              errors &&
                              errors.amount &&
                              errors.amount.length > 0
                            }
                            errorMessage={
                              errors && errors.amount && errors.amount[0]
                            }
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
                              setUpdate(false);
                              setState(initialState);
                              setOpen(false);
                              setErrors({});
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-lg-12">
          <BasicTable
            page="Price Listing"
            columns={columns}
            rows={prices}
            handleEdit={handleUpdate}
            handleDelete={handleDestroy}
          />
        </div>
      </div>
    </>
  );
};

export default Wages;
