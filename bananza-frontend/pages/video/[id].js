import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import styles from "/styles/video.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
import { NotificationManager } from "react-notifications";
import Link from "next/link";
import { copyTextToClipboard } from "../../libs/clipboard";

export default function Video(props) {

    let [comment, setComment]=useState("");
    let [TAValue, setTAValue]=useState("");
    let [reactions, setReactions] = useState({
      likes:0,
      dislikes:0,
    })
    let [reactionState, setReactionState] = useState(0);

    let handleLike = ()=>{
      let newState;
      if(reactionState == 0) newState = 1; // if neutral, now like
      if(reactionState == 1) newState = 0; // if likes, now neutral
      if(reactionState == -1) newState = 1; // if dislikes, now likes
       updateReactionState(newState);
    }

    let handleDislike = ()=>{
      let newState;
      if(reactionState == 0) newState = -1;
      if(reactionState == 1) newState = -1;
      if(reactionState == -1) newState = 0;
      updateReactionState(newState);
    }

    let updateReactionState = newState =>{

    }
    
    useEffect(()=>{
      fetch("//localhost:8000/video/interact/reactions?video_id="+id, {
        headers:{
          Authorization:"Bearer "+localStorage.token,
          'accept': 'application/json',
        }
      }).then(response => response.json().then(parsedJSON=>{
        if(response.status == 200){
          setReactions(parsedJSON);
        }
        else NotificationManager.error("Like/dislike counters could not be loaded. Your session may have expired");
      }))
    }, []);

    let updateComment = (e)=>{
      setComment(e.target.value);
    }

    let sendComment = ()=>{
      if(comment.length<5) NotificationManager.error("Your comment must have at least 5 characters");
      else {
        fetch("//localhost:8000/video/interact/comment", {
          method:"POST",
          headers:{
            Authorization:"Bearer " +localStorage.token,
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            content:comment,
            video_id:parseInt(id),
          })
        }).then(response=>response.json().then(parsedJSON=>{
          if(response.status == 200){
            let videoDataAux = Object.create(videoData);
            videoDataAux.comments.unshift(parsedJSON); // push at the top
            setVideoData(videoDataAux);
            setComment("");
            NotificationManager.info("Comment succesfully added!");
          } else {
            NotificationManager.error("Comment couldn't be posted. You may not be logged in anymore. Please save your comment and refresh the page");
          }
        }))
      } 
    }

    let [videoData, setVideoData] = useState(null);
    let router = useRouter();
    let {id} = router.query;
    useEffect(()=>{
        fetch("//localhost:8000/video/"+id, {
            headers:{
                Authorization:"Bearer "+localStorage.token
            }
        }).then(response=>response.json().then(parsedJSON=>{
            if(response.status != 200 || parsedJSON == null) router.push("/");
            else {
                parsedJSON.comments = parsedJSON.comments.reverse();
                setVideoData(parsedJSON);
            }
        }))
    }, []);

    useEffect(()=>{
        if(videoData == null || videoData.posterName) return;
        fetch("//localhost:8000/user/"+videoData.owner_id, {
            headers:{
                Authorization:"Bearer "+localStorage.token,
            }
        }).then(response => response.json().then(parsedJSON=>{
            if(response.status == 200){
                setVideoData({
                    ...videoData, 
                    posterName:parsedJSON.username,
                    profilePic:parsedJSON.profile_picture_link.replace("../", "/"),
                })
            }
        }))
    }, [videoData]);

    let share = (e)=>{
      copyTextToClipboard("localhost:3000"+router.asPath);
      NotificationManager.info("Video link has been copied to your clipboard!");
    }

  return (
    <>
      <PageHead title="Bananza - Video" />
      <Nav />
      {!!videoData &&
      <div className={styles.videoPage}>
        <div className={styles.videoPageLeft}>
          <Player
            playsInline
            src={`//localhost:8000${videoData.resource_link}`}
          />
          <div className={styles.videoData}>
            <div className={styles.videoInfo}>
              <span className={styles.videoTitle}>{videoData.title}</span>
              <span className={styles.videoDescription}>
                {videoData.description}
              </span>
            </div>
            <div className={styles.videoDataRight}>
              <div className={styles.likeContainer}>
              <span className={styles.shareButton} onClick={share}>Share</span>
                <span onClick={handleLike}><i class="fa-solid fa-thumbs-up"></i> {reactions.likes} Likes</span>
                <span onClick={handleDislike}><i class="fa-solid fa-thumbs-down"></i> {reactions.dislikes} Dislikes</span>
              </div>
              <div className={styles.authorBox}>
                {!!videoData && !!videoData.posterName && 
                <>
                    posted by <span>
                    <Link href={`/user/${videoData.owner_id}`}>Claudiu</Link></span><img className={styles.profilePic} src={`//localhost:8000${videoData.profilePic}`}/>
                </>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.videoPageRight}>
            <div className={styles.commentArea}>
                <textarea value={comment} onChange={updateComment} placeholder="Speak your mind!"></textarea>
                <button onClick={sendComment}>Comment</button>
            </div>
            <hr></hr>
            <div className={styles.commentsArea}>
                {videoData.comments.reverse().map((comment, key)=>(
                    <div className={styles.comment} key={key}>
                    <span className={styles.commentAuthor}>
                      <Link href={`/user/${comment.user.id}`}>{comment.user.username}</Link>
                      <img class={styles.commentAvatar} src=
                        {`//localhost:8000${comment.user.profile_picture_link.replace("../", "/")}`}/>
                        </span>
                    <span className={styles.commentText}>{comment.content}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    }
    </>
  );
}
