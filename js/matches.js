/* const API_URL = "http://localhost:3000";
const tableBody = document.getElementById("matchesTableBody");

async function loadMatches() {
  const [mRes, cRes, coRes] = await Promise.all([
    fetch(`${API_URL}/matches`),
    fetch(`${API_URL}/candidates`),
    fetch(`${API_URL}/companies`),
  ]);

  const matches = await mRes.json(); // MATCHES
  const candidates = await cRes.json(); // CANDITADOS
  const companies = await coRes.json(); // COMPAÑIAS

  renderMatches(matches, candidates, companies);
}

function renderMatches(matches, candidates, companies) {
  tableBody.innerHTML = "";

  // TABLA VACIA SI NO HAY MATCHES
  if (matches.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          No hay matches
        </td>
      </tr>
    `;
    return;
  }

  matches.forEach((match) => {
    const candidate = candidates.find((c) => c.id == match.candidateId);
    const company = companies.find((c) => c.id == match.companyId);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${company ? company.name : match.companyId}</td>
      <td>${match.jobOfferId}</td>
      <td>
        ${
          candidate
            ? `${candidate.fullName} — ${candidate.title}`
            : match.candidateId
        }
      </td>
      <td>
        <select class="form-select form-select-sm status-select ${match.status}"
          data-id="${match.id}">
          <option value="pending" ${match.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="contacted" ${match.status === "contacted" ? "selected" : ""}>Contacted</option>
          <option value="interview" ${match.status === "interview" ? "selected" : ""}>Interview</option>
          <option value="hired" ${match.status === "hired" ? "selected" : ""}>Hired</option>
          <option value="discarded" ${match.status === "discarded" ? "selected" : ""}>Discarded</option>
        </select>
      </td>
      <td class="d-flex justify-content-center align-content-center gap-2">
        <button class="btn btn-outline-danger btn-sm delete-btn"
          data-id="${match.id}">
          Delete
        </button>
        ${
          match.status === "contacted" 
          ? 
            `<a
              class=""
              href="https://wa.me/"
              target="_blank"
            >
              <i class="fa-brands fa-whatsapp fs-1 rounded-circle whatsapp"></i>
            </a>`
          : 
            ""
        }
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// funcion para limpiar whatsapp
function normalizePhone(phone) {
  return phone.replace(/\D/g, "");
}

tableBody.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("status-select")) return;

  const matchId = e.target.dataset.id;
  const newStatus = e.target.value;

  await fetch(`${API_URL}/matches/${matchId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
});

tableBody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const matchId = e.target.dataset.id;

  await fetch(`${API_URL}/matches/${matchId}`, {
    method: "DELETE",
  });

  loadMatches();
});

loadMatches();
 */