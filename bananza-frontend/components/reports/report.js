import styles from "/styles/report.module.css"
import Link from "next/link";
export default function Report(props){
    return (
        <div className={styles.reportContainer}>
            <div className={styles.reportedVideo}>
                {!!props.report.video &&
                <Link href={`/video/${props.report.video.id}`}>
                    <a>{props.report.video.title}</a>
                </Link>
                }
                {!props.report.video &&
                    <span className={styles.videoRemoved}>Reported video has been removed</span>
                }
            </div>
            <div className={styles.reportReason}>{props.report.reason}</div>
            <div className={styles.reporter}>
                <Link href={`/user/${props.report.reporter.id}`}>
                    <a>{props.report.reporter.username}</a>
                </Link>
            </div>
        </div>
    );
}