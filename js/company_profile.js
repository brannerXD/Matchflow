// Configuración
const API_URL = 'http://localhost:3000/offers'; // URL de tu json-server
const COMPANY_ID = 'microsoft'; // ID de la empresa actual (puedes hacerlo dinámico)

// Elementos del DOM
const jobForm = document.getElementById('job-form');
const jobTitle = document.getElementById('jobTitle');
const jobDescription = document.getElementById('jobDescription');
const worksList = document.getElementById('works-list');
const worksCount = document.getElementById('works-count');
const logoutBtn = document.getElementById('logoutBtn');

// Estado de la aplicación
let companyJobs = [];

/**
 * Inicializa la aplicación
 */
async function init() {
    await loadJobs();
    setupEventListeners();
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Evento de envío del formulario
    jobForm.addEventListener('submit', handleJobSubmit);
    
    // Evento de logout (opcional)
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            // Aquí puedes agregar la lógica de logout
            window.location.href = '/login.html';
        }
    });
}

/**
 * Maneja el envío del formulario
 */
async function handleJobSubmit(e) {
    e.preventDefault();
    
    const title = jobTitle.value.trim();
    const description = jobDescription.value.trim();
    
    if (!title || !description) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Crear objeto de trabajo
    const newJob = {
        title: title,
        description: description,
        companyId: COMPANY_ID,
        companyName: document.getElementById('company-name').textContent,
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Enviar al servidor
    await createJob(newJob);
    
    // Limpiar formulario
    jobForm.reset();
    
    // Scroll a la sección de trabajos
    worksList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Carga los trabajos del servidor
 */
async function loadJobs() {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}?companyId=${COMPANY_ID}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar los trabajos');
        }
        
        companyJobs = await response.json();
        renderJobs();
        updateWorksCount();
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudieron cargar los trabajos. Asegúrate de que json-server esté corriendo.');
    }
}

/**
 * Crea un nuevo trabajo en el servidor
 */
async function createJob(job) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(job)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear el trabajo');
        }
        
        const createdJob = await response.json();
        companyJobs.unshift(createdJob); // Agregar al inicio del array
        renderJobs();
        updateWorksCount();
        
        // Mostrar mensaje de éxito
        showSuccessMessage('¡Trabajo publicado exitosamente!');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al publicar el trabajo. Asegúrate de que json-server esté corriendo.');
    }
}

/**
 * Elimina un trabajo
 */
async function deleteJob(jobId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este trabajo?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${jobId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar el trabajo');
        }
        
        companyJobs = companyJobs.filter(job => job.id !== jobId);
        renderJobs();
        updateWorksCount();
        
        showSuccessMessage('Trabajo eliminado exitosamente');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el trabajo');
    }
}

/**
 * Renderiza la lista de trabajos
 */
function renderJobs() {
    worksList.innerHTML = '';
    
    if (companyJobs.length === 0) {
        worksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p class="empty-state-text">No hay trabajos publicados aún. ¡Publica el primero!</p>
            </div>
        `;
        return;
    }
    
    companyJobs.forEach(job => {
        const jobCard = createJobCard(job);
        worksList.appendChild(jobCard);
    });
}

/**
 * Crea un elemento de tarjeta de trabajo
 */
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.setAttribute('data-job-id', job.id);
    
    const formattedDate = formatDate(job.createdAt);
    
    card.innerHTML = `
        <div class="work-header">
            <h4 class="work-title">${escapeHtml(job.title)}</h4>
            <span class="work-date">${formattedDate}</span>
        </div>
        <p class="work-description">${escapeHtml(job.description)}</p>
        <div class="work-actions">
            <button class="btn btn-danger btn-sm delete-btn" data-job-id="${job.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
                Eliminar
            </button>
        </div>
    `;
    
    // Agregar event listener al botón de eliminar
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteJob(job.id));
    
    return card;
}

/**
 * Actualiza el contador de trabajos
 */
function updateWorksCount() {
    worksCount.textContent = companyJobs.length;
}

/**
 * Formatea una fecha a formato legible
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Muestra un estado de carga
 */
function showLoading() {
    worksList.innerHTML = `
        <div class="loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando trabajos...</p>
        </div>
    `;
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    worksList.innerHTML = `
        <div class="alert alert-warning" role="alert">
            <strong>⚠️ ${message}</strong>
            <p class="mt-2 mb-0">Para que la aplicación funcione correctamente:</p>
            <ol class="mt-2">
                <li>Instala json-server: <code>npm install -g json-server</code></li>
                <li>Crea un archivo db.json con la estructura: <code>{ "jobs": [] }</code></li>
                <li>Ejecuta: <code>json-server --watch db.json --port 3000</code></li>
            </ol>
        </div>
    `;
}

/**
 * Muestra un mensaje de éxito temporal
 */
function showSuccessMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-5';
    alert.style.zIndex = '9999';
    alert.innerHTML = `
        <strong>✓ ${message}</strong>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.transition = 'opacity 0.5s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 3000);
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Exportar funciones para uso en otros módulos si es necesario
export { loadJobs, createJob, deleteJob };