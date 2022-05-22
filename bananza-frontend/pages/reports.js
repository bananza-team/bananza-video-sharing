import {useRouter} from "next/router";
import { useEffect, useState} from "react";
import { NotificationManager } from "react-notifications";
import PageHead from "../components/general/pageHead";
import ReportList from "../components/reports/reportlist";
export default function Reports(props){
    if(props.user == null || props.user.type == "creator"){
        useRouter().push("/");
        return;
    }

    let [reports, setReports] = useState([]);
    useEffect(()=>{
        fetch("//localhost:8000/video/interact/report", {
            headers:{
                Authorization:"Bearer "+localStorage.token,
            }
        }).then(response=>response.json().then(parsedJSON=>{
            if(response.status == 200){
                setReports(parsedJSON.reverse());
            } else NotificationManager.error("Reports could not be loaded");
        }))
    }, []);

    return (
        <>
        <PageHead pageTitle="User reports"/>
        <ReportList reports={reports} title="Reports"/>
        </>
    )

}