import PageHead from "/components/general/pageHead";
import styles from "../styles/Home.module.css";
import Input from "/components/forms/input";
import React, { useState } from "react";
import Checkbox from "/components/forms/checkbox";
import Link from "next/link";

export default function Home() {
  let [userState, setUserState] = useState(0);
  let [activeForm, setActiveForm] = useState(0);
  let [registerFormData, setRegisterFormData] = useState({
    username: "",
    email: "",
    password: "",
    applyManager: false,
  });

  let login = (event) => {
    event.preventDefault();
    setUserState(1);
  };

  let register = login;

  const updateRegisterData = (e) => {
    if (e.target.type != "checkbox") {
      setRegisterFormData({
        ...registerFormData,
        [e.target.name]: e.target.value,
      });
      console.log(e);
    } else {
      setRegisterFormData({
        ...registerFormData,
        ["applyManager"]: !registerFormData.applyManager,
      });
    }
  };

  return (
    <>
      <PageHead pageTitle="Bananza - Homepage"></PageHead>
      {!userState && (
        <div className={`${styles.guestcontainer}`}>
          <div className={styles.biglogo}>
            <img src="/logo.png" />
          </div>
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
      )}
      {!!userState &&
      <nav>
        <span className="leftNav">
          <Link href="/"><a>Home</a></Link>
          <Link href="/profile"><a>Profile</a></Link>
        </span>
        <span className="rightNav">
          <Link href="/channel"><a>Channel</a></Link>
          <Link href="/logout"><a>Logout</a></Link>
        </span>
        </nav>
      }
    </>
  );
}
