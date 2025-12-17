document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeStyle = document.getElementById("theme-style");

    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem("theme") || "light";

    // Aplicar tema guardado al cargar la página
    if (savedTheme === "dark") {
        themeStyle.href = "css/caratula.css";
        themeToggle.textContent = "☀️  Diurno";
    }

    // Alternar entre temas
    themeToggle.addEventListener("click", () => {
        const isDark = themeStyle.href.includes("css/caratula.css");
        if (isDark) {
            themeStyle.href = "css/caratuladark.css";
            themeToggle.textContent = "🌙  Nocturno";
            localStorage.setItem("theme", "light");
        } else {
            themeStyle.href = "css/caratula.css";
            themeToggle.textContent = "☀️  Diurno";
            localStorage.setItem("theme", "dark");
        }
    });
});