<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscar por Número de Cuenta</title>
    <link rel="stylesheet" href="css/editar.css" id="theme-style">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="java/avion-loading.js"></script>
   
    <script>
        // Mostrar el loader cuando la página comience a cargar
        document.addEventListener('DOMContentLoaded', function() {
            AvionLoading.mostrar();
        });

        // Ocultar el loader cuando todo esté cargado
        window.addEventListener('load', function() {
            setTimeout(function() {
                AvionLoading.ocultar();
            }, 2000); // 2 segundos de demostración
        });

        // También puedes usarlo para transiciones entre páginas
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.href) {
                e.preventDefault();
                AvionLoading.mostrar();
                
                // Navegar después de mostrar el loader
                setTimeout(function() {
                    window.location.href = e.target.href;
                }, 500);
            }
        });
       
    </script>
</head>
<body>
     
    <!-- Barra de navegación -->
    <nav class="clearfix">
        <img src="img/logo2.png" alt="Logo" class="logo"> <!-- logo  -->
        <div class="menu-center">  
            <a href='/'>Inicio</a>
            
            <!-- Dropdown de Servicios -->
            <div class="dropdown">
                <a class="dropbtn">Servicios</a>
                <div class="dropdown-content">
                    <a href='https://www.inegi.org.mx/app/indicesdeprecios/calculadorainflacion.aspx' target='_blank'>CALCULADORA DE INFLACIÓN</a>
                    <a href='/comparacion.html' target='_blank'>COMPARACION</a>
                    <a href="comprobante.html">COMPROBANTE DE DEPOSITOS</a>
                    <a href="catalogo.html">Catalogo</a>
                    <a href="cedula.html" target="_blank">CEDULA DE DETERMINACIÓN</a>
                </div>
            </div>

            <!-- justo arriba de href contacto;Segundo Dropdown de Recursos -->
            <div class="dropdown">
                <a class="dropbtn">BD CLIENTES</a>
                <div class="dropdown-content">
                    <a href='registrar.html'>REGISTRAR</a>
                    <a href='editar.html'>EDITAR</a>
                </div>
            </div>

            <a href='/contacto.html'>Contacto</a>
            <button id="theme-toggle">🌙 Modo Nocturno</button>
        </div>
    </nav>
    
    <h1>BUSCAR POR NÚMERO DE CUENTA 1234</h1>
        
    <form id="searchForm">
        <div class="cedula-container">
            <div class="form-group">
                <label for="accountNumber">Número de cuenta <span class="required">*</span></label>
                <input type="text" id="accountNumber" name="accountNumber" required>
                <div class="error" id="accountNumberError">Por favor ingrese un número de cuenta válido</div>
            </div>
            
            <div class="btn-container">
                <button type="submit" class="btn">Buscar Cuenta</button>
                
            </div>
        </div>
             
    
    </form>
   
    <!-- Sección para mostrar resultados -->
    <div id="searchResults">
        <h3>Resultados de la Búsqueda</h3>
        <div id="resultsContainer"></div>
    </div>

    
    


    <script>
document.getElementById("searchForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const accountNumber = document.getElementById("accountNumber").value;
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "Buscando...";

    try {
        const response = await fetch(`https://script.google.com/macros/s/AKfycbyf1Y-aybbNv1ckN5kHvgsB8AOWDAwX-EpFD7fXR-qw2Q8S97Ivtldr3W7FLtQ32lj0/exec?accountNumber=${accountNumber}`);
        const data = await response.json();

        if (data.error) {
            resultsContainer.innerHTML = `<p style="color:red">${data.error}</p>`;
        } else {
            // Mostrar los resultados (ajusta según tus columnas)
            resultsContainer.innerHTML = `
                <p><strong>Número de cuenta:</strong> ${data[0]}</p>
                <p><strong>Nombre:</strong> ${data[1]}</p>
                <p><strong>Email:</strong> ${data[2]}</p>
            `;
        }
    } catch (err) {
        resultsContainer.innerHTML = `<p style="color:red">Error al buscar la cuenta</p>`;
        console.error(err);
    }
});
</script>

</body>

</html>
