import * as session from "./session.js"

document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        if (loggedUser.role !== "company") {
            window.location.replace("./pages/candidate.html")
        }
    }
})

async function loadCandidates() {
    const candidates = await getData("candidates");
    localStorage.setItem("candidatesCache", JSON.stringify(candidates));

    const ul = document.getElementById("candidates");
    ul.innerHTML = "";

    candidates
        .filter(c => c.openToWork)
        .forEach(c => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${c.name} - ${c.skill}
                <button onclick="reserveAndMatch(${c.id})" class="btn btn-sm btn-danger">
                    Reservar y hacer Match
                </button>
            `;
            ul.appendChild(li);
        });
}

async function reserveAndMatch(candidateId) {
    const jobs = await getData("jobOffers");
    const companies = await getData("companies");

    const jobId = jobs[jobs.length - 1].id;
    const companyId = companies[companies.length - 1].id;

    createMatch(companyId, jobId, candidateId);
}

document.getElementById("logOut").addEventListener("click", session.logout)
