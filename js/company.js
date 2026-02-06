//MF2
import * as storage from "./storage.js";
import * as session from "./session.js"

const companyId = session.getSession().id
const companyPlan = document.getElementById("company-plan")

document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        if (loggedUser.role !== "company") {
            window.location.replace("./pages/candidate.html")
        }
    }
    await renderProfile();
    await loadCandidates();
})

document.getElementById("logOut").addEventListener("click", session.logout)

async function loadCandidates() {
  //MF2: getCandidates as new function
  const candidates = await storage.getCandidates("candidates");
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

async function renderProfile() {
    let company = await storage.getCompanyById(companyId)
    document.getElementById("plan-badge").textContent = company.plan.toUpperCase()
    document.getElementById("company-name").value = company.name || ""
    document.getElementById("company-industry").value = company.industry || ""
    document.getElementById("company-description").value = company.description || ""
}

document.getElementById("updateCompanyProfile").addEventListener("click", updateProfile)

async function updateProfile() {
    const newData = {
        name: document.getElementById("company-name").value,
        industry: document.getElementById("company-industry").value,
        description: document.getElementById("company-description").value,
    }

    await storage.updateCompany(companyId, newData)
    await renderProfile()
}

companyPlan.addEventListener('click', () => {
  window.location.replace("./../pages/company-plans.html")
})

async function reserveAndMatch(candidateId) {
  const jobs = await getData("jobOffers");
  const companies = await getData("companies");

  const jobId = jobs[jobs.length - 1].id;
  const companyId = companies[companies.length - 1].id;

  createMatch(companyId, jobId, candidateId);
}


