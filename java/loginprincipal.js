function validarAcceso(paginaDestino) {
    // 1. Obtenemos la contraseña y la pasamos a Mayúsculas
    const passwordInput = document.getElementById('password').value.toUpperCase();

    // 2. Definimos nuestras llaves (Cámbialas por las que tú quieras)
    const CLAVE_GLOBAL = "CXC"; // Entra a todo
    const CLAVES_SECCIONES = {
        'loginprincipal.html': 'RMV',
        'cdblogin.html':       'JM',
        'vacacionesc.html':    'OOR'
    };

    // 3. Validación
    if (passwordInput === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor, ingresa una contraseña.'
        });
        return;
    }

    // Verificamos si es la clave maestra O si es la clave de la sección específica
    if (passwordInput === CLAVE_GLOBAL || passwordInput === CLAVES_SECCIONES[paginaDestino]) {
        
        Swal.fire({
            icon: 'success',
            title: 'Acceso Correcto',
            text: 'Redirigiendo...',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = paginaDestino;
        });

    } else {
        // Si no coincide con ninguna
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Incorrecta',
            text: 'Verifica tus datos e intenta de nuevo.'
        });
    }
}