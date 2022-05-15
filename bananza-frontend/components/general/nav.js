import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import VideoList from "/components/videos/videolist";

let logout = (event) => {
  event.preventDefault();
  delete localStorage.token;
  Router.reload();
};

let matchedVideos = [];

export default function Nav() {

  let [searching, setSearching] = useState(0);
  let [renderedVideos, setRenderedVideos] = useState([]);

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
      description: "description goes brr",
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
  videos[2] = videos[3] = videos[4] = videos[0];

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
          <input onChange={searchChange} type="search" placeholder="Search for videos" />
          <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <a onClick={logout}>Logout</a>
        </span>
      </div>
    </nav>
    {!!searching && (
    <div className="searchContainer">
      <VideoList videos={renderedVideos} header="Search results" />
    </div>
    )}
    </>
  );
}
