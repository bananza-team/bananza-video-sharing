export default function input(props) {
  return (
    <span>
      <label htmlFor={props.name}>{props.label}</label>
      <input
        name={props.name}
        type={props.inputType}
        placeholder={props.placeholderText}
      ></input>
    </span>
  );
}