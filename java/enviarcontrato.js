document.getElementById("btnEnviar").addEventListener("click", function () {

  // Verificar antes de enviar
  if (!validarCamposObligatorios()) return;

  // Si pasa la validación
  Swal.fire({
    icon: "success",
    title: "✅ Datos completos",
    text: "Todos los campos están llenos. Enviando a Google Sheets...",
  });

// ✅ Función para validar que todos los campos requeridos estén llenos
function validarCamposObligatorios() {
  let camposVacios = [];

  // Selecciona todos los inputs, selects y textareas requeridos
  const campos = document.querySelectorAll("input[required], select[required], textarea[required]");

  campos.forEach(campo => {
    if (!campo.value.trim()) {
      camposVacios.push(campo);
      campo.style.border = "2px solid red"; // resalta el campo vacío
    } else {
      campo.style.border = ""; // limpia si ya está lleno
    }
  });

  if (camposVacios.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "⚠️ Campos obligatorios vacíos",
      text: "Por favor, completa todos los campos requeridos antes de continuar.",
      confirmButtonText: "Entendido"
    });
    // desplazarse al primer campo vacío
    camposVacios[0].scrollIntoView({ behavior: "smooth", block: "center" });
    camposVacios[0].focus();
    return false; // ❌ detiene el envío
  }

  return true; // ✅ todo lleno
}


  const data = {

    "ID": document.getElementById("id").value,
    "NO. CLIENTE": document.getElementById("CUENTA").value,
    "NO. DCTO. SAP": document.getElementById("numsap").value,
    "NO. CONTRATO": document.getElementById("numcontrato").value,
   "TIPO CONTRATO": document.getElementById("tipoContrato").selectedOptions[0].text,
    "RAZÓN SOCIAL": document.getElementById("businessName").value,
    "NOMBRE COMERCIAL": document.getElementById("nomcom").value,
    "CONCEPTO": document.getElementById("instrumento").selectedOptions[0].text,
    "UNIDADES/ELEMENTOS/M2": document.getElementById("unidades").value,
     "TA. * UNIDADES/ELEMENTOS/M2": (parseFloat(document.getElementById("tarifa").value) * parseFloat(document.getElementById("unidades").value) || 0).toFixed(2),
    "INICIO VIGENCIA": document.getElementById("fecha-inicio").value,
    "FIN VIGENCIA": document.getElementById("fecha-fin").value,
     "DÍAS X VENCER": Math.floor(extraerNumero(document.getElementById("porvencer").innerText)),
 "DÍAS VENCIDOS": Math.floor(extraerNumero(document.getElementById("vencidos").innerText)),
  "STATUS DE VIGENCIA": extraerTexto(document.getElementById("estatus").innerText),
    "TARIFA": document.getElementById("tarifa").value,
    "% MTTO": document.getElementById("mantenimientoFijo").value,
    "% LUZ": document.getElementById("alicuotas").value,
    "% AGUA": document.getElementById("aguaFijo").value,
    "$ MTTO": extraerNumero(document.getElementById("mantenimientoResultado").innerText),
    "$ LUZ": extraerNumero(document.getElementById("luzResultado").innerText),
    "$ AGUA": extraerNumero(document.getElementById("aguaResultado").innerText),
    "SUBTOTAL": extraerNumero(document.getElementById("subtotal").innerText),
    "% INCENTIVO": document.getElementById("incentivo").value,
    "% VARIABLE": document.getElementById("aguaVariable").value,
    "% PENALIZACIÓN": document.getElementById("penalizacionContrato").value,
    
    "VIGENCIA (DÍAS)": Math.floor(extraerNumero(document.getElementById("vigencia").innerText)),
       "TIPO VIGENCIA": document.getElementById("tipovigencia").value,
          "PREMISA": document.getElementById("premisa").selectedOptions[0].text,
      "BASE DE PREMISA": document.getElementById("basepremisa").value,
      "PERIORICIDAD": document.getElementById("perioricidad").selectedOptions[0].text,
 "METODOLOGÍA DE ACTUALIZACIÓN": document.getElementById("metact").selectedOptions[0].text,
  "PROXIMA FECHA DE ACTUALIZACIÓN": document.getElementById("fechaactualizacion").value,
"C. ACTUALIZACIÓN": document.getElementById("cactualizacion").value,
"COMUNICADO": document.getElementById("comunicado").value,
 "INTERES": document.getElementById("intereses").selectedOptions[0].text,
    "DIAS DE CRÉDITO": document.getElementById("dcredito").value,
    "GARANTÍA": document.getElementById("tgar").selectedOptions[0].text,
    "MONTO GARANTÍA": extraerNumero(document.getElementById("garantiaResultado").innerText),
    "OBSERVACIONES": document.getElementById("observaciones").value,
    "OBJETO": document.getElementById("objeto").value,   

    "TOTAL": extraerNumero(document.getElementById("total").innerText),
    "CORREO ELECTRÓNICO SAP": document.getElementById("CORREO").value,
  "UBICACIÓN": document.getElementById("ubicacion").selectedOptions[0].text,
   "DETALLE DE UBICACIÓN": document.getElementById("detubi").selectedOptions[0].text,
   "ENLACE": document.getElementById("enlace").value,
    "CORREO": document.getElementById("CORREO").value,

      "ESTATUS DE FACTURACIÓN": document.getElementById("estatusfac").selectedOptions[0].text,

  };
/*url a actualizar de apps script de contratos aqui y en modificar */
  fetch("https://script.google.com/macros/s/AKfycbwdCdlclZCH8UjHwkMJypioA-n7M1h2s5CaFWMXkLrENbUmbrt7QVrA0KRxRnblpnkm8Q/exec", {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
.then(() => {
  Swal.fire({
    icon: 'success',
    title: '¡Enviado!',
    text: 'Los datos se han guardado correctamente en Google Sheets.',
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false
  });
})
.catch(err => {
  console.error("Error al enviar", err);
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Ocurrió un error al enviar los datos.',
    showConfirmButton: true
  });
});

});
