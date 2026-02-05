
const API = "http://localhost:4001";

//MF2
export async function getCandidates() {
  try {
    const response = await fetch(`${API}/candidates`);

    if (!response.ok) {
      throw new Error("Error fetching candidates");
    }

    return response.json();
  } catch (error) {
    console.error("getCandidates failed:", error);
    throw error; 
  }
}