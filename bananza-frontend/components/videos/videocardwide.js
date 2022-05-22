import styles from "/styles/videocardwide.module.css"
import Link from "next/link"
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotificationManager from "react-notifications/lib/NotificationManager";
export default function VideoCard(props){

    let deleteVideo = (e)=>{
        confirmAlert({
            title:"Confirm video deletion",
            message:"Are you sure you want to delete the video?",
            buttons:[
                {
                    label:"Yes",
                    onClick:()=>{
                        fetch("//localhost:8000/video/"+props.video.id, {
                            method:"DELETE",
                            headers:{
                              'accept':'application/json',
                              Authorization: "Bearer "+localStorage.token,
                            }
                          }).then(response=>response.json().then(parsedJSON=>{
                            if(response.status == 200){
                              NotificationManager.info("Video deleted succesfully");
                              window.location.reload();
                            } else {
                              if(response.status == 403) NotificationManager.error("You are not authorized to delete this video");
                              NotificationManager.error("Error occured while deleting video");
                            }
                          }))
                    }
                },
                {
                    label:"No",
                }
            ]
        })
    }

    return (
        <div className={styles.video}>
        <img className={styles.thumbnail} src={`//localhost:8000${props.video.thumbnail_image_link}`}/>
        <div className={styles.videoData}>
        <span className={styles.titleDescription}>
        <span className={styles.videoTitle}><Link href={`/video/${props.video.id}`}>{props.video.title}</Link></span>
        <span className={styles.videoDescription}>{props.video.description}</span>
        </span>
        { (parseInt(props.user.id) == parseInt(props.video.owner_id) || props.user.type != "creator") && 
            <span onClick={deleteVideo} className={styles.deleteButton}>Delete</span>
        }
        {/* <Link> can't be used because when {id} changes it doesn't trigger a page change, so the search box doesn't have the chance to disappear */}
        {props.video.owner_id && props.displayPoster && <span className={styles.postedBy}><Link href={`/user/${props.video.owner_id}`}>View poster profile</Link></span>}
        </div>
        </div>
    )
}