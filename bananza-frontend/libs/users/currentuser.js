import React, { useState, useEffect } from "react";
import {useRouter} from "next/router";

export default function getCurrentUser() {
  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(1);

  useEffect(() => {
    let token = localStorage.token;
    ((token) => {
      fetch("//localhost:8000/user/current", {
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) =>
        response.json().then((parsedJSON) => {
          if (response.status == 200) {
            setUser(parsedJSON);
          }
          setLoading(0);
        })
      );
    })(token);
  }, [useRouter().asPath]);

  return {
    user: user,
    loading: loading,
  };
}
