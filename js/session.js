export function saveSession(user){
    sessionStorage.setItem("user", JSON.stringify(user));
}

export function getSession(){
    return JSON.parse(sessionStorage.getItem("user"));
}

export function logout(){
    sessionStorage.removeItem("user");
    window.location.href = "../index.html";
}
