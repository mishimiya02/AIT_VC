 function validarAcceso(destino) {
      const pass = document.getElementById("password").value.trim();
      const error = document.getElementById("error");

      const contrasenasValidas = ["RMV", "JM", "ADMAIT"];

      if (contrasenasValidas.includes(pass)) {
        window.location.href = destino;
      } else {
        error.style.display = "block";
      }
    } 