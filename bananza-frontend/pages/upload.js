import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import Input from "/components/forms/input";
import styles from "../styles/upload.module.css";
import React, { useEffect, useState } from "react";
import {
  validateLength,
  validateMail,
  validatePhone,
  addValidation,
  validateExists,
} from "/libs/validation/validation.js";
import { NotificationManager } from "react-notifications";
import { createLengthValidator } from "../libs/validation/validation";
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";
import Router from "next/router";

export default function Upload(props) {

    if(!props.user){
      Router.push("/");
      return;
    }

    let [uploading, setUploading] = useState(0);

    let [videoData, setVideoData] = useState({
        title:"",
        description:"",
    })

    let updateVideoData = (e)=>{
        if(e.target.type == "text"){
            setVideoData({
                ...videoData, [e.target.name]:e.target.value
            })
        }
    }

    let [video, setVideo] = useState(null);
    let [thumbnail, setThumbnail] = useState(null);
    let [progress, setProgress] = useState(-1);

    let upload = (e)=>{
      
        e.preventDefault();

        if(uploading) return;
        setUploading(1);

        console.log(video);

        let response = {
            status: true,
            messages: []
        }
        
        response = addValidation(response, ["Video title", videoData.title], createLengthValidator(3, 20));
        response = addValidation(response, ["Video description", videoData.description], createLengthValidator(3, 40));
        response = addValidation(response, ["Video", video], (data)=>{
            return {
                status:data[1]!=undefined,
                messages:["Video file must be uploaded"],
            }
        })
        response = addValidation(response, ["Video", video], (data)=>{
            return {
                status: data[1]
                ? /mp4|mov|avi/.test(data[1].name.split(".").pop().toLowerCase())
                : false,
                messages:["The video must be a video file(mp4/mov/avi extension)"],
            }
        })
        response = addValidation(response, ["Video", video], (data)=>{
            return {
                status:data[1] ? data[1].size != 0 : false,
                messages:["Video file can't be empty"]
            }
        })

        response = addValidation(response, ["Thumbnail", thumbnail], (data)=>{
            return {
                status:data[1]!=undefined,
                messages:["Thumbnail file must be uploaded"],
            }
        })

        response = addValidation(response, ["Thumbnail", thumbnail], (data)=>{
            return {
                status: data[1]
                ? /jpg|jpeg|png|gif/.test(data[1].name.split(".").pop().toLowerCase())
                : false,
                messages:["The thumbnail must be an image(jpg/jpeg/png/gif extension)"],
            }
        })
        
        response = addValidation(response, ["Thumbnail", thumbnail], (data)=>{
            return {
                status:data[1] ? data[1].size != 0 : false,
                messages:["Thumbnail file can't be empty"]
            }
        })


        response.messages.forEach(message=>NotificationManager.error(message));
        
        if(!response.status){
          setUploading(0);
          return;
        }

        let xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event)=>{
            setProgress(parseInt(event.loaded/event.total*100));
        }

        xhr.upload.onload = ()=>{
          NotificationManager.info("Video upload complete!");
          setProgress(-1);
        }

        xhr.upload.onerror = ()=>{
          NotificationManager.error("Video upload failed");
          setProgress(-1);
        }
        
        xhr.upload.onabort = ()=>{
          NotificationManager.error("Video upload was aborted");
        }

        xhr.onload = ()=>{
          setUploading(0);
          setProgress(-1);

          if(xhr.status == 401){
            NotificationManager.error("You are not authenticated");
            setTimeout(Router.reload, 1000);
          }

        }

        xhr.onerror = (error)=>{
          NotificationManager.error(error);
        }

        xhr.open('POST', "//localhost:8000/video/?"+new URLSearchParams(videoData));
        xhr.setRequestHeader('Authorization','Bearer '+localStorage.token);
        let data=new FormData();
        data.append("video_file", video);
        data.append("thumbnail_file", thumbnail);
        xhr.send(data);

    }

  return (
    <>
      <PageHead title="Bananza - Edit Profile" />
      <form onChange={updateVideoData} onSubmit={upload} className={styles.uploadForm}>
          <h2>Upload video</h2>
        <div className={styles.formWrap}>
          <div className="formFields">
            <div className={styles.formColumn}>
              <Input
                label="Video title"
                name="title"
                placeholderText="Video title"
              />
              <Input
                label="Video description"
                name="description"
                placeholderText="Video description"
              />
            </div>
            <div className={styles.formColumn}>
              <label for="video">
                Video file
                <input name="video"
                    onChange={(e)=>{setVideo(e.target.files[0])}} id="video" type="file" />
                {progress>=0 && <>
                <div className={styles.progress}>
                <span className={styles.progressBar} style={{"--progress":`${progress}`+"%"}}></span>
                <span className={styles.progressText}>Uploading - {parseInt(progress)}%</span>
                </div>
                </>}
              </label>
            </div>
            <div className={styles.formColumn}>
              <label for="thumbnail">
                Video thumbnail
                <input name="thumbnail" 
                    onChange={(e)=>{setThumbnail(e.target.files[0])}} id="thumbnail" type="file" />
              </label>
            </div>
          </div>
        </div>
        <button className={styles.submitButton}>Upload</button>
      </form>
    </>
  );
}
