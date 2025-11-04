console.log("✅ Script login.js cargado correctamente");

const KEY_USERS = 'registeredUsers_v1';
const KEY_LOGGED = 'loggedUser_v1';

function getUsers() {
  try {
    const data = localStorage.getItem(KEY_USERS);
    console.log("📦 Valor actual en localStorage:", data);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("❌ Error al leer usuarios:", e);
    return [];
  }
}

function saveUsers(arr) {
  console.log("💾 Guardando usuarios:", arr);
  localStorage.setItem(KEY_USERS, JSON.stringify(arr));
}

if (!localStorage.getItem(KEY_USERS)) {
  const defaultUsers = ["adminait", "JM", "reservado01"];
  saveUsers(defaultUsers);
  console.log("✅ Usuarios inicializados:", defaultUsers);
} else {
  console.log("📂 Usuarios existentes:", getUsers());
}

document.getElementById("btnLogin").addEventListener("click", () => {
  const userInput = document.getElementById("usuario").value.trim().toLowerCase();
  
  if (!userInput) {
    Swal.fire("⚠️", "Escribe un nombre de usuario", "warning");
    return;
  }

  const users = getUsers().map(u => u.toLowerCase());
  console.log("👥 Lista de usuarios actuales:", users);

  if (users.includes(userInput)) {
    localStorage.setItem(KEY_LOGGED, userInput);
    Swal.fire("✅", `Bienvenido, ${userInput}`, "success").then(() => {
      window.location.href = "modificar.html";
    });
  } else {
    Swal.fire("❌", "Usuario no encontrado. No tienes acceso.", "error");
  }
});
