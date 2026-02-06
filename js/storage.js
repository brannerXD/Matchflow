const API_URL = "http://localhost:4001";

//MF2
export async function getCandidates() {
  try {
    const response = await fetch(`${API_URL}/candidates`);

    if (!response.ok) {
      throw new Error("Error fetching candidates");
    }

    return response.json();
  } catch (error) {
    console.error("getCandidates failed:", error);
    throw error; 
  }
}


export async function saveUser(user) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const responseData = await response.json();
        console.log('Success:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function saveCandidate(candidate) {
    try {
        const response = await fetch(`${API_URL}/candidates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(candidate)
        });

        const responseData = await response.json();
        console.log('Success:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function saveCompany(company) {
    try {
        const response = await fetch(`${API_URL}/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(company)
        });

        const responseData = await response.json();
        console.log('Success:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function verifyUser(user) {
    try {
        const response = await fetch(`${API_URL}/users`); // Await the response
        const data = await response.json(); // Await the JSON parsing
        console.log(data);

        for (let i = 0; i < data.length; i++) {
            if (data[i].email === user.email) {
                console.log("aqui lo encuentra")
                console.log(data[i])
                return data[i]
            }
        }
        console.log("not found")
        return false
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export async function getUserById(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`); // Await the response
        const data = await response.json(); // Await the JSON parsing
        console.log(data);

        console.log("not found")
        return data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export async function getCandidateById(userId) {
    try {
        const response = await fetch(`${API_URL}/candidates/${userId}`); // Await the response
        const data = await response.json(); // Await the JSON parsing
        console.log(data);

        console.log("not found")
        return data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export async function updateCandidate(userId, newData) {
    try {
        const respuesta = await fetch(`${API_URL}/candidates/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });

        const json = await respuesta.json();
        console.log('Usuario actualizado:', json);
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function updateState(userId, newState) {
    try {
        const respuesta = await fetch(`${API_URL}/candidates/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newState)
        });

        const json = await respuesta.json();
        console.log('Usuario actualizado:', json);
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getCompanyById(companyId) {
    try {
        const response = await fetch(`${API_URL}/companies/${companyId}`); // Await the response
        const data = await response.json(); // Await the JSON parsing

        return data
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export async function updateCompany(companyId, newData) {
    try {
        const respuesta = await fetch(`${API_URL}/companies/${companyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });

        const json = await respuesta.json();
        console.log('Company info updated:', json);
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function updateCompanyPlan(companyId, newPlan) {
    try {
        const respuesta = await fetch(`${API_URL}/companies/${companyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlan)
        });

        const json = await respuesta.json();
        console.log('Company plan updated:', json);
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getReservations() {
  try {
    const response = await fetch(`${API_URL}/reservations`);

    if (!response.ok) {
      throw new Error("Error fetching reservations");
    }

    return response.json();
  } catch (error) {
    console.error("getReservations failed:", error);
    throw error; 
  }
}

export async function getOfferseByCompanyId(companyId) {
    try {
        const response = await fetch(`${API_URL}/jobs`); // Await the response
        const data = await response.json(); // Await the JSON parsing
        
        return data.filter(offer => offer.companyId === companyId)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export async function saveJobOffer(jobOffer) {
    try {
        const response = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobOffer)
        });

        const responseData = await response.json();
        console.log('Success:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error:', error);
    }
}
