import styles from "/styles/videocardwide.module.css"
export default function VideoCard(props){
    return (
        <div className={styles.video}>
        <img className={styles.thumbnail} src={props.video.thumbnail}/>
        <div className={styles.videoData}>
        <span className={styles.titleDescription}>
        <span className={styles.videoTitle}>{props.video.title}</span>
        <span className={styles.videoDescription}>{props.video.description}</span>
        </span>
        <span className={styles.postedBy}><span>posted by</span> {props.video.username}</span>
        </div>
        </div>
    )
}