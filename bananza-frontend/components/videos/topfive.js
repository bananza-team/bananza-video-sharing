import VideoCard from "./videocard.js"
import styles from "/styles/topfive.module.css"
export default function TopFive(props){
    return (
        <div className={styles.topFiveVideos}>
        <span className={styles.topFiveHeader}>Top five videos of today</span>
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