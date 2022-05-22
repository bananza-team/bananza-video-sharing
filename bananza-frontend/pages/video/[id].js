import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import styles from "/styles/video.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
import { NotificationManager } from "react-notifications";
import Link from "next/link";
import { copyTextToClipboard } from "../../libs/clipboard";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Input from "/components/forms/input";
import Suspend from "../../components/others/suspend";
import {
  validateLength,
  validateMail,
  validatePhone,
  addValidation,
  validateExists,
  basicLength
} from "/libs/validation/validation.js";

export default function Video(props) {

    if(!props.user){
      useRouter().push("/");
      return;
    }

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
       updateReactionState(newState, reactionState, "like");
    }

    let handleDislike = ()=>{
      let newState;
      if(reactionState == 0) newState = -1;
      if(reactionState == 1) newState = -1;
      if(reactionState == -1) newState = 0;
      updateReactionState(newState, reactionState, "dislike");
    }

    let updateReactionState = (newState, oldState, action) =>{
      (()=>{})(); // hack for react, otherwise state is incorrectly updated
      fetch("//localhost:8000/video/interact/react", {
        method:"PATCH",
        body:JSON.stringify({
          state:action,
          video_id:parseInt(id),
        }),
        headers:{
          Authorization:"Bearer "+localStorage.token,
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(response => response.json().then(parsedJSON=>{
        if(response.status == 200){
          setReactionState(newState);
          let likesCorrection = (oldState !=1 && newState == 1)?1:(oldState == 1 && newState !=1)?-1:0;
          let dislikesCorrection = (oldState == -1 && newState !=-1)?-1:(newState == -1 && oldState !=-1)?1:0;
          setReactions({
            likes:reactions.likes+likesCorrection,
            dislikes:reactions.dislikes+dislikesCorrection,
          })
        } else {
          NotificationManager.error("Reaction unsuccesful");
        }
      }))
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
          let rawState = parsedJSON.current_user_reaction;
          setReactionState(rawState == "dislike"?-1:(rawState == "neutral")?0:1);
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

    let [videoData, setVideoData] = useState({
      title:"",
      description:"",
      comments:[]
    });
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
                setNewVideoData(parsedJSON);
            }
        }))
    }, []);

    useEffect(()=>{
        if(videoData.owner_id == undefined || videoData.posterName) return;
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

    let report = (e)=>{
      let reason = e.target.innerHTML;
      confirmAlert({
        title:"Confirm video flagging",
        message:"Are you sure you want to flag this video?",
        buttons:[
          {
            label:"Yes",
            onClick:()=>{
              fetch("//localhost:8000/video/interact/report", {
                method:"POST",
                headers:{
                  Authorization:"Bearer "+localStorage.token,
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                  reason:reason,
                  video_id:parseInt(id),
                })
              }).then(response=>response.json().then(parsedJSON=>{
                if(response.status == 200) 
                  NotificationManager.info("Video flagged succesfully. Thank you!");
                else 
                  if(response.status == 403)
                    NotificationManager.error("You have already reported this video. A manager will review your report soon!");
                  else 
                    NotificationManager.error("An error occured while flagging the video. You may not be logged in anymore");
              }))
            }
          }, {
            label:"No",
            onClick:()=>{
              
            }
          }
        ]
      })
    }
    
    let deleteHandler = (e)=>{
      confirmAlert({
        title:"Confirm video deletion",
        message:"Are you sure you want to delete this video?",
        buttons:[
          {
            label:"Yes",
            onClick:()=>{
              fetch("//localhost:8000/video/"+videoData.id, {
                method:"DELETE",
                headers:{
                  'accept':'application/json',
                  Authorization: "Bearer "+localStorage.token,
                }
              }).then(response=>response.json().then(parsedJSON=>{
                if(response.status == 200){
                  NotificationManager.info("Video deleted succesfully");
                  window.location.reload();
                } else {
                  if(response.status == 403) NotificationManager.error("You are not authorized to delete this video");
                  NotificationManager.error("Error occured while deleting video");
                }
              }))
            }
          }, {
            label:"No",
          }
        ]
      })
    }

    let [editing, setEditing] = useState(0);
    let [newVideoData, setNewVideoData]= useState(null);

    let basicLength = (data) => {
      return validateLength(3, 40, data);
    };

    let editVideo = (e)=>{
      e.preventDefault();
      let response = {
        state:true,
        messages:[],
      }
      response = addValidation(response, ["title", newVideoData.title], basicLength);
      response = addValidation(response, ["description", newVideoData.description], basicLength); 

      response.messages.forEach(message => NotificationManager.error(message));
    
      let apiURL = new URL("localhost:8000/video/"+videoData.id+"/");
      apiURL.searchParams.append("title", newVideoData.title);
      apiURL.searchParams.append("description", newVideoData.description);

      fetch("//"+apiURL.href, {
        method:"PATCH",
        headers:{
          'accept':'application/json',
          Authorization:"Bearer "+localStorage.token,
        }
      }).then(response => response.json().then(parsedJSON=>{
        if(response.status == 200){
          parsedJSON.comments = parsedJSON.comments.reverse();
          setVideoData(parsedJSON);
          setEditing(0);
        } else NotificationManager.error("Could not edit video data");
      }))
    }

    let updateNewInfo = (e)=>{
      setNewVideoData({
        ...newVideoData, [e.target.name]:e.target.value
    })
    }

    let deleteComment = (id)=>{
      confirmAlert({
        title:"Confirm comment deletion",
        message:"Are you sure you want to delete this comment?",
        buttons:[
          {
            label:"Yes",
            onClick:()=>{
              fetch("//localhost:8000/video/interact/comment/"+id, {
                method:"DELETE",
                headers:{
                  Authorization:"Bearer "+localStorage.token,
                  'accept':'application/json'
                }
              }).then(response=>response.json().then(parsedJSON=>{
                if(response.status == 200){
                  NotificationManager.info("Deletion succesful");
                  let oldComments = videoData.comments;
                  let newComments = oldComments.filter(comment => comment.id != id);
                  let newData = Object.create(videoData);
                  newData.comments = newComments;
                  setVideoData(newData);
                }
                else if(response.status == 403) NotificationManager.error("You are not authorized to delete this comment");
                else NotificationManager.error("Unknown error while deleting comment");
              }))
            }
          },
          {
            label:"No"
          }
        ]
      })
    }

  return (
    <>
      <PageHead title="Bananza - Video" />
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
                <span className={`${reactionState==1?styles.activeReaction:""}`} onClick={handleLike}><i class="fa-solid fa-thumbs-up"></i> {reactions.likes} Likes</span>
                <span className={`${reactionState==-1?styles.activeReaction:""}`} onClick={handleDislike}><i class="fa-solid fa-thumbs-down"></i> {reactions.dislikes} Dislikes</span>
                <div className={styles.menuButton}>
                <i class="fa-solid fa-bars"></i>
                </div>
                <div className={styles.menu}>
                  <span className={styles.flagMenuItem}>
                    <span className={styles.flagButton}>Flag</span>
                    <div className={styles.flagReasons}>
                      <span onClick={report}>Spam</span>
                      <span onClick={report}>Infringes on my copyright</span>
                      <span onClick={report}>Fake news</span>
                    </div></span>
                    {(props.user.id == videoData.owner_id || props.user.type!="creator") &&
                  <>
                    <span onClick={()=>{setEditing(1)}}>Edit</span>
                    <span onClick={deleteHandler}>Delete</span>
                  </>
                    }
                </div>
              </div>
              <div className={styles.authorBox}>
                {!!videoData && !!videoData.posterName && props.user.type == "manager" &&
                    <Suspend user_id={videoData.owner_id}/>
                }
                {!!videoData && !!videoData.posterName && 
                <>
                    posted by <span>
                    <Link href={`/user/${videoData.owner_id}`}>{videoData.posterName}</Link></span><img className={styles.profilePic} src={`//localhost:8000${videoData.profilePic}`}/>
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
                          {
                            (props.user.type != "creator" || props.user.id == videoData.owner_id || props.user.id == comment.user_id) &&
                            <span className={styles.commentMenu}>
                             <span className={styles.commentMenuButton}>
                              <i class="fa-solid fa-bars"></i>
                            </span>
                             <span className={styles.commentMenuInner}>
                               <span onClick={()=>{deleteComment(comment.id)}}>Delete</span>
                             </span>
                            </span>
                          }
                        </span>
                    <span className={styles.commentText}>{comment.content}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    }
    { !!editing &&
    <div className={styles.editPopup}>
      <div className={styles.editPopupInner}>
        <span className={styles.editPopupHeader}>
          <span className={styles.editPopupHeaderText}>Edit your video</span>
          <span className={styles.editPopupClose} onClick={()=>{setEditing(0)}}><i class="fa-solid fa-xmark"></i></span>
          </span>
        <div className={styles.editPopupForm}>
          <form onChange={updateNewInfo} onSubmit={editVideo}>
            <Input name="title"
              value={newVideoData.title} placeholderText="New video title" label="Title"></Input>
            <Input name="description"
              value={newVideoData.description} placeholderText="New video description" label="Description"></Input>
            <button type="submit" className={styles.editPopupSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  }
    </>
  );
}
