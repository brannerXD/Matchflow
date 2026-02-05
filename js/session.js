function saveSession(user){
    localStorage.setItem("user", JSON.stringify(user));
}

function getSession(){
    return JSON.parse(localStorage.getItem("user"));
}

function logout(){
    localStorage.removeItem("user");
    window.location.href = "../index.html";
}
