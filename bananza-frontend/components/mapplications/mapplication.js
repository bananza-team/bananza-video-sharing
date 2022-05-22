import styles from "/styles/application.module.css";
import Link from "next/link";
import { confirmAlert } from "react-confirm-alert";
export default function Application(props){

    let accept = ()=>{
        confirmAlert({
            description:"Are you sure you want to accept this application?",
            title:"Confirm accepting this application",
            buttons:[
                {
                    label:"Yes",
                    onClick:()=>{

                    }
                }, {
                    label:"No",
                }
            ]
        })
    }

    let deny = ()=>{
        
    }

    return (
        <div className={styles.application}>
            <div className={styles.applicationUser}>
                <Link href={`/user/${props.application.user.id}`}><a>{props.application.user.username}</a></Link>
                <img src={`//localhost:8000${props.application.user.profile_picture_link.replace("../", "/")}`}></img>
            </div>
            <div className={styles.applicationUName}>{`${props.application.user.name} ${props.application.user.surname}`}</div>
            <div className={styles.applicationPhone}>{props.application.user.phone}</div>
            <div className={styles.applicationCV}><a href={`//localhost:8000${props.application.user.cv_link}`}><i class="fa-solid fa-file"></i></a></div>
            <div className={styles.applicationOptions}>
                <i class="fa-solid fa-check" onClick={accept}></i>
                <i class="fa-solid fa-xmark" onClick={deny}></i>
                </div>
        </div>
    )
}