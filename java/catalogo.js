document.addEventListener("DOMContentLoaded", () => {
  const datosUsuario = JSON.parse(localStorage.getItem("datosUsuario")) || {};

  console.log("Datos cargados desde localStorage:", datosUsuario);

  // Llenar los campos
  if (datosUsuario["CUENTA"]) {
    document.getElementById("CUENTA").value = datosUsuario["CUENTA"];
  }

  if (datosUsuario["RAZON SOCIAL"]) {
    document.getElementById("businessName").value = datosUsuario["RAZON SOCIAL"];
  }

  if (datosUsuario["CORREO"]) {
    document.getElementById("CORREO").value = datosUsuario["CORREO"];
  }
});




  const inicio = document.getElementById("fecha-inicio");
  const fin = document.getElementById("fecha-fin");
  const vigencia = document.getElementById("vigencia");
  const porvencer = document.getElementById("porvencer");
  const vencidos = document.getElementById("vencidos");
  const estatus = document.getElementById("estatus");

  function calcularVigencia() {
    if (!inicio.value || !fin.value) return;

    const fechaInicio = new Date(inicio.value);
    const fechaFin = new Date(fin.value);
    const hoy = new Date();

    // Calcular días de vigencia total
    const diffMs = fechaFin - fechaInicio;
    const diasVigencia = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) +1;

    // Calcular días restantes
    const diffRestante = fechaFin - hoy;
    const diasRestantes = Math.ceil(diffRestante / (1000 * 60 * 60 * 24));

    // Mostrar vigencia total
    vigencia.innerHTML = `📅 Vigencia total: <strong>${diasVigencia}</strong> días`;

    // Mostrar estatus según los días restantes
    if (diasRestantes < 0) {
      vencidos.innerHTML = `⛔ Vencido hace <strong>${Math.abs(diasRestantes)}</strong> días`;
      porvencer.innerHTML = "";
      estatus.innerHTML = "<span style='color:red; font-weight:bold;'>ESTATUS: VENCIDO ❌</span>";
    } else if (diasRestantes <= 10) {
      porvencer.innerHTML = `⚠️ Por vencer en <strong>${diasRestantes}</strong> días`;
      vencidos.innerHTML = "";
      estatus.innerHTML = "<span style='color:orange; font-weight:bold;'>ESTATUS: POR VENCER ⚠️</span>";
    } else {
      porvencer.innerHTML = "";
      vencidos.innerHTML = "";
      estatus.innerHTML = "<span style='color:green; font-weight:bold;'>ESTATUS: ACTIVO ✅</span>";
    }
  }

  // Recalcular cada vez que cambien las fechas
  inicio.addEventListener("change", calcularVigencia);
  fin.addEventListener("change", calcularVigencia);


const tarifa = document.getElementById("tarifa");

  const alicuotas = document.getElementById("alicuotas");
  const luzResultado = document.getElementById("luzResultado");

  const mantenimientoFijo = document.getElementById("mantenimientoFijo");
  const mantenimientoResultado = document.getElementById("mantenimientoResultado");

  const aguaFijo = document.getElementById("aguaFijo");
  const aguaResultado = document.getElementById("aguaResultado");

  const subtotalDiv = document.getElementById("subtotal");

  function calcularMontos() {
    const t = parseFloat(tarifa.value) || 0;

    // Luz
    const luzPorcentaje = parseFloat(alicuotas.value) || 0;
    const luzMonto = (t * luzPorcentaje) ;
    luzResultado.innerHTML = `💡 Energía eléctrica: <strong>${luzMonto.toFixed(2)}</strong>`;

    // Mantenimiento
    const mantPorcentaje = parseFloat(mantenimientoFijo.value) || 0;
    const mantMonto = (t * mantPorcentaje) ;
    mantenimientoResultado.innerHTML = `🛠️ Mantenimiento: <strong>${mantMonto.toFixed(2)}</strong>`;

    // Agua
    const aguaPorcentaje = parseFloat(aguaFijo.value) || 0;
    const aguaMonto = (t * aguaPorcentaje) ;
    aguaResultado.innerHTML = `💧 Agua: <strong>${aguaMonto.toFixed(2)}</strong>`;

    // Subtotal
    const subtotal = t + luzMonto + mantMonto + aguaMonto;
    subtotalDiv.innerHTML = `<strong>${subtotal.toFixed(2)}</strong>`;
  }

  // Escuchar cambios en todos los campos
  [tarifa, alicuotas, mantenimientoFijo, aguaFijo].forEach(input => {
    input.addEventListener("input", calcularMontos);
  });


const tgar = document.getElementById("tgar");
const garantiaResultado = document.getElementById("garantiaResultado");
const manualInput = document.getElementById("manualInput");
const montoManual = document.getElementById("montoManual");

const IVA = 0.16;

function calcularGarantia() {
  // Obtener el subtotal del cálculo anterior
  const subtotalText = document.getElementById("subtotal").innerText;
  const subtotal = parseFloat(subtotalText) || 0;
  
  const opcion = tgar.value;
  let resultado = 0;

  manualInput.style.display = "none";

  switch(opcion) {
    case "1": // DGX3
      resultado = (subtotal * (1 + IVA)) * 3;
      break;
    case "2": // FC
      manualInput.style.display = "block";
      resultado = parseFloat(montoManual.value) + subtotal || 0;
      break;
    case "3": // NA
      resultado = subtotal;
      break;
    case "4": // FCX3
      resultado = (subtotal * (1 + IVA)) * 3;
      break;
    case "5": // DGX1
      resultado = (subtotal * (1 + IVA)) * 1;
      break;
    case "6": // FCX12
      resultado = (subtotal * (1 + IVA)) * 12;
      break;
    default:
      resultado = subtotal;
  }

  garantiaResultado.innerHTML = `🔒 Garantía calculada: <strong>${resultado.toFixed(2)}</strong>`;
}

// Event listeners
tgar.addEventListener("change", calcularGarantia);
montoManual.addEventListener("input", calcularGarantia);

// También recalcular cuando cambien los campos que afectan el subtotal
document.getElementById("tarifa").addEventListener("input", function() {
  calcularMontos(); // Primero recalcula el subtotal
  setTimeout(calcularGarantia, 100); // Luego recalcula la garantía
});


const incentivoInput = document.getElementById("incentivo");
const variableInput = document.getElementById("aguaVariable");
const penalizacionInput = document.getElementById("penalizacionContrato");

const totalDiv = document.getElementById("total");

function calcularTotal() {
  // Garantía actual calculada
  const garantiaText = garantiaResultado.innerText.replace(/[^\d.-]/g, "");
  const garantia = parseFloat(garantiaText) || 0;

  // Incentivo (se resta directamente)
  const incentivo = parseFloat(incentivoInput.value) || 0;

  // Variable (% sobre garantía)
  const variablePct = parseFloat(variableInput.value) || 0;
  const variableMonto = (garantia * variablePct) / 100;

  // Penalización (% sobre garantía)
  const penalPct = parseFloat(penalizacionInput.value) || 0;
  const penalMonto = (garantia * penalPct) / 100;

  // Total
  const total = garantia - incentivo + variableMonto + penalMonto;

  totalDiv.innerHTML = `<strong>${total.toFixed(2)}</strong>`;
}

// Escuchar cambios en todos los campos que afectan el total
[incentivoInput, variableInput, penalizacionInput, montoManual, tgar, tarifa, alicuotas, mantenimientoFijo, aguaFijo].forEach(input => {
  input.addEventListener("input", () => {
    calcularMontos();
    calcularGarantia();
    calcularTotal();
  });
});

// Calcular al inicio por si ya hay datos
window.addEventListener("DOMContentLoaded", () => {
  calcularMontos();
  calcularGarantia();
  calcularTotal();
});


document.getElementById("btnResumen").addEventListener("click", () => {
  const datos = {
    
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

  // Renderizar la tabla
  const tbody = document.getElementById("tablaResumen");
  tbody.innerHTML = "";
  for (let [campo, valor] of Object.entries(datos)) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong>${campo}</strong></td><td>${valor || "-"}</td>`;
    tbody.appendChild(tr);
  }

  // Mostrar contenedor
  document.getElementById("resumenContainer").style.display = "block";
});

// Función para extraer solo el número de los textos con emojis
function extraerNumero(texto) {
  const match = texto.match(/[\d,.]+/);
  return match ? match[0] : "0.00";
}

// Función para extraer solo el texto sin emojis
function extraerTexto(texto) {
  return texto.replace(/[^\w\sáéíóúÁÉÍÓÚñÑ():.,]/g, '').trim();
}
// Cálculo automático de unidades * tarifa

// Cálculo automático informativo de unidades * tarifa
document.addEventListener("DOMContentLoaded", function() {
  const unidadesInput = document.getElementById("unidades");
  const tarifam2Input = document.getElementById("tarifam2");
  const totalTarifaDiv = document.getElementById("totalTarifa");
  
  function calcularTotalTarifa() {
    const unidades = parseFloat(unidadesInput.value) || 0;
    const tarifa = parseFloat(tarifam2Input.value) || 0;
    const total = unidades * tarifa;
    
    if (unidades > 0 && tarifa > 0) {
      totalTarifaDiv.innerHTML = `💰 Cálculo: ${unidades} × ${tarifa} = <strong>${total.toFixed(2)}</strong>`;
    } else {
      totalTarifaDiv.innerHTML = "";
    }
  }
  
  unidadesInput.addEventListener("input", calcularTotalTarifa);
  tarifam2Input.addEventListener("input", calcularTotalTarifa);
});


function mostrarMensaje(texto, tipo = "exito") {
  const mensaje = document.getElementById("mensaje");
  
  mensaje.innerText = texto;
  mensaje.style.display = "block";
  
  if(tipo === "exito") {
    mensaje.style.backgroundColor = "#12FF1B"; // verde
  } else if(tipo === "error") {
    mensaje.style.backgroundColor = "#f44336"; // rojo
  } else if(tipo === "info") {
    mensaje.style.backgroundColor = "#2196f3"; // azul
  }

  // Ocultar después de 3 segundos
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 3000);
}
