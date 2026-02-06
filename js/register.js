import * as storage from "./storage.js"
import * as session from "./session.js";

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
    const name = document.getElementById("fullName").value;

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
        name,
        email,
        password,
        role,
    })

    let candidate = await storage.verifyUser(email)
    await storage.saveCandidate({
        id: candidate.id,
        name,
        title: "",
        email,
        description: "",
        skills: [],
        plan: "free",
        openToWork: true,
        phone: ""
    })

    alert("User registered successfully");
    if (role === "candidate") {
        window.location.replace("../pages/candidate.html")
    } else {
        window.location.replace("../pages/company.html")
    }
}
