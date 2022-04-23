import PageHead from "/components/general/pageHead.js";
import styles from "../styles/Home.module.css";
import Form from "/components/forms/form.js";

function login(){
  console.log("login handler");
}

export default function Home() {
  return (
    <>
      <PageHead pageTitle="Bananza - Homepage"></PageHead>
      <div className={`${styles.guestcontainer}`}>
          <div className={styles.biglogo}>
            <img src="/logo.png" />
          </div>
        <div className={styles.guestForms}>
          <div className={styles.guestoptions}>
            <span className={styles.guestoption} id="guest-login">
              Login
            </span>
            <span className={styles.guestoption} id="guest-register">
              Register
            </span>
          </div>
          <div className={styles.gforms}>
            <span id="login-form">
              <Form eventHandler="login">
                <span>
                  <label for="username">Username</label>
                  <input type="text" placeholder="Your username"></input>
                </span>
                <span>
                  <label for="password">Password</label>
                  <input type="password" placeholder="Your password"></input>
                </span>
                <span><button type="submit">Submit</button></span>
              </Form>
            </span>
            <span id="register-form"></span>
          </div>
        </div>
      </div>
    </>
  );
}
