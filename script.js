// Datos de ejemplo de turnos
let turnos = [
    {
        id: 1,
        dni: "12345678",
        apellido: "Garcia",
        fecha: "2024-01-15",
        hora: "10:30",
        doctor: "Dr. Martinez",
        especialidad: "Cardiología",
        estado: "confirmado"
    },
    {
        id: 2,
        dni: "12345678",
        apellido: "Garcia",
        fecha: "2024-01-22",
        hora: "14:00",
        doctor: "Dra. Lopez",
        especialidad: "Dermatología",
        estado: "pendiente"
    },
    {
        id: 3,
        dni: "87654321",
        apellido: "Rodriguez",
        fecha: "2024-01-18",
        hora: "09:15",
        doctor: "Dr. Fernandez",
        especialidad: "Traumatología",
        estado: "confirmado"
    }
];

const doctores = {
    "Cardiología": ["Dr. Martinez", "Dr. Gomez"],
    "Dermatología": ["Dra. Lopez", "Dr. Silva"],
    "Traumatología": ["Dr. Fernandez", "Dra. Ruiz"],
    "Pediatría": ["Dra. Castro", "Dr. Morales"]
};

let usuarioActual = null;
let nextId = 4;

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const turnosSection = document.getElementById('turnosSection');
    const loginSection = document.querySelector('.login-section');
    const nuevoTurnoSection = document.getElementById('nuevoTurnoSection');
    const modificarTurnoSection = document.getElementById('modificarTurnoSection');
    const backBtn = document.getElementById('backBtn');
    const nuevoTurnoBtn = document.getElementById('nuevoTurnoBtn');
    const especialidadSelect = document.getElementById('especialidad');
    const doctorSelect = document.getElementById('doctor');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const dni = document.getElementById('dni').value;
        const apellido = document.getElementById('apellido').value.toLowerCase();
        
        usuarioActual = { dni, apellido };
        
        const turnosPaciente = turnos.filter(turno => 
            turno.dni === dni && turno.apellido.toLowerCase() === apellido
        );
        
        mostrarTurnos(turnosPaciente);
    });

    backBtn.addEventListener('click', function() {
        mostrarSeccion('login');
    });

    nuevoTurnoBtn.addEventListener('click', function() {
        mostrarSeccion('nuevoTurno');
    });

    especialidadSelect.addEventListener('change', function() {
        const especialidad = this.value;
        doctorSelect.innerHTML = '<option value="">Seleccionar doctor</option>';
        
        if (especialidad && doctores[especialidad]) {
            doctores[especialidad].forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor;
                option.textContent = doctor;
                doctorSelect.appendChild(option);
            });
        }
    });

    document.getElementById('nuevoTurnoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevoTurno = {
            id: nextId++,
            dni: usuarioActual.dni,
            apellido: usuarioActual.apellido,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            doctor: document.getElementById('doctor').value,
            especialidad: document.getElementById('especialidad').value,
            estado: 'pendiente'
        };
        
        turnos.push(nuevoTurno);
        alert('Turno reservado exitosamente');
        
        const turnosPaciente = turnos.filter(turno => 
            turno.dni === usuarioActual.dni && turno.apellido.toLowerCase() === usuarioActual.apellido.toLowerCase()
        );
        mostrarTurnos(turnosPaciente);
    });

    document.getElementById('modificarTurnoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const turnoId = parseInt(document.getElementById('turnoId').value);
        const turno = turnos.find(t => t.id === turnoId);
        
        if (turno) {
            turno.fecha = document.getElementById('nuevaFecha').value;
            turno.hora = document.getElementById('nuevaHora').value;
            alert('Turno modificado exitosamente');
            
            const turnosPaciente = turnos.filter(turno => 
                turno.dni === usuarioActual.dni && turno.apellido.toLowerCase() === usuarioActual.apellido.toLowerCase()
            );
            mostrarTurnos(turnosPaciente);
        }
    });

    document.getElementById('cancelarNuevoBtn').addEventListener('click', function() {
        const turnosPaciente = turnos.filter(turno => 
            turno.dni === usuarioActual.dni && turno.apellido.toLowerCase() === usuarioActual.apellido.toLowerCase()
        );
        mostrarTurnos(turnosPaciente);
    });

    document.getElementById('cancelarModificarBtn').addEventListener('click', function() {
        const turnosPaciente = turnos.filter(turno => 
            turno.dni === usuarioActual.dni && turno.apellido.toLowerCase() === usuarioActual.apellido.toLowerCase()
        );
        mostrarTurnos(turnosPaciente);
    });

    function mostrarSeccion(seccion) {
        loginSection.style.display = seccion === 'login' ? 'block' : 'none';
        turnosSection.style.display = seccion === 'turnos' ? 'block' : 'none';
        nuevoTurnoSection.style.display = seccion === 'nuevoTurno' ? 'block' : 'none';
        modificarTurnoSection.style.display = seccion === 'modificarTurno' ? 'block' : 'none';
        
        if (seccion === 'login') {
            document.getElementById('loginForm').reset();
            usuarioActual = null;
        }
    }

    function mostrarTurnos(turnosPaciente) {
        const turnosList = document.getElementById('turnosList');
        turnosList.innerHTML = '';
        
        if (turnosPaciente.length === 0) {
            turnosList.innerHTML = '<p>No tienes turnos reservados.</p>';
        } else {
            turnosPaciente.forEach(turno => {
                const turnoCard = document.createElement('div');
                turnoCard.className = 'turno-card';
                
                const fecha = new Date(turno.fecha).toLocaleDateString('es-ES');
                
                turnoCard.innerHTML = `
                    <div class="turno-fecha">${fecha} - ${turno.hora}</div>
                    <div class="turno-doctor">${turno.doctor} - ${turno.especialidad}</div>
                    <span class="turno-estado estado-${turno.estado}">
                        ${turno.estado.toUpperCase()}
                    </span>
                    <div class="turno-actions">
                        <button class="btn-modificar" onclick="modificarTurno(${turno.id})">Modificar</button>
                        <button class="btn-cancelar" onclick="cancelarTurno(${turno.id})">Cancelar</button>
                    </div>
                `;
                
                turnosList.appendChild(turnoCard);
            });
        }
        
        mostrarSeccion('turnos');
    }

    window.modificarTurno = function(turnoId) {
        const turno = turnos.find(t => t.id === turnoId);
        if (turno) {
            document.getElementById('turnoId').value = turnoId;
            document.getElementById('nuevaFecha').value = turno.fecha;
            document.getElementById('nuevaHora').value = turno.hora;
            mostrarSeccion('modificarTurno');
        }
    };

    window.cancelarTurno = function(turnoId) {
        if (confirm('¿Estás seguro de que quieres cancelar este turno?')) {
            turnos = turnos.filter(t => t.id !== turnoId);
            const turnosPaciente = turnos.filter(turno => 
                turno.dni === usuarioActual.dni && turno.apellido.toLowerCase() === usuarioActual.apellido.toLowerCase()
            );
            mostrarTurnos(turnosPaciente);
        }
    };
});