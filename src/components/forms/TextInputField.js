import React from "react";

const TextInputField = ({
  label = "",
  type = "text",
  value = "",
  onChange = undefined,
  placeholder = "",
  required = false,
  multiline = 0,
  error = false,
  errorMessage = null,
  additionalClasses = "",
  ...otherProps
}) => {
  // const { errors, touched, values, setFieldValue, setFieldTouched } =
  //   useFormikContext();

  return (
    <div className={`form-group ${error ? "input-danger" : ""}`}>
      {label !== "" && (
        <label className="mb-1">
          <strong>{label}</strong>
        </label>
      )}

      {multiline === 0 ? (
        <input
          type={type}
          className={`form-control ${additionalClasses}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...otherProps}
        />
      ) : (
        <textarea
          className="form-control"
          rows={multiline}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          {...otherProps}
        ></textarea>
      )}
      {errorMessage ? (
        <span style={{ fontSize: 12 }} className="text-danger">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
};

export default TextInputField;
