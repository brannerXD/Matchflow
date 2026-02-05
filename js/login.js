async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!email || !password){
        alert("Please fill all fields");
        return;
    }

    const users = await apiGet(`/users?email=${email}&password=${password}`);

    if(users.length === 0){
        alert("Invalid credentials");
        return;
    }

    saveSession(users[0]);

    if(users[0].role === "candidate"){
        window.location.href = "pages/candidate.html";
    } else {
        window.location.href = "pages/company.html";
    }
}
