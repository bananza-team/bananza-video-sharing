import "../styles/globals.css";
import Layout from "../components/general/layout";
import "normalize.css/normalize.css";
import "react-notifications/lib/notifications.css";
import Loading from "../components/general/loading";
import React, { useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import getCurrentUser from "../libs/users/currentuser";

function MyApp({ Component, pageProps }) {
  let user = getCurrentUser();
  pageProps.user = user.user;
  return (
    <>
      <Layout>
      {!!user.loading && <Loading/>}  
      {!user.loading && <Component {...pageProps} />}</Layout>
      <NotificationContainer />
    </>
  );
}

export default MyApp;
