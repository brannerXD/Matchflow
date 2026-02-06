// Obtiene el usuario logueado
import * as session from "./session.js";

const loggedUser = session.getSession();


// Si no hay sesión, vuelve al login
if (!loggedUser) {
    window.location.replace("../index.html");
}

// Referencias DOM
const btnEditar = document.getElementById("btnEditar");
const formPerfil = document.getElementById("formPerfil");
const logoutBtn = document.getElementById("logoutBtn");

const inputNombre = document.getElementById("nombre");
const inputEdad = document.getElementById("edad");
const inputCiudad = document.getElementById("ciudad");
const inputCorreo = document.getElementById("correo");
const inputDescripcion = document.getElementById("descripcion");

const seccionPerfil = document.getElementById("perfil");

// Logout
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedUser");
    window.location.replace("../index.html");
});

// Obtiene usuario desde json-server
async function obtenerUsuario() {
    const response = await fetch("http://localhost:4001/users");
    const users = await response.json();

    return users.find(user => user.email === loggedUser.email);
}

// Renderiza perfil
async function cargarPerfil() {
    const usuario = await obtenerUsuario();
    if (!usuario) return;

    seccionPerfil.innerHTML = `
        <h3>${usuario.fullName}</h3>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Rol:</strong> ${usuario.role}</p>
    `;

    inputNombre.value = usuario.fullName;
    inputCorreo.value = usuario.email;
}

// Mostrar / ocultar formulario
btnEditar.addEventListener("click", () => {
    formPerfil.classList.toggle("hidden");
});

// Guardar cambios
formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = await obtenerUsuario();
    if (!usuario) return;

    await fetch(`http://localhost:4001/users/${usuario.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: inputNombre.value,
            email: inputCorreo.value
        })
    });

    alert("Perfil actualizado");
    formPerfil.classList.add("hidden");
    cargarPerfil();
});

// Init
cargarPerfil();
