import "../styles/globals.css";
import Layout from "../components/general/layout";
import "normalize.css/normalize.css";
import "react-notifications/lib/notifications.css";
import Loading from "../components/general/loading";
import Nav from "../components/general/nav";
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
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"/>
      <Layout>
      {!!user.loading && <Loading/>}  
      {!user.loading && user &&
          <><Nav {...pageProps} /><Component {...pageProps} /></>}</Layout>
      <NotificationContainer />
    </>
  );
}

export default MyApp;
