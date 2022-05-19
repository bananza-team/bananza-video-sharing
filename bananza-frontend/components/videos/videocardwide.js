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
        {/* <Link> can't be used because when {id} changes it doesn't trigger a page change, so the search box doesn't have the chance to disappear */}
        {props.video.owner_id && props.displayPoster && <span className={styles.postedBy}><a href={`/user/${props.video.owner_id}`}>View poster profile</a></span>}
        </div>
        </div>
    )
}