import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import styles from "../styles/profile.module.css";
import Input from "/components/forms/input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import VideoListWide from "/components/videos/videolistwide";
import Router from "next/router";
import {
  validateLength,
  validateMail,
  validatePhone,
  addValidation,
  validateExists,
  createLengthValidator
} from "/libs/validation/validation.js";
import { NotificationManager } from "react-notifications";
export default function Profile(props) {

  if(!props.user){
    Router.push("/");
    return;
  }
  props.user.isManager = props.user.name.length != 0;

  let [menu, setMenu] = useState(0);
  let [profileData, setProfileData] = useState({
    ...props.user, "new_password":"", "old_password":""
  });

  let updateMenu = (id)=>{
      setMenu(id);
  }

  let updateProfileData = (e) =>{
      setProfileData({
        ...profileData, [e.target.name]: e.target.value,
      })
  }

  let submit = (e)=>{
    e.preventDefault();
    
    let basicLength = createLengthValidator(3, 20);
    let extendedLength = createLengthValidator(3, 40);

    let response = {
      status:true,
      messages:[],
    }
    response = addValidation(response, ["Username", profileData.username], basicLength);
    response = addValidation(response, ["Email", profileData.email], validateMail);
    response = addValidation(response, ["Current Password", profileData.old_password], validateExists);
    if(profileData.new_password.length) 
      response = addValidation(response, ["New Password", profileData.new_password], basicLength);
    response = addValidation(response, ["Description", profileData.description], extendedLength);

    if(props.user.isManager){
      response = addValidation(response, ["Name", profileData.name], basicLength);
      response = addValidation(response, ["Surname", profileData.surname], basicLength);
      response = addValidation(response, ["Phone", profileData.phone], validatePhone);
    }

    response.messages.forEach(message => {
      NotificationManager.error(message);
    })

    if(!response.status) return;

    let data = profileData;
    delete data.cover_picture_link;
    delete data.profile_picture_link;
    delete data.isManager;
    delete data.is_active;
    delete data.type;
    delete data.cv_link;
    delete data.id;

    if(!data.new_password.length) data.new_password=data.old_password; // keep the old password if the new one wasn't filled in
    console.log(data);

    fetch("//localhost:8000/user/current/info", {
      method:"PATCH",
      body:JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
    }).then(response => response.json().then((parsedJSON)=>{
      if(response.status == 422) NotificationManager.error(parsedJSON.detail[0].msg);
      else if(response.status == 401) NotificationManager.error(parsedJSON.message, parsedJSON.details);
      else if(response.status == 200){
        NotificationManager.info("Your profile was succesfully updated");
        setTimeout(Router.reload, 1000);
      } else NotificationManager.error(parsedJSON.message?parsedJSON.message:"Unknown network error");
    }))

  }

  let [avatar, updateAvatar] =
   useState("//localhost:8000"+props.user.profile_picture_link.replace("..", ""));
  let [cover, updateCover] =
   useState("//localhost:8000"+props.user.cover_picture_link.replace("..", "").replace("\\", "/"));

  let uploadPicture = (apiLink, name, stateUpdate, field_name)=>{
    return (e)=>{
    let file= e.target.files[0];
    let response = {
      status:true,
      messages:[],
    }

    response = addValidation(response, [name, file], (data)=>{
      return {
      status:data[1] != undefined,
      message:name+" file must be uploaded",
      }
    }) // this validation may not be necessary

    response = addValidation(response, [name, file], (data)=>{
      return {
        status: data[1]
        ? /jpg|jpeg|png|gif/.test(data[1].name.split(".").pop().toLowerCase())
        : false,
      messages: ["The "+name+" must be an image(jpg, jpeg, png or gif)"],
      }
    })

    response = addValidation(response, [name, file], (data)=>{
      return {
        status: data[1] ? data[1].size != 0 : false,
        messages: [name+" file can't be empty"],
      }
    })

    response.messages.forEach(message => {
      NotificationManager.error(message);
    });

    if(!response.status) return;

    let body = new FormData();
    body.append(field_name, file);
    fetch(apiLink, {
      method:"PATCH",
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
      body:body
    }).then(response => response.json().then(parsedJSON=>{
      if(response.status == 200){
        NotificationManager.info(name+" updated");
        stateUpdate(URL.createObjectURL(file));
      } else {
        if(response.status == 401){
          NotificationManager.error("Not authenticated");
          setTimeout(Router.reload, 1000);
        } else {
          NotificationManager.error("Unknown error. Refreshing the page may help");
        }
      }
    }))

  }
}

  let router = useRouter();
  if (!props.user)
    useEffect(() => {
      router.push("/");
    }, []);
  else
    return (
      <>
        <PageHead title="Bananza - Edit Profile" />
        <form onSubmit={submit} onChange={updateProfileData} className="styleLessForm">
        <span className={styles.hint}><i class="fa-solid fa-circle-exclamation"></i> Click any data to edit it!</span>
        <div
          className={styles.profileBox}
          style={{backgroundImage: `url(${cover})`}}
        >
          <input type="file" id="cover-upload" hidden onChange={
            uploadPicture("//localhost:8000/user/current/cover_picture", "Cover picture", updateCover, "cover_pic")
          }/>
          <label className={styles.updateCoverButton} for="cover-upload">Change</label>
          <div className={styles.profileAvatarBox}>
            <img src={avatar} />
            <div className={styles.updateAvatarOverlay}>
              <input type="file" id="avatar-upload" hidden onChange={
                uploadPicture("//localhost:8000/user/current/profile_picture", "Avatar", updateAvatar, "profile_pic")
                }/>
              <label className={styles.updateAvatarButton} for="avatar-upload">Change</label>
            </div>
          </div>
          <div className={styles.profileUsernameBox}>
            <Input
              className="fancyInput"
              name="description"
              placeholder=""
              value={props.user.description}
            />
          </div>
        </div>
        <div className={styles.tabmenu}>
            <span onClick={() => updateMenu(0)}>Profile</span>
            <div className={styles.separator}></div>
            <span onClick={() => updateMenu(1)}>Videos</span>
          </div>
        <div className={styles.profileColumns}>
          {!menu && <><div className={styles.profileColumn}>
            <span className={styles.profileHeader}>Profile data</span>
            <div className={styles.profileColumnData}>
              <Input
                label="Username"
                className="fancyInput"
                name="username"
                placeholder=""
                value={props.user.username}
              />
              <Input
                inputType="email"
                label="Email"
                className="fancyInput"
                name="email"
                placeholder=""
                value={props.user.email}
              />
              <Input inputType="password" label="Current password"
              name="old_password" value={null} placeholderText="Current Password" className="fancyInput"/>
              <Input
                inputType="password"
                label="New Password"
                className="fancyInput"
                name="new_password"
                value={null}
                placeholderText="New password"
              />
            </div>
          </div>
          </>
          }

          {props.user.name.length != 0 && !menu && (
            <>
            <div className={styles.profileColumn}>
              <span className={styles.profileHeader}>Manager data</span>
              <div className={styles.profileColumnData}>
                <Input
                  label="Name"
                  className="fancyInput"
                  name="name"
                  placeholder=""
                  value={props.user.name}
                />
                <Input
                  label="Surname"
                  className="fancyInput"
                  name="surname"
                  placeholder=""
                  value={props.user.surname}
                />
                <Input label="Phone" className="fancyInput" name="phone" placeholder="" value={props.user.phone}/>
              </div>
            </div>
            </>
            )}
        </div>
        {!!menu && <VideoListWide user={props.user} header="Your videos" videos={props.user.videos}/>}
        {!menu &&
        <div className={styles.submitButton}>
            <button>Submit</button>
            </div>
}
      </form>
      </>
    );
}
