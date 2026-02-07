import { API_URL } from "./api.js";

const isLogged = true;
const currentUser = {
  role: "company",
  companyId: "4401",
  plan: "Free"
};

let candidates = [];
let reservations = [];

const container = document.getElementById("reservationsTableBody");

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
    r => r.active && r.companyId === currentUser.companyId
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
  if (!container) return;
  
  container.innerHTML = "";

  if (!isLogged || currentUser.role !== "company") {
    container.innerHTML = `<tr><td colspan="4">No autorizado</td></tr>`;
    return;
  }

  const reservedList = getReservedCandidates();

  if (reservedList.length === 0) {
    container.innerHTML = `<tr><td colspan="4">No tienes reservas activas</td></tr>`;
    return;
  }

  reservedList.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.title}</td>
      <td>${c.skills.join(", ")}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" data-id="${c.id}">
          Liberar
        </button>
      </td>
    `;

    tr.querySelector("button").addEventListener("click", () =>
      releaseReservation(c.id)
    );

    container.appendChild(tr);
  });
}

// ⬅️ EXPONER LA FUNCIÓN GLOBALMENTE
window.loadReservedCandidates = loadReservedCandidates;

document.addEventListener("DOMContentLoaded", loadReservedCandidates);