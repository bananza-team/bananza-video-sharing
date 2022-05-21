import VideoCardWide from "./videocardwide.js"
import styles from "/styles/videolistwide.module.css"
export default function VideoList(props){
    return (
        <div className={styles.videoList}>
        <span className={styles.videoListHeader}>{props.header}</span>
        <div className={styles.videoListContainer}>
        { !!props.videos.length &&
        props.videos.map((video, key) => (
           <VideoCardWide user={props.user} displayPoster={props.displayPoster} video={video} key={key}/>
        ))
        }
        { !props.videos.length && 
            <span className={styles.notFound}>No videos found</span>
        }
        </div>
        </div>
    );
}