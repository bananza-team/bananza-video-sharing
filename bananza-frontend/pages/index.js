import PageHead from "/components/general/pageHead";
import styles from "../styles/Home.module.css";
import Input from "/components/forms/input";
import React, { useState } from "react";
import Checkbox from "/components/forms/checkbox";
import Nav from "/components/general/nav";
import VideoList from "/components/videos/videolist";
import LatestReports from "/components/reports/latestReports";
import {
  validateLength,
  validateMail,
  validatePhone,
  addValidation,
} from "/libs/validation/validation.js";
import { NotificationManager } from "react-notifications";

export default function Home() {

  let [userState, setUserState] = useState(0);
  let [activeForm, setActiveForm] = useState(0);
  let [registerFormData, setRegisterFormData] = useState({
    username: "",
    email: "",
    password: "",
    type: "creator",
    description: "Your channel's description",
    profile_picture_link: "default.png",
    cover_picture_link: "default.png",
    applyManager: false,
    is_active: true,
    cv_link: "",
    name: "",
    surname: "",
    phone: "",
  });

  let login = (event) => {
    event.preventDefault();
    setUserState(1);
  };

  let register = (event) => {
    event.preventDefault();
    let data = registerFormData;
    data.cv_link = "test link";

    let basicLength = (data)=>{
      return validateLength(3, 20, data);
    };

    let response = {
      status:true,
      messages:[],
    }
    response = addValidation(response, ["Username", data.username], basicLength);
    response = addValidation(response, ["Email", data.email], validateMail);
    response = addValidation(response, ["Password", data.password], basicLength);

    if (data.applyManager) {
      response = addValidation(response, ["Name", data.name], basicLength);
      response = addValidation(response, ["Surname", data.surname], basicLength);
      response = addValidation(response, ["Phone number", data.phone], validatePhone);
    }

    delete data.applyManager;

    if(response.status){

    fetch("//localhost:8000/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then(console.log);
  } else {
    response.messages.forEach(message =>{
      NotificationManager.error(message);
    })
  }
  };

  const updateRegisterData = (e) => {
    if (e.target.type == "file") {
      setRegisterFormData({
        ...registerFormData,
        ["cv_link"]: e.target.files[0],
      });
      return;
    }

    if (e.target.type == "checkbox") {
      setRegisterFormData({
        ...registerFormData,
        ["applyManager"]: !registerFormData.applyManager,
      });
      return;
    }

    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  let videos = [
    {
      thumbnail: "test.png",
      title: "video title",
      description: "video description",
      channel: "channel name",
      key: 0,
    },
    {
      thumbnail: "test.png",
      title: "video title2",
      description: "video description2",
      channel: "channel name2",
      key: 1,
    },
  ];
  videos[2] = videos[3] = videos[4] = videos[0];

  let reports = [
    {
      video: videos[0],
      reportReason: "misleading title",
      key: 0,
    },
  ];
  reports[1] = reports[2] = reports[3] = reports[4] = reports[0];

  return (
    <>
      <PageHead pageTitle="Bananza - Homepage"></PageHead>
      {!userState && (
        <div className={`${styles.guestcontainer}`}>
          <div className={styles.biglogo}>
            <img src="/logo.png" />
          </div>
          <div className={styles.formsBG}>
            <div className={styles.guestForms}>
              <div className={styles.guestOptions}>
                <span
                  onClick={() => setActiveForm(0)}
                  className={`${styles.guestOption} ${
                    activeForm == 0 ? styles.selected : ""
                  }`}
                  id="guest-login"
                >
                  Login
                </span>
                <span
                  onClick={() => setActiveForm(1)}
                  className={`${styles.guestOption} ${
                    activeForm ? styles.selected : ""
                  }`}
                  id="guest-register"
                >
                  Register
                </span>
              </div>
              <div className={styles.gforms}>
                {/* !! to prevent React from rendering a 0 */}
                {!!activeForm && (
                  <span id="registerForm">
                    <form onSubmit={register} onChange={updateRegisterData}>
                      <div className="formFields">
                        <div className="formColumn">
                          <Input
                            name="username"
                            placeholderText="Your username"
                            label="Username"
                            inputType="text"
                            validate='[\"validateLength(3, 20)\"]'
                          />
                          <Input
                            name="password"
                            placeholderText="Your password"
                            label="Password"
                            inputType="password"
                            validate='[\"validateLength(8,20)\"]'
                          />
                          <Input
                            name="email"
                            placeholderText="Your email"
                            label="Email"
                            inputType="email"
                            validate='[\"validateMail\"]'
                          />
                        </div>
                        <div className="formColumn">
                          <Checkbox
                            onChange={updateRegisterData}
                            name="applyManager"
                            label="Apply for Manager"
                            value={registerFormData.applyManager}
                          >
                            <Input
                              name="name"
                              placeholderText="Your name"
                              label="Name"
                              inputType="text"
                              validate='[\"validateLength(8,20)\"]'
                              min="3"
                              max="20"
                            />
                            <Input
                              name="surname"
                              placeholderText="Your surname"
                              label="Surname"
                              inputType="text"
                              validate='[\"validateLength(8,20)\"]'
                            />
                            <Input
                              name="phone"
                              placeholderText="Your phone number"
                              label="Phone number"
                              inputType="text"
                              validate='[\"validatePhone\"]'
                            />
                            <Input
                              name="cv"
                              placeholderText="Your cv"
                              label="Upload CV"
                              inputType="file"
                            />
                          </Checkbox>
                        </div>
                      </div>
                      <div className="formSubmit">
                        <button type="submit">Submit</button>
                      </div>
                    </form>
                  </span>
                )}
                {!activeForm && (
                  <span id="login-form">
                    <form onSubmit={login}>
                      <div className="formFields">
                        <div className={styles.formColumn}>
                          <Input
                            name="username"
                            placeholderText="Your username"
                            label="Username"
                            inputType="text"
                          />
                          <Input
                            name="password"
                            placeholderText="Your password"
                            label="Password"
                            inputType="password"
                          />
                        </div>
                      </div>
                      <div className="formSubmit">
                        <button type="submit">Submit</button>
                      </div>
                    </form>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {!!userState && (
        <>
          <Nav />
          <VideoList videos={videos} header="Top five videos of today" />
          <LatestReports reports={reports} />
        </>
      )}
    </>
  );
}
