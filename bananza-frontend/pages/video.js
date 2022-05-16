import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import styles from "/styles/video.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";

export default function Video(props) {
  return (
    <>
      <PageHead title="Bananza - Video" />
      <Nav />
      <div className={styles.videoPage}>
        <div className={styles.videoPageLeft}>
          <Player
            playsInline
            src="//localhost:8000/resources/video/video-15-05-2022-02-09-07-507d7f68-3aab-4d64-acaf-9c10665547fb.mp4"
          />
          <div className={styles.videoData}>
            <div className={styles.videoInfo}>
              <span className={styles.videoTitle}>Cool video title</span>
              <span className={styles.videoDescription}>
                Awesome description
              </span>
            </div>
            <div className={styles.videoDataRight}>
              <div className={styles.likeContainer}>
                <span><i class="fa-solid fa-thumbs-up"></i> 25 Likes</span>
                <span><i class="fa-solid fa-thumbs-down"></i> 12 Dislikes</span>
              </div>
              <div className={styles.authorBox}>
                posted by <span>Claudiu</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.videoPageRight}>comments go brr</div>
      </div>
    </>
  );
}
