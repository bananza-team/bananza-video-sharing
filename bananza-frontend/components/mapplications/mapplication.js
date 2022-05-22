import styles from "/styles/application.module.css";
import Link from "next/link";
import { confirmAlert } from "react-confirm-alert";
import { NotificationManager } from "react-notifications";
export default function Application(props){

    let accept = ()=>{
        confirmAlert({
            description:"Are you sure you want to accept this application?",
            title:"Confirm accepting this application",
            buttons:[
                {
                    label:"Yes",
                    onClick:()=>{
                        fetch("//localhost:8000/application/"+props.application.id+"/accept", {
                            method:"POST",
                            headers:{
                                Authorization:"Bearer "+localStorage.token,
                                'accept':'application/json',
                            }
                        }).then(response => response.json().then(parsedJSON=>{
                            if(response.status == 200){
                                NotificationManager.info("Application has been succesfully accepted");
                                props.onUpdate.update(!props.onUpdate.current);
                            } else {
                                NotificationManager.error("An error occured while trying to accept the application");
                            }
                        }))
                    }
                }, {
                    label:"No",
                }
            ]
        })
    }

    let deny = ()=>{
        confirmAlert({
            description:"Are you sure you want to deny this application?",
            title:"Confirm denying this application",
            buttons:[
                {
                    label:"Yes",
                    onClick:()=>{
                        fetch("//localhost:8000/application/"+props.application.id+"/deny", {
                            method:"POST",
                            headers:{
                                Authorization:"Bearer "+localStorage.token,
                                'accept':'application/json',
                            }
                        }).then(response => response.json().then(parsedJSON=>{
                            if(response.status == 200){
                                NotificationManager.info("Application has been succesfully denied");
                                props.onUpdate.update(!props.onUpdate.current);
                            } else {
                                NotificationManager.error("An error occured while trying to deny the application");
                            }
                        }))
                    }
                }, {
                    label:"No",
                }
            ]
        })
    }

    return (
        <div className={styles.application}>
            <div className={styles.applicationUser}>
                <Link href={`/user/${props.application.user.id}`}><a>{props.application.user.username}</a></Link>
                <img src={`//localhost:8000${props.application.user.profile_picture_link.replace("../", "/")}`}></img>
            </div>
            <div className={styles.applicationUName}>{`${props.application.user.name} ${props.application.user.surname}`}</div>
            <div className={styles.applicationPhone}>{props.application.user.phone}</div>
            <div className={styles.applicationCV}><a target="_blank" href={`//localhost:8000${props.application.user.cv_link}`}><i class="fa-solid fa-file"></i></a></div>
            <div className={styles.applicationOptions}>
            {!props.application.answered &&
            <>
                <i class="fa-solid fa-check" onClick={accept}></i>
                <i class="fa-solid fa-xmark" onClick={deny}></i>
            </>
            }
                </div>
        </div>
    )
}