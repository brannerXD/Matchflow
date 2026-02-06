const API_URL = "http://localhost:4001";
const container = document.getElementById("candidates");
const searchInput = document.getElementById("searchInput");

const isLogged = true;

const currentUser = {
  role: "company",
  companyId: "4401",
  plan: "free" // ⬅️ AGREGA EL PLAN AQUÍ
};

const planLimits = {
  "Free": 1,
  "Bussines": 3,
  "Enterprise": 6,
}

const currentJobOfferId = "e829";

let candidates = [];
let reservations = [];

async function loadData() {
  try {
    const [cRes, rRes] = await Promise.all([
      fetch(`${API_URL}/candidates`),
      fetch(`${API_URL}/reservations`)
    ]);

    candidates = await cRes.json();
    reservations = await rRes.json();

    renderCandidates(searchCandidates(""));
    
    // ⬅️ AGREGA ESTO: actualiza también la tabla de reservas
    if (window.loadReservedCandidates) {
      window.loadReservedCandidates();
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function isCandidateReserved(candidateId) {
  return reservations.some(
    r => r.active && r.candidateId === candidateId // ⬅️ CAMBIADO: usa "active" en lugar de "status"
  );
}

function canSeeCandidate(candidate) {
  if (!isLogged) return false;
  if (currentUser.role !== "company") return false;
  if (!candidate.openToWork) return false;
  if (isCandidateReserved(candidate.id)) return false;
  return true;
}

function searchCandidates(text) {
  const query = text.toLowerCase().trim();

  return candidates
    .filter(canSeeCandidate)
    .filter(c => {
      const name = c.name || "";
      const title = c.title || "";
      const skills = Array.isArray(c.skills) ? c.skills : [];

      return (
        name.toLowerCase().includes(query) ||
        title.toLowerCase().includes(query) ||
        skills.some(skill =>
          skill.toLowerCase().includes(query)
        )
      );
    });
}

// ⬅️ FUNCIÓN ACTUALIZADA: ahora con límites de plan
async function reserveCandidate(candidateId) {
  try {
    if (isCandidateReserved(candidateId)) {
      alert("Este candidato ya está reservado");
      return;
    }

    // Verificar límite del plan
    const resp = await fetch(`${API_URL}/reservations`);
    const allReservations = await resp.json();

    const activeReservationsCount = allReservations.filter(r => 
      r.active && r.companyId === currentUser.companyId
    ).length;

    const userLimit = planLimits[currentUser.plan] || 0;

    if (activeReservationsCount >= userLimit) {
      alert(`Límite excedido: Tu plan ${currentUser.plan} solo permite ${userLimit} reserva(s) activa(s).`);
      return;
    }

    // Crear reserva
    const reservation = {
      candidateId,
      companyId: currentUser.companyId,
      jobOfferId: currentJobOfferId,
      active: true, // ⬅️ USA "active" en lugar de "status"
      date: new Date().toISOString()
    };

    await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation)
    });

    alert('Candidato reservado con éxito');
    loadData(); // ⬅️ Recarga todo
  } catch (error) {
    console.error("Error al reservar:", error);
    alert("Error al reservar el candidato");
  }
}

async function createMatch(candidateId) {
  const match = {
    companyId: currentUser.companyId,
    jobOfferId: currentJobOfferId,
    candidateId: candidateId,
    status: "pending"
  };

  await fetch(`${API_URL}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });
  
  alert("Match creado con éxito");
}

async function releaseReservation(candidateId) {
  const reservation = reservations.find(
    r =>
      r.active && // ⬅️ CAMBIADO
      r.candidateId === candidateId &&
      r.companyId === currentUser.companyId
  );

  if (!reservation) return;

  await fetch(`${API_URL}/reservations/${reservation.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active: false }) // ⬅️ CAMBIADO
  });

  loadData();
}

function renderCandidates(list) {
  container.innerHTML = "";

  if (!isLogged) {
    container.innerHTML = "<p>Debes iniciar sesión</p>";
    return;
  }

  if (currentUser.role !== "company") {
    container.innerHTML = "<p>Solo las empresas pueden ver candidatos</p>";
    return;
  }

  if (list.length === 0) {
    container.innerHTML = "<p>No hay candidatos disponibles</p>";
    return;
  }

  list.forEach(c => {
    const card = document.createElement("div");
    card.className = "card-body";

    card.innerHTML = `
      <li>
        <div class="card" style="width: 100%;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">${c.name}</h5>
              <span class="badge bg-success">Available</span>
            </div>
            <h6 class="card-subtitle mb-2">${c.title}</h6>
            <p class="card-text">${c.skills.join(", ")}</p>

            <button class="btn btn-sm btn-reserve" data-candidate-id="${c.id}">
              Reserve
            </button>

            <button class="btn btn-sm btn-match" data-candidate-id="${c.id}">
              Match
            </button>
          </div>
        </div>
      </li>
    `;


    card.querySelector(".btn-reserve").addEventListener("click", () => {
      reserveCandidate(c.id);
    });

    card.querySelector(".btn-match").addEventListener("click", () => {
      createMatch(c.id);
    });

    container.appendChild(card);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", e => {
    renderCandidates(searchCandidates(e.target.value));
  });
}

loadData();