import * as storage from "./storage.js";
import * as session from "./session.js"

// Protect the route so no logged user can go to log in again
document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        window.location.replace("../index.html")
    }
})

document.getElementById("loginButton").addEventListener("click", async (e) => {
    e.preventDefault()
    await login()
})

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!email || !password){
        alert("Please fill all fields");
        return;
    }

    const user = await storage.verifyUser({email: email})

    if (user.password !== password) {
        alert("Invalid credentials")
        password.value = ""
        return;
    }

    session.saveSession({
        id: user.id,
        fullName: user.fullName,
        role: user.role
    });

    if(user.role === "candidate"){
        window.location.replace("./pages/candidate.html")
    } else {
        window.location.replace("./pages/company.html")
    }
}
