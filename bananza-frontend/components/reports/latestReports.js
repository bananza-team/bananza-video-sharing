import Report from "./report.js";
export default function LatestReports(props) {
  return (
    <div className="reports">
      <span className="reportsHeader">Latest user reports</span>
      <div class="reportsContainer">
        {props.reports.map((report, key) => (
          <Report report={report} />
        ))}
      </div>
    </div>
  );
}
