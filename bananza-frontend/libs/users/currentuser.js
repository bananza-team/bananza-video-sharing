import React, { useState, useEffect } from "react";

export default function getCurrentUser() {
  let [user, setUser] = useState(null);

  useEffect(() => {
    let token = localStorage.token;
    ((token) => {
      fetch("//localhost:8000/user/current", {
        headers: {
          "Authorization": "Bearer "+token,
        },
      }).then((response) =>
        response.json().then((parsedJSON) => {
          if (response.status == 200) {
            setUser(parsedJSON);
          }
        })
      );
    })(token);
  }, []);

  return user;
}
