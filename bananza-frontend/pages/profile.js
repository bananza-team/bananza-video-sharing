import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import styles from "../styles/profile.module.css";
import Input from "/components/forms/input";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
export default function Profile(props) {
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
        <div
          className={styles.profileBox}
          style={{ background: `url(${props.user.cover_picture_link})` }}
        >
          <span className={styles.updateCoverButton}>Change</span>
          <div className={styles.profileAvatarBox}>
            <img src={props.user.profilePicture} />
            <div className={styles.updateAvatarOverlay}>
              <span className={styles.updateAvatarButton}>Change</span>
            </div>
          </div>
          <div className={styles.profileUsernameBox}>
            <Input
              className="fancyInput"
              name="channelName"
              placeholder=""
              value={props.user.channelName}
            />
            <Input
              className="fancyInput"
              name="channeldescription"
              placeholder=""
              value={props.user.channelDescription}
            />
          </div>
        </div>
        <div className={styles.profileColumns}>
          <div className={styles.profileColumn}>
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
                value={props.user.password}
              />
            </div>
          </div>
        </div>
      </>
    );
}
