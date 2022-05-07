import '../styles/globals.css'
import Layout from '../components/general/layout'
import 'normalize.css/normalize.css'
import 'react-notifications/lib/notifications.css'
import React from 'react'
import {NotificationContainer, NotificationManager} from 'react-notifications'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Layout><Component {...pageProps}/></Layout>
    <NotificationContainer/>
    </>
  )
}

export default MyApp
