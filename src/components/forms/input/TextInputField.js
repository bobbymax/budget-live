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
  disabled = false,
  name = "",
  ...otherProps
}) => {
  return (
    <div className="form-group">
      {label !== "" && <label className="form-label">{label}</label>}
      {multiline === 0 ? (
        <input
          className={`form-control ${additionalClasses}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          name={name}
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
          name={name}
          {...otherProps}
        ></textarea>
      )}
    </div>
  );
};

export default TextInputField;
