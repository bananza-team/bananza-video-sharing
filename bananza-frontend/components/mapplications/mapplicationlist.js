import styles from "/styles/applicationlist.module.css"
import Mapplication from "./mapplication"
export default function ApplicationList (props){
    let unanswered = [];
    let answered = [];
    props.applications.forEach((application, key)=>{
        let appElem = <Mapplication application={application} key={key}/>;
        if(application.answered) answered.push(appElem);
        else unanswered.push(appElem);
    });

    return (
        <>
        <div className={styles.applistTitle}>Manager Applications</div>
        <div className={styles.applistContainer}>
            <span className={styles.sectionTitle}>Unanswered applications</span>
            {unanswered}
        </div>
        <div className={styles.applistContainer}>
            <span className={styles.sectionTitle}>Answered applications</span>
            {answered}
        </div>
        </>
    )
}