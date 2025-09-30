document.getElementById("btnEnviar").addEventListener("click", function () {
  const data = {

    "ID": document.getElementById("id").value,
    "NO. CLIENTE": document.getElementById("CUENTA").value,
    "NO. DCTO. SAP": document.getElementById("numsap").value,
    "NO. CONTRATO": document.getElementById("numcontrato").value,
   "TIPO CONTRATO": document.getElementById("tipo").selectedOptions[0].text,
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
          "PREMISA": document.getElementById("premisa").value,
      "BASE DE PREMISA": document.getElementById("basepremisa").value,
      "PERIORICIDAD": document.getElementById("perioricidad").value,
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

  fetch("https://script.google.com/macros/s/AKfycbxwe9T7jFnCnA1xH_Ky8PCmbvZYj-hbv1PvKR75SZofyB22k5iwplGmiVA11A3kNc-m3Q/exec", {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
.then(() => {
  mostrarMensaje("✅ Datos enviados correctamente", "exito");
})
.catch(err => {
  console.error("Error al enviar", err);
  mostrarMensaje("❌ Ocurrió un error al enviar los datos", "error");
});

});
