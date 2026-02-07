//MF2
import * as storage from "./storage.js";
import * as session from "./session.js";

const candidateLimitsReservations = {
  free:1,
  pro1:2,
  pro2:5
}

const companyId = session.getSession().id;
const companyPlan = document.getElementById("company-plan");
const jobOfferForm = document.getElementById("add-job-offer");
const offers = document.getElementById("job-offers");
let currentEditId = null;
const modal = document.getElementById("editOfferModal");

document.addEventListener("DOMContentLoaded", async () => {
  let loggedUser = session.getSession();
  if (loggedUser) {
    if (loggedUser.role !== "company") {
      window.location.replace("/pages/candidate.html");
    }
  } else {
    window.location.replace("/index.html");
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
  const candidates = await storage.getCandidates("candidates");
  const reservations = await storage.getReservations();
  const company = await storage.getCompanyById(companyId);

  const ul = document.getElementById("candidates");
  ul.innerHTML = "";

  candidates
    .filter(c => c.openToWork)
    .forEach(candidate => {

      const visibility = getCandidateVisibility(
        company,
        candidate,
        reservations
      );

      const badge = getCandidateBadge(
        candidate,
        reservations,
        visibility
      );

      if (!visibility.visible) return;

      const li = document.createElement("li");

      li.innerHTML = `
        <div class="card" style="width: 100%;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">${candidate.name}</h5>
              ${badge}
            </div>
            <h6 class="card-subtitle mb-2">${candidate.title}</h6>
            <p class="card-text">${candidate.description}</p>

            <button 
              class="btn btn-sm btn-reserve" onclick="reserveCandidate('${candidate.id}')"
              ${!visibility.reservable ? "disabled" : ""}
              data-candidate-id="${candidate.id}"
            >
              ${visibility.reservable ? "Reserve" : "Not available"}
            </button>

            <button class="btn btn-sm btn-match" onclick="createMatch('${candidate.id}')">Match</button>
          </div>
        </div>
      `;

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
  const jobOffers = await storage.getOfferseByCompanyId(companyId);
  
  const ul = document.getElementById("job-offers");
  ul.innerHTML = "";

  jobOffers.forEach((offer) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <div data-id=${offer.id} class="card" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${offer.title}</h5>
          <p class="card-text">${offer.description}</p>
          <button href="#" class="btn btn-sm btn-match">${offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}</button>
          <button href="#" class="edit-btn btn btn-sm btn-reserve">Edit Offer</button>
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
})

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

offers?.addEventListener("click", (event) => {
  const oldOffer = event.target.closest(".card");
  const oldOfferId = oldOffer.dataset.id;
  if (event.target.matches(".edit-btn")) {
    editJobOffer(oldOffer, oldOfferId);
  }
})

function editJobOffer(jobOffer, offerId) {
  modal.style.display = "block";
  currentEditId = offerId;

  const editTitle = document.getElementById("edit-title");
  const editDescription = document.getElementById("edit-description");
  const editStatus = document.getElementById("edit-status");
  const oldTitle = jobOffer.querySelector(".card-title").innerHTML;
  const oldDescription = jobOffer.querySelector(".card-text").innerHTML.trim();
  const oldStatus = jobOffer.querySelector(".btn-match").innerHTML;
  editTitle.value = oldTitle;
  editDescription.value = oldDescription;
  editStatus.value = oldStatus.toLowerCase();

  const span = document.getElementsByClassName("close")[0];
  span.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

function getActiveReservations(candidateId, reservations) {
  return reservations.filter(
    reserve => reserve.candidateId === candidateId && reserve.status === "active"
  ).length;
}

function canCandidateBeReserved(candidate, reservations) {
  const limit = candidateLimitsReservations[candidate.plan];
  const active = getActiveReservations(candidate.id, reservations);
  return active < limit;
}

function canCompanySeeCandidate(company, candidate, reservations) {
  const isReserved = getActiveReservations(candidate.id, reservations) > 0;

  if (company.plan === "enterprise") return true;

  if (company.plan === "business") {
    return !isReserved;
  }

  // free
  return !isReserved;
}

function getCandidateVisibility(company, candidate, reservations) {
  const visible = canCompanySeeCandidate(company, candidate, reservations);

  if (!visible) {
    return { visible: false };
  }

  const reservable = canCandidateBeReserved(candidate, reservations);

  return {
    visible: true,
    reservable
  };
}

function getCandidateBadge(candidate, reservations, visibility) {
  const activeReservations = getActiveReservations(
    candidate.id,
    reservations
  );

  if (!visibility.reservable && activeReservations > 0) {
    return `<span class="badge bg-unavailable">Max limit reached</span>`;
  }

  if (activeReservations > 0) {
    return `<span class="badge bg-reserved">Reserved</span>`;
  }

  return `<span class="badge bg-available">Available</span>`;
}

const form = document.getElementById("edit-form");
form?.addEventListener("submit", (event) => {
  
  event.preventDefault();
  const editedOffer = new FormData(form);
  saveEditedOffer(editedOffer, currentEditId);
  modal.style.display = "none";
});

async function saveEditedOffer(inputEdit, id) {
  const jobOffers = await storage.getOfferseByCompanyId(companyId);
  const offer = jobOffers.find((offer) => offer.id === id);

  for (const [key, value] of inputEdit) {
    offer[key] = value;
  }

  await storage.updateJobOffer(id, offer);
}

const cancelBtn = document.getElementById("cancel-edit-btn");
const deleteBtn = document.getElementById("delete-offer-btn");

cancelBtn?.addEventListener("click", (event) =>{
  event.preventDefault();

  if (window.confirm("Discard changes?")) {
    modal.style.display = "none";
}
})

deleteBtn?.addEventListener("click", async (event) =>{
  event.preventDefault();
  if (window.confirm("Do you want to delete this offer?")) {
    await storage.deleteOffer(currentEditId)
    modal.style.display = "none";
}
})

