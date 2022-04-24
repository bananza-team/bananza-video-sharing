export default function input(props){
    return (
        <span>
            <label htmlFor={props.name}>{props.label}</label>
            <input type={props.inputType} placeholder={props.placeholderText}></input>
        </span>
    )
}