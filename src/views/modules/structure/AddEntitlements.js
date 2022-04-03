/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Modal } from "react-bootstrap";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { filterByRef } from "../../../services/utils/helpers";

const AddEntitlements = (props) => {
  const defaultState = {
    benefit: null,
    prices: 0,
  };

  const [entitlement, setEntitlement] = useState(defaultState);
  const [grades, setGrades] = useState([]);

  const handleModalStateChange = (e) => {
    e.preventDefault();

    const data = {
      benefit_id: props.benefit.id,
      grades: grades,
      price_list_id: entitlement.prices,
    };

    props.onSubmit(data);
    setEntitlement(defaultState);
    setGrades([]);
    props.onHide();
  };

  return (
    <>
      <Modal
        className="modal"
        show={props.show}
        onHide={props.onHide}
        // {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <>
          <form onSubmit={handleModalStateChange}>
            <div className="modal-header">
              <h5 className="modal-title" id="contained-modal-title-vcenter">
                Add Entitlements
              </h5>
            </div>

            <div className="modal-body">
              <div className="container-fluid">
                <div className="row" style={{ marginBottom: 20 }}>
                  <div className="col">
                    <div className="form-group">
                      <label className="form-label">Benefit Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={props.benefit ? props.benefit.name : null}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label className="form-label">Grade Levels</label>

                      <Select
                        components={makeAnimated()}
                        // theme={customTheme}
                        options={
                          props.benefit
                            ? filterByRef(
                                props.grades,
                                props.benefit.entitlements
                              )
                            : props.grades
                        }
                        placeholder="Select Grade Levels"
                        onChange={setGrades}
                        value={grades}
                        isSearchable
                        isMulti
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <label className="form-label">Amount</label>

                      <select
                        name="price_list_id"
                        className="form-control"
                        value={entitlement.prices}
                        onChange={(e) =>
                          setEntitlement({
                            ...entitlement,
                            prices: e.target.value,
                          })
                        }
                      >
                        <option>Select Payment Category</option>
                        {props.benefit
                          ? props.benefit.wages.map((wage) => (
                              <option key={wage.id} value={wage.id}>
                                {wage.amount}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="btn-group btn-rounded">
                <button className="btn btn-success" type="submit">
                  Submit
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={props.onHide}
                >
                  Close
                </button>
              </div>
            </div>
          </form>
        </>
      </Modal>
    </>
  );
};

export default AddEntitlements;
