// login.js
const KEY_USERS = 'registeredUsers_v1';
const KEY_LOGGED = 'loggedUser_v1';

// Obtener usuarios almacenados
function getUsers() {
  try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; }
  catch { return []; }
}

function saveUsers(arr) {
  localStorage.setItem(KEY_USERS, JSON.stringify(arr));
}

// Inicializa usuarios por defecto si no existen
if (!localStorage.getItem(KEY_USERS)) {
  saveUsers(["admin", "merlina"]);
}

document.getElementById("btnLogin").addEventListener("click", () => {
  const user = document.getElementById("usuario").value.trim();
  if (!user) {
    Swal.fire("⚠️", "Escribe un nombre de usuario", "warning");
    return;
  }

  const users = getUsers();
  if (users.includes(user)) {
    localStorage.setItem(KEY_LOGGED, user);
    Swal.fire("✅", `Bienvenido, ${user}`, "success").then(() => {
      window.location.href = "modificar.html"; // redirige a tu página
    });
  } else {
    Swal.fire({
      title: "Usuario no encontrado",
      text: `¿Deseas registrarlo?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
    }).then((r) => {
      if (r.isConfirmed) {
        users.push(user);
        saveUsers(users);
        localStorage.setItem(KEY_LOGGED, user);
        Swal.fire("✅", `Usuario ${user} registrado`, "success").then(() => {
          window.location.href = "modificar.html";
        });
      }
    });
  }
});
