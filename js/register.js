async function register() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if(!email || !password){
        alert("Please fill all fields");
        return;
    }

    const exists = await apiGet("/users?email=" + email);
    if(exists.length > 0){
        alert("User already exists");
        return;
    }

    await apiPost("/users", {
        email,
        password,
        role,
        openToWork: false,
        name: "",
        skill: ""
    });

    alert("User registered successfully");
    window.location.href = "../index.html";
}
