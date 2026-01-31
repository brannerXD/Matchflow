// login.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const fullName = document.getElementById('username');
    const email = document.getElementById('email');
    const role = document.getElementById('role');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpiar mensajes de error previos
        clearErrors();

        let isValid = true;

        // Validar campos vacíos
        if (fullName.value.trim() === '') {
            showError(fullName, 'Ingresa tu nombre completo');
            isValid = false;
        }

        if (email.value.trim() === '') {
            showError(email, 'Ingresa tu email');
            isValid = false;
        }

        if (!isValid) return;

        // Obtener usuario registrado del localStorage
        const storedUser = localStorage.getItem('currentUser');

        if (!storedUser) {
            showGeneralError('No hay una cuenta registrada. Por favor regístrate primero.');
            return;
        }

        const userData = JSON.parse(storedUser);

        // Verificar credenciales
        if (email.value.trim() === userData.email && 
            fullName.value.trim() === userData.fullName &&
            role.value === userData.role) {
            
            // Login exitoso
            showSuccess();
            
            // Actualizar último login
            userData.lastLogin = new Date().toISOString();
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 1000);
        } else {
            // Credenciales incorrectas
            showGeneralError('Credenciales incorrectas. Verifica tu nombre, email y rol.');
        }
    });

    function showError(input, message) {
        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    function showGeneralError(message) {
        // Remover error previo si existe
        const existingError = form.querySelector('.alert-danger');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    }

    function clearErrors() {
        const inputs = [fullName, email, role];
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            const errorDiv = input.parentElement.querySelector('.invalid-feedback');
            if (errorDiv) {
                errorDiv.remove();
            }
        });

        // Remover alertas generales
        const alerts = form.querySelectorAll('.alert');
        alerts.forEach(alert => alert.remove());
    }

    function showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = '¡Login exitoso! Bienvenido...';
        form.appendChild(successDiv);
    }
});