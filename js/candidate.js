import * as session from "./session.js"

document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        if (loggedUser.role !== "candidate") {
            window.location.replace("./pages/company.html")
        }
    }
})

document.getElementById("logOut").addEventListener("click", session.logout)
