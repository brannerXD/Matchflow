//MF2
import { getCandidates } from "./storage.js";

//MF2
document.addEventListener("DOMContentLoaded", async () =>{
    loadCandidates();
})



async function loadCandidates() {
    //MF2: getCandidates as new function
    const candidates = await getCandidates("candidates");
    localStorage.setItem("candidatesCache", JSON.stringify(candidates));

    const ul = document.getElementById("candidates");
    ul.innerHTML = "";

    candidates
        .filter(c => c.openToWork)
        .forEach(c => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${c.name} - ${c.skills}
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
