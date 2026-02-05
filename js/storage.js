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
