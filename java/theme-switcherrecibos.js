document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const themeStyle = document.getElementById("theme-style");

    if (!themeToggle || !themeStyle) {
        console.error("Falta #theme-toggle o #theme-style en el HTML");
        return;
    }

    const savedTheme = localStorage.getItem("theme") || "light";

    if (savedTheme === "dark") {
        themeStyle.href = "css/recibosdark.css";
        themeToggle.textContent = "☀️ Modo Diurno";
    } else {
        themeStyle.href = "css/recibos.css";
        themeToggle.textContent = "🌙 Modo Nocturno";
    }

    themeToggle.addEventListener("click", () => {
        const isDark = themeStyle.href.includes("recibosdark.css");

        if (isDark) {
            themeStyle.href = "css/recibos.css";
            themeToggle.textContent = "🌙 Modo Nocturno";
            localStorage.setItem("theme", "light");
        } else {
            themeStyle.href = "css/recibosdark.css";
            themeToggle.textContent = "☀️ Modo Diurno";
            localStorage.setItem("theme", "dark");
        }
    });
});
