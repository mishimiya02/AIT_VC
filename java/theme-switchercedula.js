document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeStyle = document.getElementById("theme-style");

    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem("theme") || "light";

    // Aplicar tema guardado al cargar la página
    if (savedTheme === "dark") {
        themeStyle.href = "css/cedula.css";
        themeToggle.textContent = "☀️ Modo Diurno";
    }

    // Alternar entre temas
    themeToggle.addEventListener("click", () => {
        const isDark = themeStyle.href.includes("css/cedula.css");
        if (isDark) {
            themeStyle.href = "css/cedulalight.css";
            themeToggle.textContent = "🌙 Modo Nocturno";
            localStorage.setItem("theme", "light");
        } else {
            themeStyle.href = "css/cedula.css";
            themeToggle.textContent = "☀️ Modo Diurno";
            localStorage.setItem("theme", "dark");
        }
    });
});