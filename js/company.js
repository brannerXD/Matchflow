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

      <div class="card" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${c.name}</h5>
          <h6 class="card-subtitle mb-2">${c.title}</h6>
          <p class="card-text">${c.description}</p>
          <button href="#" class="btn btn-sm btn-reserve">Reserve</button>
          <button href="#" class="btn btn-sm btn-match">Match</button>
        </div>
      </div>`

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
