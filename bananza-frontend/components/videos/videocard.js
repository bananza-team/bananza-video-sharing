import styles from "/styles/videocard.module.css"
export default function VideoCard(props){
    return (
        <div className={styles.videoCard} style={{background:`url(${props.video.thumbnail})`}}>
            <div className={styles.videoData}>
            <span className={styles.videoTitle}>{props.video.title}</span>
            <span className="video-description">{props.video.description}</span>
            <span className="video-channel">{props.video.channel}</span>
        </div>
        </div>
    )
}