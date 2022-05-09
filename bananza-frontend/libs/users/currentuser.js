export default function getCurrentUser(){
    let token = localStorage.token;
    if(token == undefined){
        return undefined;
    } else {
        fetch("//localhost:8000/user/current", {
            header:{
                'Authorization':`Bearer ${token}`
            }
        }).then(response => response.json().then(parsedJSON =>{
            if(response.status == 200){
                return parsedJSON;
            } else {
                delete localStorage.token;
                return undefined;
            }
        }))
    }
}