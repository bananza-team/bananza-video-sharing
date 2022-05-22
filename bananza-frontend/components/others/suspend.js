import { confirmAlert } from "react-confirm-alert";

export default function Suspend(props){
    
    let buttonStyle = {
        backgroundColor:"#1f1f1f",
        marginRight:"10px",
    }

    let suspend = ()=>{
        let id = props.user.id;
        confirmAlert({
            title:"Confirm user suspension",
            message:"Are you sure you want to suspend this user?",
            buttons:[{
                label:"Yes",
                onClick:()=>{

                }
            }, {
                label:"No"
            }]
        })
    }

    return (
        <button onClick={suspend} style={buttonStyle}>Suspend</button>
    )
}