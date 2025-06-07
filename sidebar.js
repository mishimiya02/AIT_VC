document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Alternar sidebar
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    });
    
    // Cerrar sidebar
    closeBtn.addEventListener('click', function() {
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });
    
    // Cerrar sidebar al hacer clic fuera de ella
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && event.target !== toggleBtn) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
    
    // Evitar que el clic dentro de la sidebar cierre el menú
    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
// Mapeo de valores por año y mes
    const valores = {
        "2025": {
            "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
            "7": 7, "8": 8, "9": 9, "10": 10, "11": 11, "12": 12
        },
        "2024": {
            "1": 13, "2": 14, "3": 15, "4": 16, "5": 17, "6": 18,
            "7": 19, "8": 20, "9": 21, "10": 22, "11": 23, "12": 24
        }
    };

    function mostrarValor() {
        const mes = document.getElementById('mes').value;
        const anio = document.getElementById('anio').value;
        const resultadoDiv = document.getElementById('resultadot');

        if (!mes || !anio) {
            resultadoDiv.textContent = "Por favor, selecciona mes y año.";
            return;
        }

        const valor = valores[anio] && valores[anio][mes];

        if (valor !== undefined) {
            const nombreMes = document.getElementById('mes').options[document.getElementById('mes').selectedIndex].text;
            resultadoDiv.innerHTML = `
                <strong>Mes:</strong> ${nombreMes}<br>
                <strong>Año:</strong> ${anio}<br>
                <strong>Valor:</strong> ${valor}
            `;
        } else {
            resultadoDiv.textContent = "No hay valor definido para esa combinación.";
        }
    }