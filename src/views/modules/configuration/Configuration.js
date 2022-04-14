import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../../../components/commons/Loading";
import TextInputField from "../../../components/forms/input/TextInputField";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import { fetchSiteConfig } from "../../../features/config/configSlice";
import Alert from "../../../services/classes/Alert";
import { collection, store } from "../../../services/utils/controllers";

const Configuration = () => {
  const fileState = {
    names: [],
    exists: false,
  };

  const [state, setState] = useState({});
  const [settings, setSettings] = useState([]);
  const [fileUpload, setFileUpload] = useState(fileState);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target.value;
    const files = e.target.files;

    const fileExist = (files && files[0]) ?? null;

    if (fileExist !== null) {
      setFileUpload({
        ...fileUpload,
        names: [e.target.name, ...fileUpload.names],
        exists: true,
      });
    }

    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const details = (txt) => {
    const arrs = txt.split(",");
    const options = [];

    arrs.forEach((el) => {
      const inner = el.split("|");
      const ams = {
        value: inner[0],
        label: inner[1],
      };

      options.push(ams);
    });

    return options;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      state,
    };

    store("portal/configuration", data)
      .then((res) => {
        const data = res.data;
        setLoading(false);
        dispatch(fetchSiteConfig(data));
        Alert.success("Updated", data.message);
      })
      .catch((err) => {
        setLoading(false);
        Alert.error("Oops!!", "Something went wrong!!");
        console.log(err.message);
      });
  };

  useEffect(() => {
    const vals = {};
    settings.forEach((el) => {
      vals[el.key] = el.value;
    });
    setState(vals);
  }, [settings]);

  useEffect(() => {
    try {
      collection("settings")
        .then((res) => setSettings(res.data.data))
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(state);

  return (
    <>
      {loading ? <Loading /> : null}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    {settings.length > 0 &&
                      settings.map((conf, i) => (
                        <div className="col-md-12" key={i}>
                          {conf.input_type === "text" && (
                            <TextInputField
                              label={conf.display_name}
                              name={conf.key}
                              value={state[conf.key]}
                              onChange={handleChange}
                              placeholder={`Enter ${conf.display_name}`}
                            />
                          )}
                          {conf.input_type === "textarea" && (
                            <TextInputField
                              label={conf.display_name}
                              name={conf.key}
                              value={state[conf.key]}
                              onChange={handleChange}
                              placeholder={`Enter ${conf.display_name}`}
                              multiline={4}
                            />
                          )}
                          {conf.input_type === "number" && (
                            <TextInputField
                              label={conf.display_name}
                              type={conf.input_type}
                              name={conf.key}
                              value={state[conf.key]}
                              onChange={handleChange}
                              placeholder={`Enter ${conf.display_name}`}
                            />
                          )}
                          {conf.input_type === "file" && (
                            <TextInputField
                              label={conf.display_name}
                              type={conf.input_type}
                              name={conf.key}
                              value={state[conf.key]}
                              onChange={handleChange}
                              placeholder={`Enter ${conf.display_name}`}
                            />
                          )}
                          {conf.input_type === "select" && (
                            <CustomSelect
                              label={conf.display_name}
                              value={state[conf.key]}
                              onChange={handleChange}
                              name={conf.key}
                            >
                              <CustomSelectOptions
                                value=""
                                label={`Select ${conf.display_name}`}
                              />
                              {details(conf.details).map((det, index) => (
                                <CustomSelectOptions
                                  key={index}
                                  value={det.value}
                                  label={det.label}
                                />
                              ))}
                            </CustomSelect>
                          )}
                        </div>
                      ))}
                    <div className="col-md-12 mt-3">
                      <button type="submit" className={`btn btn-primary mt-4`}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuration;
