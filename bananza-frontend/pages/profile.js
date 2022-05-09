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
}
