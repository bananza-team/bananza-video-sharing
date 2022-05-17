import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import VideoListWide from "/components/videos/videolistwide";
import styles from "/styles/user.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NotificationManager } from "react-notifications";

export default function User() {
  let router = useRouter();
  let {id} = router.query;

  useEffect(()=>{
    fetch("//localhost:8000/user/"+id).then((response) =>
      response.json().then((parsedJSON) => {
          if(response.status == 200){
              setUData(parsedJSON);
          }
          else router.push("/");
      })
    )}, []);

let [fetching, setFetching] = useState(1);
  let [uData, setUData] = useState({
    username: "",
    type: "",
    description: "",
    profile_picture_link: "",
    cover_picture_link: "",
    is_active: "",
    videos: [],
  });

  return (
    <>
      <PageHead title="Bananza - User Profile" />
      <Nav />
      <div className={styles.userData} style={{backgroundImage: `url(//localhost:8000/${uData.cover_picture_link})`}}>
        <span className={styles.userAvatar}>
            <img src={`//localhost:8000/${uData.profile_picture_link}`}/>
        </span>
        <span className={styles.username}>{uData.username}</span>
        <span className={styles.description}>{uData.description}</span>
      </div>
      <VideoListWide videos={uData.videos}/>
    </>
  );
}
