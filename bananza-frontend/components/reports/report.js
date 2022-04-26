import styles from "/styles/report.module.css"
export default function Report(props){
    return (
    <div className={styles.report}>
        <span className={styles.reportedVideo}>
            {props.report.video.title}
        </span>
        <span className={styles.reportReason}>
            {props.report.reportReason}
        </span>
        <span className={styles.reportedChannel}>
            <span className="label">Channel</span>{props.report.video.channel}
        </span>
    </div>
    );
}