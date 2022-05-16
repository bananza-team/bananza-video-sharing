import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import VideoListWide from "/components/videos/videolistwide";

let logout = (event) => {
  event.preventDefault();
  delete localStorage.token;
  Router.reload();
};

let matchedVideos = [];

export default function Nav() {

  let [searching, setSearching] = useState(0);
  let [renderedVideos, setRenderedVideos] = useState([]);

  let goBack = ()=>{
    setSearching(0);
  }

  let searchChange = (e)=>{
    if(!e.target.value.length){
      setSearching(0);
      return;
    }
    setSearching(1);

    let keyword = e.target.value;
    matchedVideos=[];
    videos.forEach(video =>{
      if(video.title.includes(keyword) || video.description.includes(keyword)) matchedVideos.push(video);
    })
    setRenderedVideos(matchedVideos);
  }

  let videos = [
    {
      thumbnail: "test.png",
      title: "lots of snow in the sea",
      description: "dddddddddddddddddddddddddddddddddddddddd",
      username: "Claudiu",
      key: 0,
    },
    {
      thumbnail: "test.png",
      title: "the climate is changing",
      description: "visit our lovely channel",
      username: "Mircea",
      key: 1,
    },
  ];

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
    <div className="searchContainer">
      <span className="searchBack" onClick={goBack}>Back</span>
      <VideoListWide type="wide" videos={renderedVideos} header="Search results" />
    </div>
    )}
    </>
  );
}
