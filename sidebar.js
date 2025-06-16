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
             "1": [" 0.59", " 0.59", "7.07"],
            "2": [" 0.83", " 1.43", " 7.28"],
            "3": [" 0.99", " 2.43", " 7.45"],
            "4": [" 0.54", " 2.98", " 7.68"],
            "5": [" 0.18", " 3.17", " 7.65"],
            "6": [" 0.84", " 4.04", " 7.99"],
            "7": [" 0.74", " 4.81", " 8.15"],
            "8": [" 0.70", " 5.54", " 8.70"],
            "9": [" 0.62", " 6.19", " 8.70"],
            "10": ["0.57", " 6.79", " 8.41"],
            "11": [" 0.58", "7.41", "7.80"],
            "12": [" 0.38", " 7.82", " 7.82"]
        },
        "2021": {
             "1": ["0.86","0.86","3.54"],
            "2": ["0.63","1.50","3.7"],
            "3": ["0.83","2.34","4.67"],
            "4": ["0.33","2.67","6.08"],
            "5": ["0.20","2.88","5.89"],
            "6": ["0.53","3.43","5.88"],
            "7": ["0.59","4.04","5.81"],
            "8": ["0.19","4.24","5.59"],
            "9": ["0.62","4.88","6.00"],
            "10": [".84","5.76","6.24"],
            "11": ["1.14","6.97","7.37"],
            "12": ["0.36","7.36","7.36"]
        },

        "2020": {
              "1": ["0.48","0.48","3.24"],
            "2": ["0.42",	"0.90","3.70"],
            "3": ["-0.05",	"0.85","3.25"],
            "4": ["-1.01",	"-0.17","2.15"],
            "5": ["0.38",	"0.22","2.84"],
            "6": ["0.55",	"0.76","3.33"],
            "7": ["0.66",	"1.43","3.62"],
            "8": ["0.39	","1.82","4.05"],
            "9": ["0.23",	"2.06",	"4.01"],
            "10": ["0.61",	"2.68",	"4.09"],
            "11": ["0.08",	"2.76",	"3.33"],
            "12": ["0.38",	"3.15",	"3.15"]
        },

        "2019": {
             "1": ["0.09",	"0.09",	"4.37"],
            "2": ["-0.03",	"0.06",	"3.94"],
            "3": ["0.39",	"0.44",	"4.00"],
            "4": ["0.05",	"0.50",	"4.41"],
            "5": ["-0.29",	"0.21",	"4.28"],
            "6": ["0.06",	"0.27",	"3.95"],
            "7": ["0.38",	"0.65",	"3.78"],
            "8": ["-0.02",	"0.63",	"3.16"],
            "9": ["0.26",	"0.89",	"3.00"],
            "10": ["0.54",	"1.44",	"3.02"],
            "11": ["0.81",	"2.26",	"2.97"],
            "12": ["0.56",	"2.83",	"2.83"]
        },
/*continuar*/
         "2018": {
             "1": ["0.53","0.53",	"5.55"],
            "2": ["0.38","0.91",	"5.34"],
            "3": ["0.32","1.24",    "5.04"],
            "4": ["-0.34","0.90",	"4.55"],
            "5": ["-0.16","0.73",	"4.51"],
            "6": ["0.39","1.12",	"4.65"],
            "7": ["0.54","1.66",	"4.81"],
            "8": ["0.58","2.26",	"4.90"],
            "9": ["0.42","2.69",	"5.02"],
            "10": ["0.52","3.22",	"4.90"],
            "11": ["0.85","4.10",	"4.72"],
            "12": ["0.70","4.83",	"4.83"]
        },

         "2017": {
             "1": ["1.70",	"1.70",	"4.72"],
            "2": ["0.58",	"2.29",	"4.86"],
            "3": ["0.61",	"2.92",	"5.35"],
            "4": ["0.12",	"3.04",	"5.82"],
            "5": ["-0.12",	"2.92",	"6.16"],
            "6": ["0.25",	"3.18",	"6.31"],
            "7": ["0.38",	"3.57",	"6.44"],
            "8": ["0.49",	"4.08",	"6.66"],
            "9": ["0.31	",  "4.41",	"6.35"],
            "10": ["0.63",	"5.06",	"6.37"],
            "11": ["1.03",	"6.15",	"6.63"],
            "12": ["0.59",	"6.77",	"6.77"]
        },
                 "2016": {
             "1": ["0.38",	"0.38",	"2.61"],
            "2": ["0.44",	"0.82",	"2.87"],
            "3": ["0.15",	"0.97",	"2.60"],
            "4": ["-0.32",	"0.65",	"2.54"],
            "5": ["-0.45",	"0.20",	"2.60"],
            "6": ["0.11",	"0.31",	"2.54"],
            "7": ["0.26",	"0.57",	"2.65"],
            "8": ["0.28",	"0.86",	"2.73"],
            "9": ["0.61",	"1.47",	"2.97"],
            "10": ["0.61",	"2.09",	"3.06"],
            "11": ["0.78",	"2.89",	"3.31"],
            "12": ["0.46",	"3.36",	"3.36"]
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