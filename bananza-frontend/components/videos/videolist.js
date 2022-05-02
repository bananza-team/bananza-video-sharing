import VideoCard from "./videocard.js"
import styles from "/styles/topfive.module.css"
export default function VideoList(props){
    return (
        <div className={styles.topFiveVideos}>
        <span className={styles.topFiveHeader}>{props.header}</span>
        <div className={styles.topFiveVideosContainer}>
        {
        props.videos.map((video, key) => (
           <VideoCard video={video} key={key}/>
        ))
        }
        </div>
        </div>
    );
}