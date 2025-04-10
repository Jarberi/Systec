<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lazarillo";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener Periodos
if (isset($_GET['action']) && $_GET['action'] == 'getPeriodos') {
    $sql = "SELECT * FROM periodos";
    $result = $conn->query($sql);
    $periodos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $periodos[] = $row;
        }
    }
    header('Content-Type: application/json');
    echo json_encode($periodos);
    exit();
}
// Obtener curso
if (isset($_GET['action']) && $_GET['action'] == 'getCursos') {
    $periodo_id = $_GET['periodo_id'];
    $sql = "SELECT cursos.id, nombre_curso FROM cursos 
        JOIN sesiones ON cursos.id = sesiones.curso_id 
        WHERE sesiones.periodo_id = '$periodo_id' 
        GROUP BY cursos.id  ORDER BY nombre_curso ASC";
    $result = $conn->query($sql);
    $cursos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $cursos[] = $row;
        }
    }
    header('Content-Type: application/json');
    echo json_encode($cursos);
    exit();
}

// Obtener sesiones por curso y periodo
if (isset($_GET['action']) && $_GET['action'] == 'getSesiones') {
    if (isset($_GET['curso_id']) && isset($_GET['periodo_id'])) {
        $curso_id = $_GET['curso_id'];
        $periodo_id = $_GET['periodo_id'];
       // echo ($curso_id); // Depuración
        $sql = "SELECT fecha FROM sesiones 
                WHERE curso_id = '$curso_id' AND periodo_id = '$periodo_id' 
                ORDER BY fecha ASC";
        $result = $conn->query($sql);
        if ($result === false) {
            header('Content-Type: application/json');
            echo json_encode(['error' => $conn->error]);
            exit();
        }
        $sesiones = [];
        $num_sesion = 1;
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row['num_sesion'] = $num_sesion++;
                $sesiones[] = $row;
            }
        }
        header('Content-Type: application/json');
        echo json_encode($sesiones);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'curso_id o periodo_id no especificado']);
    }
    exit();
}

$conn->close();


?>
