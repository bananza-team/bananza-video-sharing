import Link from "next/link"
import PageHead from "/components/general/pageHead";

let divStyles = {
    position:"absolute",
    top:"0px",
    left:"0px",
    width:"100%",
    height:"100%",
    background:"black",
    color:"red",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column",
    fontSize:"40px"
}

let aStyles = {
    fontSize:"18px",
    color:"white"
}

export default function Suspend(){
    return (
        <>
        <PageHead pageTitle="Suspended"/>
        <div style={divStyles}>
            <span>
                Your account has been permanently suspended
            </span>
            <span>
                <Link href="/">
                    <a style={aStyles}>All you can do now is stare at the homepage :)</a>
                </Link>
            </span>
        </div>
        </>
    )
}