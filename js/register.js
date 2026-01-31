document.addEventListener('DOMContentLoaded', function() {
    const fullName = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const role = document.getElementById('role');
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpiar mensajes de error previos
        clearErrors();

        // Validaciones
        let isValid = true;

        // Validar nombre completo
        if (fullName.value.trim().length < 3) {
            showError(fullName, 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Ingresa un email válido');
            isValid = false;
        }

        // Validar contraseña
        if (password.value.length < 6) {
            showError(password, 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }

        // Validar confirmación de contraseña
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Las contraseñas no coinciden');
            isValid = false;
        }

        // Si todo es válido, guardar y redirigir
        if (isValid) {
            const userData = {
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                role: role.value,
                registeredAt: new Date().toISOString()
            };

            // Guardar en localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Mensaje de éxito
            showSuccess();
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });

    function showError(input, message) {
        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    function clearErrors() {
        const inputs = [fullName, email, password, confirmPassword];
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            const errorDiv = input.parentElement.querySelector('.invalid-feedback');
            if (errorDiv) {
                errorDiv.remove();
            }
        });
    }

    function showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = '¡Registro exitoso! Redirigiendo...';
        form.appendChild(successDiv);
    }
});
