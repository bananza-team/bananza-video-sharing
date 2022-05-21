import styles from "/styles/videocard.module.css"
import Link from "next/link"
export default function VideoCard(props){
    return (
        <div className={styles.videoCard} style={{background:`url(//localhost:8000${props.video.thumbnail_image_link})`}}>
            <div className={styles.videoData}>
            <span className={styles.videoTitle}><Link href={`/video/${props.video.id}`}>{props.video.title}</Link></span>
            <span className={styles.videoDescription}>{props.video.description}</span>
            <span className="video-channel">{props.video.username}</span>
        </div>
        </div>
    )
}