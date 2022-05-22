import {useRouter} from "next/router";
import { useEffect, useState} from "react";
import { NotificationManager } from "react-notifications";
export default function Reports(props){
    if(props.user == null || props.user.type == "creator"){
        useRouter().push("/");
    }

    let [reports, setReports] = useState(null);
    useEffect(()=>{
        fetch("/video/interact/report").then(response=>response.json().then(parsedJSON=>{
            if(response.status == 200){
                setReports(parsedJSON);
            } else NotificationManager.error("Reports could not be loaded");
        }))
    }, []);

}