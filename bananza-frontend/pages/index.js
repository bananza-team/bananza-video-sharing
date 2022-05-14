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
  validateExists,
} from "/libs/validation/validation.js";
import { NotificationManager } from "react-notifications";
import Router from "next/router";

let fileOnChange = (e) => {
  setCVFile(e.target.files[0]);
};

export default function Home(props) {
  let [cvfile, setCVFile] = useState(null);
  let [activeForm, setActiveForm] = useState(0);

  let [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });

  let [registerFormData, setRegisterFormData] = useState({
    username: "",
    email: "",
    password: "",
    type: "creator",
    description: "Your channel's description",
    profile_picture_link: "../resources/pictures/profile_pic/default.png",
    cover_picture_link: "default.png",
    applyManager: false,
    is_active: true,
    cv_link: null,
    name: "",
    surname: "",
    phone: "",
  });

  function login(event) {
    event.preventDefault();
    console.log(loginFormData);

    let response = {
      status: true,
      messages: [],
    };
    response = addValidation(
      response,
      ["Username", loginFormData.username],
      validateExists
    );
    response = addValidation(
      response,
      ["Password", loginFormData.password],
      validateExists
    );

    if (response.status) {
      let formData = new FormData();
      formData.append("username", loginFormData.username);
      formData.append("password", loginFormData.password);
      formData.append("grant_type", "password");

      fetch("//localhost:8000/auth/login", {
        method: "POST",
        body: formData,
      }).then((response) => {
        response.json().then((parsedJSON) => {
          if (response.status == 200) {
            localStorage.setItem("token", parsedJSON.access_token);
            Router.reload();
          } else {
            NotificationManager.error("Login failed");
          }
        });
      });
    } else {
      response.messages.forEach((message) => {
        NotificationManager.error(message);
      });
    }
  }

  let register = (event) => {
    event.preventDefault();
    let data = Object.assign({}, registerFormData);
    // otherwise delete data.applyManager would delete it from the state too

    data.cv_link = "";

    let basicLength = (data) => {
      return validateLength(3, 20, data);
    };

    let response = {
      status: true,
      messages: [],
    };
    response = addValidation(
      response,
      ["Username", data.username],
      basicLength
    );
    response = addValidation(response, ["Email", data.email], validateMail);
    response = addValidation(
      response,
      ["Password", data.password],
      basicLength
    );

    if (data.applyManager) {
      response = addValidation(response, ["Name", data.name], basicLength);
      response = addValidation(
        response,
        ["Surname", data.surname],
        basicLength
      );
      response = addValidation(
        response,
        ["Phone number", data.phone],
        validatePhone
      );
      window.f = registerFormData;
      response = addValidation(response, ["CV File", cvfile], (data) => {
        window.data = data;
        return {
          status: data[1] != undefined,
          messages: ["CV File must be uploaded"],
        };
      });
      response = addValidation(response, ["CV File", cvfile], (data) => {
        return {
          status: data[1]
            ? data[1].name.split(".").pop().toLowerCase() == "pdf"
            : false,
          messages: ["CV File must be a PDF file"],
        };
      });
      response = addValidation(response, ["CV File", cvfile], (data) => {
        return {
          status: data[1] ? data[1].size != 0 : false,
          messages: ["CV File can't be empty"],
        };
      });
    }

    delete data.applyManager;

    if (response.status) {
      fetch("//localhost:8000/user/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        response.json().then((parsedJSON) => {
          if (response.status == 200) {
            NotificationManager.info("Registration was succesful!");
            window.f = registerFormData.cv_link;

            if (!registerFormData.applyManager) {
              setActiveForm(0);
              return;
            }
            let file = new FormData();
            file.append("cv_file", cvfile);
            console.log(file);
            fetch("//localhost:8000/application/" + parsedJSON.id, {
              method: "POST",
              body: file,
            })
              .then((response) => {
                const error = (data && data.message) || response.status;
                if (!response.ok) return Promise.reject(error);
              })
              .catch(() => {
                NotificationManager.error("Error uploading CV");
              });
            setActiveForm(0);
            return;
          }

          if (response.status == 409) {
            NotificationManager.error(parsedJSON.message);
            return;
          }

          if (response.status == 422) {
            NotificationManager.error(parsedJSON.detail.msg);
            return;
          }

          NotificationManager.error("Unknown Network Error");
        });
      });
    } else {
      response.messages.forEach((message) => {
        NotificationManager.error(message);
      });
    }
  };

  const updateRegisterData = (e) => {
    if (e.target.type == "file") {
      setCVFile(e.target.files[0]);
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

  let updateLoginData = (e) => {
    setLoginFormData({
      ...loginFormData,
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
      {!props.user && (
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
                          />
                          <Input
                            name="password"
                            placeholderText="Your password"
                            label="Password"
                            inputType="password"
                          />
                          <Input
                            name="email"
                            placeholderText="Your email"
                            label="Email"
                            inputType="email"
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
                            />
                            <Input
                              name="surname"
                              placeholderText="Your surname"
                              label="Surname"
                              inputType="text"
                            />
                            <Input
                              name="phone"
                              placeholderText="Your phone number"
                              label="Phone number"
                              inputType="text"
                            />
                            <Input
                              name="cv"
                              placeholderText="Your cv"
                              label="Upload CV"
                              inputType="file"
                              onChange={fileOnChange}
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
                    <form
                      onSubmit={login}
                      onChange={updateLoginData}
                      autoComplete="off"
                    >
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
                            value=""
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
      {props.user && (
        <>
          <Nav />
          <VideoList videos={videos} header="Top five videos of today" />
          <LatestReports reports={reports} />
        </>
      )}
    </>
  );
}
