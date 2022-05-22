import styles from "/styles/applicationlist.module.css"
import Mapplication from "./mapplication"
export default function ApplicationList (props){
    let applications = [];
    props.applications.forEach((application, key)=>{
        applications.push(<Mapplication application={application} key={key}/>);
    });
    return (
        <>
        <div className={styles.applistTitle}>Manager Applications</div>
        <div className={styles.applistContainer}>
            {applications}
        </div>
        </>
    )
}