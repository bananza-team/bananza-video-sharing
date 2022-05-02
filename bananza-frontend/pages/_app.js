import '../styles/globals.css'
import Layout from '../components/general/layout'
import 'normalize.css/normalize.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout><Component {...pageProps}/></Layout>
  )
}

export default MyApp
