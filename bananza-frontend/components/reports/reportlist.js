import Report from "./report.js";
import styles from "/styles/latestreports.module.css"
export default function ReportList(props) {
  return (
    <div className={styles.reports}>
      <span className={styles.reportsHeader}>{props.title}</span>
      <div className={styles.reportsHead}>
        <span>Reported video</span>
        <span>Report reason</span>
        <span>Reporter</span>
      </div>
      <div class={styles.reportsContainer}>
        {props.reports.map((report, key) => (
          <Report report={report} key={key}/>
        ))}
      </div>
    </div>
  );
}
