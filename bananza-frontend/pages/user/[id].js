import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import Input from "/components/forms/input";
import styles from "/styles/user.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import { NotificationManager } from "react-notifications";

export default function User (){
    let router = useRouter();
    let { id } = router.query;

    if(!Number.isInteger(parseInt(id))){
        router.push("/");
        return;
    }

    let [loading, setLoading] = useState(1);
    let [userData, setUserData] = useState(null);

    fetch("//localhost:8000/user/"+id).then(response => response.json().then(parsedJSON=>{
        loading = 0;
        if(response.status == 200){
            userData = parsedJSON;
        } else {
            setTimeout(()=>router.push("/"));
            return;
        }
    }))

    return (
        <>
            <PageHead title="Bananza - User Profile" />
            <Nav />
        </>
    )

}