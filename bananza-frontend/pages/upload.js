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


export default function Upload(props) {

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

    let upload = (e)=>{
        e.preventDefault();

        let response = {
            state: true,
            messages: []
        }
        
        response = addValidation(response, ["Video title", videoData.title], createLengthValidator(3, 20));

        response.messages.forEach(message=>NotificationManager.error(message));

    }

  return (
    <>
      <PageHead title="Bananza - Edit Profile" />
      <Nav />
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
              <label for="thumbnail">
                Video thumbnail
                <input name="thumbnail" 
                    onChange={(e)=>{setThumbnail(e.target.files[0])}} id="thumbnail" type="file" />
              </label>
            </div>
            <div className={styles.formColumn}>
              <label for="video">
                Video title
                <input name="video"
                    onChange={(e)=>{setVideo(e.target.files[0])}} id="video" type="file" />
              </label>
            </div>
          </div>
        </div>
        <button className={styles.submitButton}>Upload</button>
      </form>
    </>
  );
}
