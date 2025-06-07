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
 // Valores: cada mes tiene 3 datos asociados
    const valores = {
        "2025": {
            "1": ["0.29", "0.29","3.59"],
            "2": ["0.28",	"0.56",	"3.77"],
            "3": [" 0.31",	"0.88",	"3.80"],
            "4": ["0.33",	"1.21",	"3.93"],
            "5": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
        "6": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
        "7": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
        "8": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
        "9": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
        "10": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
        "11": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
        "12": [ "Valor no disponible","Valor no disponible","Valor no disponible"],
       

            
        },
        "2024": {
             "1": [" 0.89", "0.89", "4.88"],
            "2": ["A0.09", "0.99", "4.40"],
            "3": ["0.29", "1.28", "4.42"],
            "4": ["0.20", "1.48", "4.65"],
            "5": ["-0.19", "1.29", "4.69"],
            "6": ["0.38", "1.68", "4.98"],
            "7": ["1.05", "2.74", "5.57"],
            "8": ["0.01", "2.75", "4.99"],
            "9": ["0.05", "2.80", "4.58"],
            "10": ["0.55", "3.37", "4.76"],
            "11": ["0.44", "3.82", "4.55"],
            "12": ["0.38", "4.21", "4.21"]
        },
        "2023": {
             "1": [" 0.68", " 0.68", " 7.91"],
            "2": [" 0.56", " 1.24", " 7.62"],
            "3": [" 0.27", " 1.51", " 6.81"],
            "4": [" -0.02", "1.49", " 6.25"],
            "5": [" -0.22", " 1.27", " 5.84"],
            "6": [" 0.10", " 1.37", " 5.06"],
            "7": [" 0.48", " 1.86", " 4.79"],
            "8": [" 0.55", " 2.42", " 4.64"],
            "9": [" 0.44", " 2.88", " 4.45"],
            "10": ["0.38", " 3.27", "4.26"],
            "11": [" 0.64", " 3.93", "4.32"],
            "12": [" 0.71", " 4.66", " 4.66"]
        },
"2022": {
             "1": ["Valor A0.59", "Valor B0.59", "Valor C7.07"],
            "2": ["Valor A0.83", "Valor B1.43", "Valor C7.28"],
            "3": ["Valor A0.99", "Valor B2.43", "Valor C7.45"],
            "4": ["Valor A0.54", "Valor B2.98", "Valor C7.68"],
            "5": ["Valor A0.18", "Valor B3.17", "Valor C7.65"],
            "6": ["Valor A0.84", "Valor B4.04", "Valor C7.99"],
            "7": ["Valor A0.74", "Valor B4.81", "Valor C8.15"],
            "8": ["Valor A0.70", "Valor B5.54", "Valor C8.70"],
            "9": ["Valor A0.62", "Valor B6.19", "Valor C8.70"],
            "10": ["Valor A0.57", "Valor B6.79", "Valor C8.41"],
            "11": ["Valor A0.58", "Valor B7.41", "Valor C7.80"],
            "12": ["Valor A0.38", "Valor B7.82", "Valor C7.82"]
        },
        "2021": {
             "1": ["Valor A", "Valor B", "Valor C"],
            "2": ["Valor A", "Valor B", "Valor C"],
            "3": ["Valor A", "Valor B", "Valor C"],
            "4": ["Valor A", "Valor B", "Valor C"],
            "5": ["Valor A", "Valor B", "Valor C"],
            "6": ["Valor A", "Valor B", "Valor C"],
            "7": ["Valor A", "Valor B", "Valor C"],
            "8": ["Valor A", "Valor B", "Valor C"],
            "9": ["Valor A", "Valor B", "Valor C"],
            "10": ["Valor A", "Valor B", "Valor C"],
            "11": ["Valor A", "Valor B", "Valor C"],
            "12": ["Valor A", "Valor B", "Valor C"]
        },

        "2020": {
             "1": ["Valor A", "Valor B", "Valor C"],
            "2": ["Valor A", "Valor B", "Valor C"],
            "3": ["Valor A", "Valor B", "Valor C"],
            "4": ["Valor A", "Valor B", "Valor C"],
            "5": ["Valor A", "Valor B", "Valor C"],
            "6": ["Valor A", "Valor B", "Valor C"],
            "7": ["Valor A", "Valor B", "Valor C"],
            "8": ["Valor A", "Valor B", "Valor C"],
            "9": ["Valor A", "Valor B", "Valor C"],
            "10": ["Valor A", "Valor B", "Valor C"],
            "11": ["Valor A", "Valor B", "Valor C"],
            "12": ["Valor A", "Valor B", "Valor C"]
        },

        "2019": {
             "1": ["Valor A", "Valor B", "Valor C"],
            "2": ["Valor A", "Valor B", "Valor C"],
            "3": ["Valor A", "Valor B", "Valor C"],
            "4": ["Valor A", "Valor B", "Valor C"],
            "5": ["Valor A", "Valor B", "Valor C"],
            "6": ["Valor A", "Valor B", "Valor C"],
            "7": ["Valor A", "Valor B", "Valor C"],
            "8": ["Valor A", "Valor B", "Valor C"],
            "9": ["Valor A", "Valor B", "Valor C"],
            "10": ["Valor A", "Valor B", "Valor C"],
            "11": ["Valor A", "Valor B", "Valor C"],
            "12": ["Valor A", "Valor B", "Valor C"]
        },

         "2018": {
             "1": ["Valor A", "Valor B", "Valor C"],
            "2": ["Valor A", "Valor B", "Valor C"],
            "3": ["Valor A", "Valor B", "Valor C"],
            "4": ["Valor A", "Valor B", "Valor C"],
            "5": ["Valor A", "Valor B", "Valor C"],
            "6": ["Valor A", "Valor B", "Valor C"],
            "7": ["Valor A", "Valor B", "Valor C"],
            "8": ["Valor A", "Valor B", "Valor C"],
            "9": ["Valor A", "Valor B", "Valor C"],
            "10": ["Valor A", "Valor B", "Valor C"],
            "11": ["Valor A", "Valor B", "Valor C"],
            "12": ["Valor A", "Valor B", "Valor C"]
        },

         "2017": {
             "1": ["Valor A", "Valor B", "Valor C"],
            "2": ["Valor A", "Valor B", "Valor C"],
            "3": ["Valor A", "Valor B", "Valor C"],
            "4": ["Valor A", "Valor B", "Valor C"],
            "5": ["Valor A", "Valor B", "Valor C"],
            "6": ["Valor A", "Valor B", "Valor C"],
            "7": ["Valor A", "Valor B", "Valor C"],
            "8": ["Valor A", "Valor B", "Valor C"],
            "9": ["Valor A", "Valor B", "Valor C"],
            "10": ["Valor A", "Valor B", "Valor C"],
            "11": ["Valor A", "Valor B", "Valor C"],
            "12": ["Valor A", "Valor B", "Valor C"]
        },
                 "2016": {
             "1": ["Valor A", "Valor B", "Valor C"],
            "2": ["Valor A", "Valor B", "Valor C"],
            "3": ["Valor A", "Valor B", "Valor C"],
            "4": ["Valor A", "Valor B", "Valor C"],
            "5": ["Valor A", "Valor B", "Valor C"],
            "6": ["Valor A", "Valor B", "Valor C"],
            "7": ["Valor A", "Valor B", "Valor C"],
            "8": ["Valor A", "Valor B", "Valor C"],
            "9": ["Valor A", "Valor B", "Valor C"],
            "10": ["Valor A", "Valor B", "Valor C"],
            "11": ["Valor A", "Valor B", "Valor C"],
            "12": ["Valor A", "Valor B", "Valor C"]
        },
          "2015": {
             "1": ["Valor A", "Valor B", "Valor C"],
            "2": ["Valor A", "Valor B", "Valor C"],
            "3": ["Valor A", "Valor B", "Valor C"],
            "4": ["Valor A", "Valor B", "Valor C"],
            "5": ["Valor A", "Valor B", "Valor C"],
            "6": ["Valor A", "Valor B", "Valor C"],
            "7": ["Valor A", "Valor B", "Valor C"],
            "8": ["Valor A", "Valor B", "Valor C"],
            "9": ["Valor A", "Valor B", "Valor C"],
            "10": ["Valor A", "Valor B", "Valor C"],
            "11": ["Valor A", "Valor B", "Valor C"],
            "12": ["Valor A", "Valor B", "Valor C"]
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

        const valoresMes = valores[anio] && valores[anio][mes];

        if (valoresMes && valoresMes.length === 3) {
            const nombreMes = document.getElementById('mes').options[document.getElementById('mes').selectedIndex].text;
            resultadoDiv.innerHTML = `
                <strong>Mes:</strong> ${nombreMes}<br>
                <strong>Año:</strong> ${anio}<br><br>
                <strong>Mensual:</strong> ${valoresMes[0]}<br>
                <strong>Acumulada:</strong> ${valoresMes[1]}<br>
                <strong>Anual:</strong> ${valoresMes[2]}
            `;
        } else {
            resultadoDiv.textContent = "No hay valores definidos para esa combinación.";
        }
    }