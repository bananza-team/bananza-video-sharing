import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import VideoListWide from "/components/videos/videolistwide";
import { NotificationManager } from "react-notifications";

let logout = (event) => {
  event.preventDefault();
  delete localStorage.token;
  Router.reload();
};

let matchedVideos = [];
let videos = [];

export default function Nav(props) {

  if(!props.user) return;

  let [user, setUser]=useState(props.user);

  useEffect(()=>{
    fetch("//localhost:8000/video/all", {
      headers:{
        Authorization:"Bearer "+localStorage.token,
      }
    }).then(response => response.json().then((parsedJSON)=>{
      if(response.status != 200){
        NotificationManager.error("Login token expired. Please refresh the page");
      } else {
        videos=parsedJSON;
        updateRenderedVideos();
      }
    }))
}, []);

  let [searching, setSearching] = useState(0);
  let [renderedVideos, setRenderedVideos] = useState([]);
  let [keyword, setKeyword] = useState("");

  let goBack = ()=>{
    setSearching(0);
  }

  let updateRenderedVideos = () =>{
    matchedVideos=[];
    videos.forEach(video =>{
      if(video.title.includes(keyword) || video.description.includes(keyword)) matchedVideos.push(video);
    })
    setRenderedVideos(matchedVideos);
  }

  useEffect(updateRenderedVideos, [keyword]);

  let searchChange = (e)=>{
    if(!e.target.value.length){
      setSearching(0);
      return;
    }
    setSearching(1);

    let keyword = e.target.value;
    setKeyword(keyword);
  }

  let goBackWhenClickingAway = (e)=>{ 
    // when the user navigates to another page, close the search box
    console.log(e);
    if(e.target.nodeName == "A") goBack();
  }

  if(user)

  return (
    <>
    <nav>
      <div className="nav-wrap">
        <span className="navLogo">
          <img src="/logo.png" />
        </span>
        <span className="leftNav">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/profile">
            <a>Profile</a>
          </Link>
          <Link href="/upload">
            <a>Upload</a>
          </Link>
          {props.user.type == "manager" &&
            <Link href="/reports">
              <a>Reports</a>
            </Link>
          }
        </span>
        <span className="rightNav">
          <span className="searchBox">
          <input onChange={searchChange} onClick={searchChange} type="search" placeholder="Search for videos" />
          <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <a onClick={logout}>Logout</a>
        </span>
      </div>
    </nav>
    {!!searching && (
    <div className="searchContainer" onClick={goBackWhenClickingAway} >
      <span className="searchBack" onClick={goBack}>Back</span>
      <VideoListWide user={props.user} displayPoster="1" type="wide" videos={renderedVideos} header="Search results" />
    </div>
    )}
    </>
  );
}
