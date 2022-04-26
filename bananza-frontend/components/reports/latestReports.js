import Report from "./report.js";
import styles from "/styles/latestreports.module.css"
export default function LatestReports(props) {
  return (
    <div className={styles.reports}>
      <span className={styles.reportsHeader}>Latest user reports</span>
      <div class={styles.reportsContainer}>
        {props.reports.map((report, key) => (
          <Report report={report} key={key}/>
        ))}
      </div>
    </div>
  );
}
