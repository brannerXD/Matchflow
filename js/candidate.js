import * as session from "./session.js"
import * as storage from "./storage.js"
import {updateState} from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        if (loggedUser.role !== "candidate") {
            window.location.replace("./pages/company.html")
        }
    }
    await renderProfile()
})

document.getElementById("logOut").addEventListener("click", session.logout)

// async function render profile
async function renderProfile() {
    let user = await storage.getCandidateById(session.getSession().id)
    document.getElementById("planButton").textContent = user.plan.toUpperCase()
    let openToWork = document.getElementById("openToWork")
    if (user.openToWork) {
        openToWork.checked = true;
    }
    document.getElementById("name").value = user.name || ""
    document.getElementById("title").value = user.title || ""
    document.getElementById("phone").value = user.phone || ""
    document.getElementById("description").value = user.description || ""
    console.log(user.skills)
    if (user.skills) {
        for (let i = 0; i < user.skills.length; i++) {
            console.log(user.skills[i])
            let box = document.getElementById(`${user.skills[i]}`)
            box.checked = true
        }
    }
}

document.getElementById("updateProfile").addEventListener("click", updateProfile)

async function updateProfile() {
    let id = session.getSession().id

    const checkboxes = document.querySelectorAll('.checkboxes > input[type="checkbox"]:checked');
    let skills = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            skills.push(checkbox.value);
        }
    });

    let newData = {
        name: document.getElementById("name").value,
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        skills,
        phone: document.getElementById("phone").value
    }

    await storage.updateCandidate(id, newData)
    await renderProfile()
}

document.getElementById("openToWork").addEventListener("click", changeState)

async function changeState() {
    let userId = session.getSession().id
    let checkbox = document.getElementById("openToWork")
    if (checkbox.checked) {
        await updateState(userId, {openToWork: true})
    } else {
        await updateState(userId, {openToWork: false})
    }
    await renderProfile()
}

document.getElementById("planButton").addEventListener("click", () => {
    window.location.href = "./candidate-plans.html"
})
