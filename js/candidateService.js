const API_URL = "http://localhost:4001";

/**
 * FEATURE: Search Candidates
 * Filters candidates who are 'openToWork' and matches a specific skill.
 */
export async function getAvailableCandidates(skillQuery = "") {
    try {
        // Business Rule: Always filter by openToWork=true
        let url = `${API_URL}/candidates?openToWork=true`;
        
        // If the user types a skill, we use JSON Server's full-text search (_q)
        if (skillQuery) {
            url += `&q=${skillQuery}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const candidates = await response.json();
        return candidates;
    } catch (error) {
        console.error("Error fetching available candidates:", error);
        return [];
    }
}

/**
 * FEATURE: Create Match
 * Links a company, an offer, and a candidate.
 * Business Rule: Initial status is always 'pending'.
 */
export async function createMatch(candidateId, companyId, offerId) {
    const newMatch = {
        candidateId: Number(candidateId), // Ensure IDs are numbers
        companyId: Number(companyId),
        offerId: Number(offerId),
        status: "pending", 
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_URL}/matches`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMatch)
        });

        if (!response.ok) throw new Error("Failed to create match");
        
        return await response.json();
    } catch (error) {
        console.error("Error creating match:", error);
        throw error;
    }
}