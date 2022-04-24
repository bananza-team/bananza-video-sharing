import PageHead from "/components/general/pageHead";
import styles from "../styles/Home.module.css";
import Input from "/components/forms/input";
import React, { useState } from "react";
import Checkbox from "/components/forms/checkbox";

let login = (event) => {
  event.preventDefault();
};

let register=login;

export default function Home() {
  let [activeForm, setActiveForm] = useState(0);
  let [registerFormData, setRegisterFormData] = useState({
    username:'', email:'', password:'', applyManager:false
  });

  const updateRegisterData = (e)=>{
    if(e.target.type!="checkbox"){
      setRegisterFormData({...registerFormData, [e.target.name]:e.target.value});
      console.log(e);
    } else {
      setRegisterFormData({...registerFormData, ["applyManager"]:!registerFormData.applyManager});
    }
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
              <Checkbox onChange={updateRegisterData} name="applyManager" label="Apply for Manager" value={registerFormData.applyManager}>
                manager options
              </Checkbox>
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
