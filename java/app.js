const API_URL = "https://script.google.com/macros/s/AKfycbwpanhZLyMOgb1XHXb--u2xD-dksCmcPyq9fdf6o8W5xK5C80nQgBEo7JC_TpgcelaCEA/exec";

document.getElementById("buscarBtn").addEventListener("click", async () => {
    const numeroCliente = document.getElementById("numeroCliente").value;
    const mensaje = document.getElementById("mensaje");

    if (!numeroCliente) {
        mensaje.textContent = "Ingrese un número de cliente.";
        return;
    }

    mensaje.textContent = "Buscando...";

    try {
        const res = await fetch(`${API_URL}?cliente=${numeroCliente}`);
        const data = await res.json();

        if (data.status === "not_found") {
            mensaje.textContent = "No se encontró el cliente.";
            return;
        }

        mensaje.textContent = "";

        // Mostrar tarjeta de edición
        document.getElementById("editarCard").classList.remove("hidden");

        // Llenar inputs
        document.getElementById("nombre").value = data.nombre;
        document.getElementById("domicilio").value = data.domicilio;
        document.getElementById("telefono").value = data.telefono;
        document.getElementById("email").value = data.email;
        document.getElementById("credito").value = data.credito;

    } catch (e) {
        mensaje.textContent = "Error al conectar con el servidor.";
    }
});


document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const mensaje = document.getElementById("mensaje");

    const payload = {
        nombre: document.getElementById("nombre").value,
        domicilio: document.getElementById("domicilio").value,
        telefono: document.getElementById("telefono").value,
        email: document.getElementById("email").value,
        credito: document.getElementById("credito").value,
        cliente: document.getElementById("numeroCliente").value
    };

    mensaje.textContent = "Guardando cambios...";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.status === "success") {
            mensaje.textContent = "Cambios guardados correctamente ✓";
        } else {
            mensaje.textContent = "Error al guardar.";
        }

    } catch {
        mensaje.textContent = "Error de conexión.";
    }
});
