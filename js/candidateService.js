const API_URL = "http://localhost:3000";

export async function getAvailableCandidates(skillQuery = "") {
  try {
    let url = `${API_URL}/candidates?openToWork=true`;

    if (skillQuery) {
      url += `&q=${encodeURIComponent(skillQuery)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
  } catch (error) {
    console.error("Error fetching available candidates:", error);
    return [];
  }
}

export async function createMatch(candidateId, companyId, offerId) {
  const newMatch = {
    candidateId: Number(candidateId),
    companyId: Number(companyId),
    offerId: Number(offerId),
    status: "pending",
    createdAt: new Date().toISOString()
  };

  const response = await fetch(`${API_URL}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMatch)
  });

  if (!response.ok) {
    throw new Error("Failed to create match");
  }

  return await response.json();
}
