//MF2
import * as storage from "./storage.js";
import * as session from "./session.js";

const companyId = session.getSession().id;
const companyPlan = document.getElementById("company-plan");
const jobOfferForm = document.getElementById("add-job-offer");

document.addEventListener("DOMContentLoaded", async () => {
  let loggedUser = session.getSession();
  if (loggedUser) {
    if (loggedUser.role !== "company") {
      window.location.replace("./pages/candidate.html");
    }
  }

  if (window.location.pathname === "/pages/company.html") {
    await renderProfile();
    await loadCandidates();
    await renderOffers();

  } else if (window.location.pathname === "/pages/company-plans.html") {
    const planSection = document.querySelector(".panel");
    planSection.addEventListener("click", async (event) => {
      const newPlan = event.target.closest(".plan-card").dataset.id;
      await changePlan(newPlan);
    });
  }
});

document.getElementById("logOut")?.addEventListener("click", session.logout);

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
      </div>`;

      ul.appendChild(li);
    });
}

async function renderProfile() {
  let company = await storage.getCompanyById(companyId);
  document.getElementById("plan-badge").textContent = company.plan.toUpperCase();
  document.getElementById("company-name").value = company.name || "";
  document.getElementById("company-industry").value = company.industry || "";
  document.getElementById("company-description").value = company.description || "";
}

async function renderOffers() {
  let jobOffers = await storage.getOfferseByCompanyId(companyId);
  console.log(jobOffers)

  const ul = document.getElementById("job-offers");
  ul.innerHTML = "";

  jobOffers.forEach((offer) => {
      const li = document.createElement("li");
      li.innerHTML = `

      <div class="card" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${offer.title}</h5>
          <p class="card-text">${offer.description}</p>
          <button href="#" class="btn btn-sm btn-reserve">${offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}</button>
          <button href="#" class="btn btn-sm btn-match">Edit Offer</button>
        </div>
      </div>`;

      ul.appendChild(li);
    });
}

document.getElementById("updateCompanyProfile")?.addEventListener("click", updateProfile);

async function updateProfile() {
  const newData = {
    name: document.getElementById("company-name").value,
    industry: document.getElementById("company-industry").value,
    description: document.getElementById("company-description").value,
  };

  await storage.updateCompany(companyId, newData);
  await renderProfile();
}

companyPlan?.addEventListener("click", () => {
  window.location.replace("./../pages/company-plans.html");
});

async function changePlan(newPlan) {
  await storage.updateCompanyPlan(companyId, { plan: newPlan });
  window.location.replace("./../pages/company.html");
  await renderProfile();
}

jobOfferForm?.addEventListener('submit', (event) =>{
  event.preventDefault();
  newJobOffer()
}
)

async function newJobOffer() {
  const jobData = {
    title: document.getElementById("job-title").value,
    description: document.getElementById("job-description").value,
    status:'open',
    companyId
  };

  await storage.saveJobOffer(jobData);
  await renderOffers();
}
