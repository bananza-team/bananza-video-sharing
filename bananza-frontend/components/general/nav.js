import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";

let logout = (event) => {
  event.preventDefault();
  delete localStorage.token;
  Router.reload();
};

export default function Nav() {

  let [searching, setSearching] = useState(0);

  let searchChange = (e)=>{
    if(!e.target.value.length){
      setSearching(0);
      return;
    }
    setSearching(1);
  }

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
      
    </div>
    )}
    </>
  );
}
