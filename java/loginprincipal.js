function validarAcceso(destino) {
  const pass = document.getElementById("password").value.trim().toUpperCase();

  Swal.fire({
    title: "Validando contraseña",
    text: "Por favor espere…",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading()
  });

  const url = new URL("https://script.google.com/macros/s/AKfycbw2v_SBVoTadLFwjuZkMkS0gp6a-eux8VnlXSJ9UkLPDoxtdY-J1hCyAPZGe1VQQ415kQ/exec");
  url.searchParams.append("password", pass);
  url.searchParams.append("destino", destino);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      Swal.close();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "Acceso permitido",
          text: "Redirigiendo…",
          timer: 1200,
          showConfirmButton: false
        });

        setTimeout(() => {
          window.location.href = destino;
        }, 1200);

      } else {
        Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
          text: data.msg || "Verifique la contraseña"
        });

        document.getElementById("password").value = "";
        document.getElementById("password").focus();
      }
    })
    .catch(() => {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No fue posible validar la contraseña"
      });
    });
}
