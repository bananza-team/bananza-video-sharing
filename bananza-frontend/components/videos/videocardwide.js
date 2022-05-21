import styles from "/styles/videocardwide.module.css"
import Link from "next/link"
export default function VideoCard(props){
    return (
        <div className={styles.video}>
        <img className={styles.thumbnail} src={`//localhost:8000${props.video.thumbnail_image_link}`}/>
        <div className={styles.videoData}>
        <span className={styles.titleDescription}>
        <span className={styles.videoTitle}><Link href={`/video/${props.video.id}`}>{props.video.title}</Link></span>
        <span className={styles.videoDescription}>{props.video.description}</span>
        </span>
        { (parseInt(props.user.id) == parseInt(props.video.owner_id) || props.user.type == "manager") && 
            <span>Delete</span>
        }
        {/* <Link> can't be used because when {id} changes it doesn't trigger a page change, so the search box doesn't have the chance to disappear */}
        {props.video.owner_id && props.displayPoster && <span className={styles.postedBy}><Link href={`/user/${props.video.owner_id}`}>View poster profile</Link></span>}
        </div>
        </div>
    )
}