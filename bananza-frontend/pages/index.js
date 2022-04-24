import PageHead from "/components/general/pageHead.js";
import styles from "../styles/Home.module.css";
import Input from "/components/forms/input.js";
import React, { useState } from "react";

let login = (event) => {
  event.preventDefault();
};

let register=login;

export default function Home() {
  const [activeForm, setActiveForm] = useState(0);
  const [registerFormData, setRegisterFormData] = useState({
    username:'', email:'', password:'', applyManager:''
  });

  const updateRegisterData = (e)=>{
    setRegisterFormData({...registerFormData, [e.target.name]:e.target.value});
    console.log(e.target.value);
  }

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
            {/* !! to prevent React from rendering a 0 */}
            {!!activeForm && 
            <span id="register-form">
              <form onSubmit={register} onChange={updateRegisterData}>
              <Input name="username" placeholderText="Your username" label="Username" inputType="text"/>
              <Input name="password" placeholderText="Your password" label="Password" inputType="password"/>
              <Input name="email" placeholderText="Your email" label="Email" inputType="email"/>
              </form>
            </span>
            }
            {!activeForm && (
              <span id="login-form">
                <form onSubmit={login}>
                  <Input name="username" placeholderText="Your username" label="Username" inputType="text"/>
                  <Input name="password" placeholderText="Your password" label="Password" inputType="password"/>
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
