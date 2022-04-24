import { stringifyQuery } from "next/dist/server/server-route-utils";

export default function Checkbox(props){
    return (
        <>
        <input type="checkbox" name={props.name} checked={props.value} onChange={props.onChange}/>
        <label htmlFor={props.name}>{props.label}</label>
        {props.value && props.children}
        </>
    )
}