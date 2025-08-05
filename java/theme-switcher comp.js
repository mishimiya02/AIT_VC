document.getElementById('theme-toggle').addEventListener('click', function() {
    const themeStyle = document.getElementById('theme-style');
    const currentTheme = themeStyle.getAttribute('href');
    const isDark = currentTheme.includes('compdark.css');
    
    // Alternar entre temas
    if(isDark) {
        themeStyle.setAttribute('href', 'css/comprobante.css');
        this.textContent = '🌙 Modo Nocturno';
    } else {
        themeStyle.setAttribute('href', 'css/compdark.css');
        this.textContent = '☀️ Modo Diurno';
    }
    
    // Guardar preferencia en localStorage
    localStorage.setItem('themePreference', isDark ? 'light' : 'dark');
});

// Cargar tema guardado al iniciar
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('themePreference');
    if(savedTheme === 'dark') {
        document.getElementById('theme-style').setAttribute('href', 'css/compdark.css');
        document.getElementById('theme-toggle').textContent = '☀️ Modo Diurno';
    }
});