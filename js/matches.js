/* const API_URL = "http://localhost:3000";
const tableBody = document.getElementById("matchesTableBody");


async function loadMatches() {
  const [mRes, cRes, coRes] = await Promise.all([
    fetch(`${API_URL}/matches`),
    fetch(`${API_URL}/candidates`),
    fetch(`${API_URL}/companies`)
  ]);

  const matches = await mRes.json();
  const candidates = await cRes.json();
  const companies = await coRes.json();

  renderMatches(matches, candidates, companies);
}


function renderMatches(matches, candidates, companies) {
  tableBody.innerHTML = "";

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

  matches.forEach(match => {
    const candidate = candidates.find(c => c.id == match.candidateId);
    const company = companies.find(c => c.id == match.companyId);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${company ? company.name : match.companyId}</td>
      <td>${match.jobOfferId}</td>
      <td>
        ${candidate
          ? `${candidate.fullName} — ${candidate.title}`
          : match.candidateId}
      </td>
      <td>
        <select class="form-select form-select-sm status-select"
          data-id="${match.id}">
          <option value="pending" ${match.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="contacted" ${match.status === "contacted" ? "selected" : ""}>Contacted</option>
          <option value="interview" ${match.status === "interview" ? "selected" : ""}>Interview</option>
          <option value="hired" ${match.status === "hired" ? "selected" : ""}>Hired</option>
          <option value="discarded" ${match.status === "discarded" ? "selected" : ""}>Discarded</option>
        </select>
      </td>
      <td>
        <button class="btn btn-danger btn-sm delete-btn"
          data-id="${match.id}">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}


tableBody.addEventListener("change", async e => {
  if (!e.target.classList.contains("status-select")) return;

  const matchId = e.target.dataset.id;
  const newStatus = e.target.value;

  await fetch(`${API_URL}/matches/${matchId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });
});

tableBody.addEventListener("click", async e => {
  if (!e.target.classList.contains("delete-btn")) return;

  const matchId = e.target.dataset.id;

  await fetch(`${API_URL}/matches/${matchId}`, {
    method: "DELETE"
  });

  loadMatches();
});


loadMatches();
 */