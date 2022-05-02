import { stringifyQuery } from "next/dist/server/server-route-utils";

export default function Checkbox(props){
    return (
        <>
        <span className="checkbox-container"><input type="checkbox" name={props.name} checked={props.value} onChange={props.onChange}/>
        <label htmlFor={props.name}>{props.label}</label>
        </span>
        {props.value && props.children}
        </>
    )
}