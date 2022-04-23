import PageHead from "/components/general/pageHead.js"
import "../styles/Home.module.css"
import Image from 'next/image'
export default function Home() {
  return (
    <>
    <PageHead pageTitle="Bananza - Homepage"></PageHead>
    <div className="big-logo"><img src="/logo.png"/></div>
      <div className="guest-options">
        <span className="guest-login">Login</span>
        <span className="guest-register">Register</span>
      </div>
    </>
  )
}