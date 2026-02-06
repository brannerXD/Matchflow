import * as storage from "./storage.js";
import * as session from "./session.js";

// Evita que un usuario logueado vuelva al login
document.addEventListener("DOMContentLoaded", () => {
    const loggedUser = session.getSession();

    if (loggedUser) {
        if (loggedUser.role === "candidate") {
            window.location.replace("./pages/candidate.html");
        } else if (loggedUser.role === "company") {
            window.location.replace("./pages/company.html");
        }
    }
});

// Evento botón login
document.getElementById("loginButton").addEventListener("click", (e) => {
    e.preventDefault();
    login();
});

async function login() {
    const email = document.getElementById("email").value.trim();
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    // Busca usuario en json-server
    const user = await storage.verifyUser({ email });

    if (!user) {
        alert("User not found");
        return;
    }

    if (user.password !== password) {
        alert("Invalid credentials");
        passwordInput.value = "";
        return;
    }

    // Guarda sesión COMPLETA (CLAVE)
    session.saveSession({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    });

    // Redirección por rol
    if (user.role === "candidate") {
        window.location.href = "./pages/candidate.html";
    } else {
        window.location.href = "./pages/company.html";
    }
}
