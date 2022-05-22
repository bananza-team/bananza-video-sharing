import styles from "/styles/application.module.css";
import Link from "next/link";
export default function Application(props){
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
                <i class="fa-solid fa-check"></i>
                <i class="fa-solid fa-xmark"></i>
                </div>
        </div>
    )
}