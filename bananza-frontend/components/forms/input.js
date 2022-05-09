import React, { useState } from "react";
export default function input(props) {
  let defaultChange=(e)=>{
    setValue(e.target.value);
  }
  let [value, setValue]=useState(props.value);
  return (
    <span>
      <label htmlFor={props.name}>
        {props.label}
        <input
          name={props.name}
          id={props.name}
          type={props.inputType}
          placeholder={props.placeholderText}
          value={value}
          className={props.className}
          onChange={defaultChange}
          autoComplete="new-password"
        ></input>
      </label>
    </span>
  );
}
