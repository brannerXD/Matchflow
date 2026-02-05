import * as storage from "./storage.js"
import * as session from "./session";

document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        window.location.replace("../index.html")
    }
})

document.getElementById("sendRegister").addEventListener("click", async (e) => {
    e.preventDefault()
    await register()
})

async function register() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const fullName = document.getElementById("fullName").value;

    if(!email || !password){
        alert("Please fill all fields");
        return;
    }

    const exists = await storage.verifyUser({email: email});
    if(exists){
        alert("User already exists");
        return;
    }

    await storage.saveUser({
        fullName,
        email,
        password,
        role,
        openToWork: false,
        plan: "free"
    })

    alert("User registered successfully");
    window.location.href = "./../index.html";
}
