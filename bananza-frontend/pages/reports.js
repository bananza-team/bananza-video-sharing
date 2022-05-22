import {useRouter} from "next/router"
export default function Reports(props){
    if(props.user == null || props.user.type == "creator"){
        useRouter().push("/");
    }
}