//MF2
import { getCandidates } from "./storage.js";
import * as session from "./session.js"


document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        if (loggedUser.role !== "company") {
            window.location.replace("./pages/candidate.html")
        }
    }
    loadCandidates();
})

async function loadCandidates() {
  //MF2: getCandidates as new function
  const candidates = await getCandidates("candidates");
  localStorage.setItem("candidatesCache", JSON.stringify(candidates));

  const ul = document.getElementById("candidates");
  ul.innerHTML = "";

  candidates
    .filter((c) => c.openToWork)
    .forEach((c) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${c.name} - ${c.skills}
        <button onclick="reserveAndMatch(${c.id})" class="btn btn-sm btn-danger">
            Reservar y hacer Match
        </button>
            `;
      ul.appendChild(li);

      const btnReserve = document.createElement("button");
      const btnMatch = document.createElement("button");
      btnReserve.classList.add("btn btn-sm btn-danger");
      btnMatch.classList.add("btn btn-sm btn-success");

      li.appendChild(btnEdit);
      li.appendChild(btnDelete);
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
