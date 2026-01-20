function validarAcceso(destino) {
  const pass = document.getElementById("password").value.trim().toUpperCase();
  const error = document.getElementById("error");

  error.style.display = "none";

  const url = new URL("https://script.google.com/macros/s/AKfycbw2v_SBVoTadLFwjuZkMkS0gp6a-eux8VnlXSJ9UkLPDoxtdY-J1hCyAPZGe1VQQ415kQ/exec");
  url.searchParams.append("password", pass);
  url.searchParams.append("destino", destino);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = destino;
      } else {
        error.textContent = data.msg;
        error.style.display = "block";
      }
    })
    .catch(() => {
      error.textContent = "Error de conexión";
      error.style.display = "block";
    });
}


