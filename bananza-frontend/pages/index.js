import PageHead from "/components/general/pageHead.js";
import styles from "../styles/Home.module.css";
import Form from "/components/forms/form.js";
import React, { useState } from "react";

let login = (event) => {
  event.preventDefault();
};

export default function Home() {
  const [activeForm, setActiveForm] = useState(0);
  return (
    <>
      <PageHead pageTitle="Bananza - Homepage"></PageHead>
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
            {!!activeForm && <span id="register-form">register form here</span>}
            {/* !! to prevent React from rendering a 0 */}
            {!activeForm && (
              <span id="login-form">
                <form onSubmit={login}>
                  <span>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="Your username"></input>
                  </span>
                  <span>
                    <label or="password">Password</label>
                    <input type="password" placeholder="Your password"></input>
                  </span>
                  <span>
                    <button type="submit">Submit</button>
                  </span>
                </form>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
