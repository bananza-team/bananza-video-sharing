import PageHead from "/components/general/pageHead.js";
import styles from "../styles/Home.module.css";
import Form from "/components/forms/form.js";

let login = event => {
  event.preventDefault();
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
          <div className={styles.guestOptions}>
            <span className={`${styles.guestOption} ${styles.selected}`} id="guest-login">
              Login
            </span>
            <span className={styles.guestOption} id="guest-register">
              Register
            </span>
          </div>
          <div className={styles.gforms}>
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
                <span><button type="submit">Submit</button></span>
              </form>
            </span>
            <span id="register-form"></span>
          </div>
        </div>
      </div>
    </>
  );
}
