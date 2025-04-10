document.addEventListener("DOMContentLoaded", function() {
    loadPeriodos();
});

function loadPeriodos() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'conexion.php?action=getPeriodos', true);
    xhr.onload = function () {
        if (this.status === 200) {
            try {
                var response = JSON.parse(this.responseText);
                if (response.error) {
                    console.error("Error del servidor:", response.error);
                    return;
                }
                var output = '<option value="">Seleccione un periodo</option>';
                for (var i in response) {
                    output += '<option value="' + response[i].id + '">' + response[i].nombre_periodo + '</option>';
                }
                document.getElementById('periodo').innerHTML = output;
                
                // Restaurar la selección si está guardada en localStorage
                var selectedPeriodo = localStorage.getItem('selectedPeriodo');
                if (selectedPeriodo) {
                    document.getElementById('periodo').value = selectedPeriodo;
                    loadCourses();
                }
            } catch (e) {
                console.error("Error al analizar JSON:", e);
            }
        }
    };
    xhr.send();
}

function loadCourses() {
    var periodoId = document.getElementById('periodo').value;

    localStorage.setItem('selectedPeriodo', periodoId);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'conexion.php?action=getCursos&periodo_id=' + encodeURIComponent(periodoId), true);
    xhr.onload = function () {
        if (this.status === 200) {
            try {
                var response = JSON.parse(this.responseText);
                if (response.error) {
                    console.error("Error del servidor:", response.error);
                    return;
                }
        
                var output = '<option value="">Seleccione un curso</option>';
                for (var i in response) {
                    output += '<option value="' + response[i].id + '">' + response[i].nombre_curso + '</option>';
                }
       
                document.getElementById('curso').innerHTML = output;

                var selectedCurso = localStorage.getItem('selectedCurso');
                if (selectedCurso) {
                    document.getElementById('curso').value = selectedCurso;
                    loadSessions();
                }
            } catch (e) {
                console.error("Error al analizar JSON:", e);
            }
        }
    };
    xhr.send();
}
function loadSessions() {
    var cursoId = document.getElementById('curso').value;
    var periodoId = document.getElementById('periodo').value;

    console.log("Cargando sesiones para curso_id:", cursoId, "y periodo_id:", periodoId); // Depuración

    localStorage.setItem('selectedCurso', cursoId);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'conexion.php?action=getSesiones&curso_id=' + encodeURIComponent(cursoId) + '&periodo_id=' + encodeURIComponent(periodoId), true);
    xhr.onload = function () {
        if (this.status === 200) {
            try {
                var response = JSON.parse(this.responseText);
                if (response.error) {
                    console.error("Error del servidor:", response.error);
                    return;
                }
                var output = '<tr><th>Número de Sesión</th><th>Fecha</th></tr>';
                for (var i in response) {
                    output += '<tr><td>' + response[i].num_sesion + '</td><td>' + response[i].fecha + '</td></tr>';
                }
                document.getElementById('sesiones').innerHTML = output;
            } catch (e) {
                console.error("Error al analizar JSON:", e);
                console.error("Respuesta recibida:", this.responseText);
            }
        }
    };
    xhr.send();
}