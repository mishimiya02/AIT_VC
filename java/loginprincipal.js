function validarAcceso(destino) {
  const pass = document.getElementById("password").value.trim().toUpperCase();
  const error = document.getElementById("error");

  error.style.display = "none";

  // Definir accesos por contraseña
  const permisos = {
    RMV: ["loginprincipal.html"],   // Área 1
    JM: ["cdblogin.html"],          // Área 2
    OOR: ["vacacionesc.html"],      // Área 3
    CXC: [                          // Global
      "loginprincipal.html",
      "cdblogin.html",
      "vacacionesc.html"
    ]
  };

  // Validar contraseña
  if (!permisos[pass]) {
    error.textContent = "Contraseña incorrecta";
    error.style.display = "block";
    return;
  }

  // Validar permiso de acceso al destino
  if (permisos[pass].includes(destino)) {
    window.location.href = destino;
  } else {
    error.textContent = "No tienes acceso a esta sección";
    error.style.display = "block";
  }
}
