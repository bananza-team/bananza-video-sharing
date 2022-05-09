import "../styles/globals.css";
import Layout from "../components/general/layout";
import "normalize.css/normalize.css";
import "react-notifications/lib/notifications.css";
import React, { useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import getCurrentUser from "../libs/users/currentuser";

function MyApp({ Component, pageProps }) {
  pageProps.user = getCurrentUser();
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <NotificationContainer />
    </>
  );
}

export default MyApp;
