// Ajustado para que apunte directamente a tu archivo sin la subcarpeta /services/
import { getAvailableCandidates, createMatch } from './candidateService.js';

const candidatesGrid = document.getElementById('candidates-grid');
const searchInput = document.getElementById('search-skill');
const CACHE_KEY = 'matchflow_candidates_cache';

/**
 * Main function to initialize the candidate search view
 */
export async function initSearch(query = "") {
    // 1. Try to load from Cache first ONLY if there is no active search query
    if (!query) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            renderCandidates(JSON.parse(cachedData));
        }
    }

    // 2. Fetch fresh data (filtered by skill if query exists)
    try {
        const freshCandidates = await getAvailableCandidates(query);
        
        // 3. Update Cache only for the general list
        if (!query) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(freshCandidates));
        }
        
        renderCandidates(freshCandidates);
    } catch (error) {
        console.error("Failed to sync with server:", error);
    }
}

/**
 * Renders the candidate cards into the DOM
 */
function renderCandidates(candidates) {
    candidatesGrid.innerHTML = ""; 

    if (candidates.length === 0) {
        candidatesGrid.innerHTML = "<p>No candidates found matching your criteria.</p>";
        return;
    }

    candidates.forEach(candidate => {
        const card = document.createElement('article');
        card.className = 'candidate-card';

        card.innerHTML = `
            <h3>${candidate.fullName}</h3>
            <p class="title"><strong>${candidate.title}</strong></p>
            <p class="bio">${candidate.bio}</p>
            <div class="skills-container">
                ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <button class="btn-match" data-id="${candidate.id}">
                Match with Candidate
            </button>
        `;

        const matchBtn = card.querySelector('.btn-match');
        matchBtn.addEventListener('click', () => handleMatch(candidate.id));

        candidatesGrid.appendChild(card);
    });
}

/**
 * Handles the Match action
 */
async function handleMatch(candidateId) {
    const mockCompanyId = 1; 
    const mockOfferId = 1;

    if (!confirm("Confirm match request?")) return;

    try {
        const newMatch = await createMatch(candidateId, mockCompanyId, mockOfferId);
        if (newMatch) {
            alert(`Match successful! Candidate #${candidateId} notified.`);
        }
    } catch (error) {
        alert("Error creating match. Please try again.");
    }
}

// 4. EVENT LISTENER: Search as the user types (Debounce-like behavior)
searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    initSearch(value);
});

// Start the app
initSearch();