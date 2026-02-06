import * as session from "./session.js"
import * as storage from "./storage.js"

document.addEventListener("DOMContentLoaded", async () => {
    let loggedUser = session.getSession()
    if (loggedUser) {
        if (loggedUser.role !== "candidate") {
            window.location.replace("./pages/company.html")
        }
    } else {
        window.location.replace("./index.html")
    }

    const planSection = document.querySelector(".panel");
    planSection.addEventListener("click", async (event) => {
        const newPlan = event.target.closest(".plan-card").dataset.id;
        await changePlan(newPlan);
    });

});

const candidateId = session.getSession().id;

async function changePlan(newPlan) {
  await storage.updateCandidatePlan(candidateId, { plan: newPlan });
  window.location.replace("./../pages/candidate.html");
  await renderProfile();
}