export default function input(props) {
  return (
    <span>
      <label htmlFor={props.name}>{props.label}
      <input
        name={props.name}
        id={props.name}
        type={props.inputType}
        placeholder={props.placeholderText}
      ></input>
      </label>
    </span>
  );
}