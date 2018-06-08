import React from 'react';

export const CheckBoxSlider = ({ label, name, checked, onChange }) => {
  return (
    <span>
      <label className="cbs_switch">
        <input
          type="checkbox"
          onChange={onChange}
          name={name}
          checked={checked}
        />
        <span className="cbs_slider cbs_round" />
      </label>
      <span>{label}</span>
    </span>
  );
};

export default CheckBoxSlider;
