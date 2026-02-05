const API_URL = "http://localhost:4001";

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
