import React from "react";
import "../../styles/ToggleSwitch.css";

const ToggleSwitch = ({ isChecked, handleOnChange }) => {
  return (
    <div className="ToggleSwitch">
      <input type="checkbox" id="switch" checked={isChecked} onChange={handleOnChange} />
      <label htmlFor="switch">Toggle</label>
    </div>
  );
};

export default ToggleSwitch;
