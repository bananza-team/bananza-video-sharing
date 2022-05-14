import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import styles from "../styles/profile.module.css";
import Input from "/components/forms/input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function Profile(props) {

  let [menu, setMenu] = useState(0);
  let [profileData, setProfileData] = useState(props.user);

  let updateMenu = (id)=>{
      setMenu(id);
  }

  let updateProfileData = (e) =>{
      setProfileData({
        ...profileData, [e.target.name]: e.target.value,
      })
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
        <Nav />
        <form onSubmit={submit} onChange={updateProfileData} className="styleLessForm">
        <span className={styles.hint}><i class="fa-solid fa-circle-exclamation"></i> Click any data to edit it!</span>
        <div
          className={styles.profileBox}
          style={{ background: `url(cover.jpg)` }}
        >
          <span className={styles.updateCoverButton}>Change</span>
          <div className={styles.profileAvatarBox}>
            <img src="default.png" />
            <div className={styles.updateAvatarOverlay}>
              <span className={styles.updateAvatarButton}>Change</span>
            </div>
          </div>
          <div className={styles.profileUsernameBox}>
            <Input
              className="fancyInput"
              name="channeldescription"
              placeholder=""
              value={props.user.description}
            />
          </div>
        </div>
        <div className={styles.tabmenu}>
            <span onClick={() => updateMenu(0)}>Profile</span>
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
              <Input
                inputType="password"
                label="Password"
                className="fancyInput"
                name="password"
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
              </div>
            </div>
            </>
            )}
          {!!menu && <>videos</>}
        </div>
        {!menu &&
        <div className={styles.submitButton}>
            <button>Submit</button>
            </div>
}
      </form>
      </>
    );
}
