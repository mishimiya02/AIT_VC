<?php
// Configuración de conexión a la base de datos
$host = "sql107.infinityfree.com";
$usuario = "if0_39935195";
$password = "114f1n4n24s";
$base_datos = "if0_39935195_clientes";
$puerto = 3306;

// Crear conexión
$conexion = new mysqli($host, $usuario, $password, $base_datos, $puerto);

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Configurar charset
$conexion->set_charset("utf8");

// Procesar formulario cuando se envía
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger y validar datos
    $numero_cuenta = validar_dato($_POST["accountNumber"], "Número de cuenta");
    $razon_social = validar_dato($_POST["businessName"], "Razón social");
    $rfc = validar_dato($_POST["rfc"], "RFC");
    $codigo_postal = validar_dato($_POST["postalCode"], "Código postal");
    $email = validar_dato($_POST["email"], "Correo electrónico");
    
    // Validaciones específicas
    if (!preg_match("/^[0-9]{5,20}$/", $numero_cuenta)) {
        mostrar_error("El número de cuenta debe contener entre 5 y 20 dígitos");
    }
    
    if (!preg_match("/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/", $rfc)) {
        mostrar_error("El RFC no tiene un formato válido");
    }
    
    if (!preg_match("/^[0-9]{5}$/", $codigo_postal)) {
        mostrar_error("El código postal debe contener exactamente 5 dígitos");
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        mostrar_error("El correo electrónico no tiene un formato válido");
    }
    
    // Preparar y ejecutar consulta
    $stmt = $conexion->prepare("INSERT INTO clientes (numero_cuenta, razon_social, rfc, codigo_postal, email, fecha_registro) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssss", $numero_cuenta, $razon_social, $rfc, $codigo_postal, $email);
    
    if ($stmt->execute()) {
        // Éxito: redirigir a página de confirmación
        header("Location: registro_exitoso.html");
        exit();
    } else {
        mostrar_error("Error al guardar los datos: " . $stmt->error);
    }
    
    $stmt->close();
}

$conexion->close();

// Funciones auxiliares
function validar_dato($dato, $campo) {
    if (empty(trim($dato))) {
        mostrar_error("El campo $campo es obligatorio");
    }
    return htmlspecialchars(trim($dato));
}

function mostrar_error($mensaje) {
    // Podrías redirigir a una página de error o mostrar el mensaje
    die("<div style='text-align:center; padding:20px;'>
            <h2>Error en el formulario</h2>
            <p>$mensaje</p>
            <a href='registrar.html'>Volver al formulario</a>
         </div>");
}
?>