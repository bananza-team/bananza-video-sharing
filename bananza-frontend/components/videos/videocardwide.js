import styles from "/styles/videocardwide.module.css"
export default function VideoCard(props){
    return (
        <div className={styles.video}>
        <img className={styles.thumbnail} src={`//localhost:8000${props.video.thumbnail_image_link}`}/>
        <div className={styles.videoData}>
        <span className={styles.titleDescription}>
        <span className={styles.videoTitle}>{props.video.title}</span>
        <span className={styles.videoDescription}>{props.video.description}</span>
        </span>
        {props.username && <span className={styles.postedBy}><span>posted by</span> {props.username}</span>}
        </div>
        </div>
    )
}