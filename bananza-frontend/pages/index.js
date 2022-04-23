import PageHead from "/components/general/pageHead.js"
import styles from "../styles/Home.module.css"
export default function Home() {
  return (
    <>
    <PageHead pageTitle="Bananza - Homepage"></PageHead>
    <div className={`${styles.guestcontainer}`}>
    <div className={styles.biglogo}><img src="/logo.png"/></div>
      <div className={styles.guestoptions}>
        <span className={styles.guestoption} id="guest-login">Login</span>
        <span className={styles.guestoption} id="guest-register">Register</span>
      </div>
      </div>
    </>
  )
}