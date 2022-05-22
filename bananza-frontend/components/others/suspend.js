import { confirmAlert } from "react-confirm-alert";
import { NotificationManager } from "react-notifications";

export default function Suspend(props){
    
    let buttonStyle = {
        backgroundColor:"#1f1f1f",
        marginRight:"10px",
    }

    let suspend = ()=>{
        let id = props.user_id;
        confirmAlert({
            title:"Confirm user suspension",
            message:"Are you sure you want to suspend this user?",
            buttons:[{
                label:"Yes",
                onClick:()=>{
                    fetch("//localhost:8000/user/suspend/"+id, {
                        method:"PATCH",
                        headers:{
                            Authorization:"Bearer "+localStorage.token,
                        }
                    }).then(response=>response.json().then(parsedJSON=>{
                        if(response.status == 200){
                            NotificationManager.info("User succesfully suspended");
                        } else if(response.status == 403)
                            NotificationManager.error("Only an administrator can suspend a manager/admin");
                        else NotificationManager.error("An error occured while trying to suspend the user");
                    }))
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