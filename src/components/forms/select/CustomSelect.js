import React from "react";

const CustomSelect = ({
  label = "",
  value = "",
  onChange = undefined,
  children,
  error = false,
  errorMessage = null,
  additionalClasses = "",
  name = "",
  fullWidth = false,
  ...otherProps
}) => {
  return (
    <>
      <div className="form-group">
        {label !== "" && <label className="form-label">{label}</label>}
        <select
          className={`form-control btn-square digits ${additionalClasses}`}
          value={value}
          onChange={onChange}
          name={name}
          {...otherProps}
        >
          {children}
        </select>
      </div>
    </>
  );
};

export default CustomSelect;
