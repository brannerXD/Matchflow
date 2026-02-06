const API_URL = "http://localhost:3000";

// Mock sesión
const isLogged = true;
const currentUser = {
  role: "company",
  companyId: "4401",
  plan: "Free"
};
// PLAN AND RESERVATIONS
const planLimits = {
  "Free" : 1,
  "Bussines": 3,
  "Enterprise" : 6,
}

let candidates = [];
let reservations = [];


const container = document.querySelector(".candidates-grid");

async function reserveNewCandidates(candidateId) {
  try {
    // Endpoint
    const resp = await fetch(`${API_URL}/reservations`);
    const allReservations = await resp.json();

    // Count reservations 
    const activeReservationsCount = allReservations.filter(r => 
      r.active && r.companyId === currentUser.companyId
    ).length;

    // reservations Limit 
    const userLimit = planLimits[currentUser.plan] || 0;

    if (activeReservationsCount >= userLimit) {
      alert(`Límite excedido: Tu plan ${currentUser.plan} solo permite ${userLimit} reserva(s) activa(s).`);
      return;
    }

    const newReservation = {
      companyId: currentUser.companyId,
      candidateId: candidateId,
      active: true,
      date: new Date().toISOString()
    };

    await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReservation)
    });

    alert('Candidato Reservado con exito');
    loadReservedCandidates();
  } catch (error) {
    console.error("Error al procesar la reserva:", error)
  }
}



async function loadReservedCandidates() {
  try {
    const [cRes, rRes] = await Promise.all([
      fetch(`${API_URL}/candidates`),
      fetch(`${API_URL}/reservations`)
    ]);

    candidates = await cRes.json();
    reservations = await rRes.json();

    renderReservedCandidates();
  } catch (error) {
    console.error(error);
  }
}

function getReservedCandidates() {
  const myReservations = reservations.filter(
    r =>
      r.active &&
      r.companyId === currentUser.companyId
  );

  return candidates.filter(c =>
    myReservations.some(r => r.candidateId === c.id)
  );
}


async function releaseReservation(candidateId) {
  const reservation = reservations.find(
    r =>
      r.active &&
      r.candidateId === candidateId &&
      r.companyId === currentUser.companyId
  );

  if (!reservation) return;

  await fetch(`${API_URL}/reservations/${reservation.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active: false })
  });

  loadReservedCandidates();
}


function renderReservedCandidates() {
  container.innerHTML = "";

  if (!isLogged || currentUser.role !== "company") {
    container.innerHTML = "<p>No autorizado</p>";
    return;
  }


  const reservedList = getReservedCandidates();
  

  const myReservedIds = reservations
    .filter(r => r.active && r.companyId === currentUser.companyId)
    .map(r => r.candidateId);


  candidates.forEach(c => {
    const isAlreadyReservedByMe = myReservedIds.includes(c.id);
    
    const card = document.createElement("div");
    card.className = "candidate-card";

    card.innerHTML = `
      <h3>${c.name}</h3>
      <p>${c.title}</p>
      <p>${c.skills.join(", ")}</p>

      ${isAlreadyReservedByMe 
        ? `<button class="btn btn-secondary" onclick="releaseReservation('${c.id}')">Liberar</button>`
        : `<button class="btn btn-primary" onclick="reserveNewCandidates('${c.id}')">Reservar</button>`
      }
    `;

    container.appendChild(card);
  });
}


window.reserveNewCandidates = reserveNewCandidates;
window.releaseReservation = releaseReservation;

document.addEventListener("DOMContentLoaded", loadReservedCandidates);