// Configuración de Google Sheets
const SPREADSHEET_ID = "1cGJk_Dg2DjT9h2_cH1ScQ5cgCxlPtg2eQXQIzPv79gk";
const SHEET_NAME = "contratos";
const API_KEY = "AIzaSyBE2QwI6eIPWB1unm7nsLX-oqNB26veBsQ";

// Gráficas glo
// Función para obtener todos los datos de Google Sheets
async function getData() {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`);
  const json = await res.json();
  const rows = json.values.slice(1); // Ignorar cabecera
  return rows.map(r => ({
    id: r[1],
    numCliente: r[2],
    numDctSap: r[3],
    numContrato: r[4],
    tipoContrato: r[5],
    concepto: r[8],
    fechaFin: r[12],
    tarifaQ: r[16] || "",
    mantenimiento: r[20] || "",
    luz: r[21] || "",
    agua: r[22] || "",
    estatusAW: r[48] || "",
    estatusAZ: r[51] || ""
  }));
}

// Mostrar datos en tabla
function mostrar(data) {
  const tbody = document.getElementById("tabla");
  const contador = document.getElementById("contador");
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;">Sin resultados</td></tr>`;
    contador.textContent = "Total de registros: 0";
    return;
  }

  data.forEach(r => {
    tbody.innerHTML += `<tr>
      <td>${r.id}</td>
      <td>${r.numCliente}</td>
      <td>${r.numDctSap}</td>
      <td>${r.numContrato}</td>
      <td>${r.tipoContrato}</td>
      <td>${r.concepto}</td>
      <td>${r.fechaFin}</td>
      <td>${r.tarifaQ}</td>
      <td>${r.mantenimiento}</td>
      <td>${r.luz}</td>
      <td>${r.agua}</td>
      <td>${r.estatusAW}</td>
      <td>${r.estatusAZ}</td>
    </tr>`;
  });

  contador.textContent = `Total de registros: ${data.length}`;
}

// Cargar filtros dinámicos
async function cargarFiltros() {
  const data = await getData();

  const tipos = [...new Set(data.map(r => r.tipoContrato).filter(Boolean))];
  const selectTipo = document.getElementById("tipo");
  tipos.forEach(t => selectTipo.innerHTML += `<option value="${t}">${t}</option>`);

  const estAW = [...new Set(data.map(r => r.estatusAW).filter(Boolean))];
  const selectAW = document.getElementById("estatusAW");
  estAW.forEach(e => selectAW.innerHTML += `<option value="${e}">${e}</option>`);

  const estAZ = [...new Set(data.map(r => r.estatusAZ).filter(Boolean))];
  const selectAZ = document.getElementById("estatusAZ");
  estAZ.forEach(e => selectAZ.innerHTML += `<option value="${e}">${e}</option>`);
}

// Filtrar datos según selección
async function filtrar() {
  const tipo = document.getElementById("tipo").value;
  const concepto = document.getElementById("concepto").value.toLowerCase();
  const estatusAW = document.getElementById("estatusAW").value;
  const estatusAZ = document.getElementById("estatusAZ").value;

  const data = await getData();

  const filtrado = data.filter(r => {
    let ok = true;
    if (tipo) ok = ok && r.tipoContrato === tipo;
    if (concepto) ok = ok && r.concepto.toLowerCase().includes(concepto);
    if (estatusAW) ok = ok && r.estatusAW === estatusAW;
    if (estatusAZ) ok = ok && r.estatusAZ === estatusAZ;
    return ok;
  });

  mostrar(filtrado);

  // <-- DEVOLVER el filtrado
  return filtrado;
}

// Inicialización
cargarFiltros().then(filtrar);

// Exportar CSV
function exportarCSV() {
  const dataRows = Array.from(document.querySelectorAll("#tabla tr"));
  if (dataRows.length === 0) {
    Swal.fire('Aviso', 'No hay datos para exportar', 'warning');
    return;
  }

  let csv = '';
  const headers = ["ID","Núm. Cliente","Núm. DCT SAP","Núm. Contrato","Tipo Contrato","Concepto","Fecha Fin","Tarifa","Mantenimiento","Luz","Agua","Estatus AW","Estatus AZ"];
  csv += headers.join(',') + '\n';

  dataRows.forEach(tr => {
    const cols = Array.from(tr.children).map(td => `"${td.textContent.replace(/"/g,'""')}"`);
    csv += cols.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contratos_filtrados.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Exportar XLSX
async function getDataRaw() {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`);
  const json = await res.json();
  return json.values;
}

async function exportarXLSX() {
  Swal.fire({
    title: "Generando archivo...",
    text: "Por favor espera",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  const datos = await getDataRaw();

  if (!datos || datos.length === 0) {
    Swal.fire('Aviso', 'No hay datos para exportar', 'warning');
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(datos);
  XLSX.utils.book_append_sheet(wb, ws, "Hoja Completa");
  XLSX.writeFile(wb, "contratos_completos.xlsx");

  Swal.close();
  Swal.fire('Éxito', 'Se exportó la hoja completa correctamente', 'success');
}

// Función para generar gráficas comparando filtrado vs total
function generarGraficas(filtrado) {
  getData().then(total => {
    const contar = (arr, campo) =>
      arr.reduce((acc, cur) => {
        const val = cur[campo] || "Sin dato";
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});

    // Tipos
    const totalTipos = contar(total, "tipoContrato");
    const filtradoTipos = contar(filtrado, "tipoContrato");
    const labelsTipos = [...new Set([...Object.keys(totalTipos)])];

    if (chartTipo) chartTipo.destroy();
    chartTipo = new Chart(document.getElementById("grafTipo"), {
      type: "bar",
      data: {
        labels: labelsTipos,
        datasets: [
          { label: "Filtrado", data: labelsTipos.map(l => filtradoTipos[l] || 0), backgroundColor: "#0d6efd" },
          { label: "Total", data: labelsTipos.map(l => totalTipos[l] || 0), backgroundColor: "#6c757d" }
        ]
      },
      options: { plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
    });

    // Estatus AZ
    const totalEstatus = contar(total, "estatusAZ");
    const filtradoEstatus = contar(filtrado, "estatusAZ");
    const labelsEstatus = [...new Set([...Object.keys(totalEstatus)])];

    if (chartEstatus) chartEstatus.destroy();
    chartEstatus = new Chart(document.getElementById("grafEstatus"), {
      type: "bar",
      data: {
        labels: labelsEstatus,
        datasets: [
          { label: "Filtrado", data: labelsEstatus.map(l => filtradoEstatus[l] || 0), backgroundColor: "#198754" },
          { label: "Total", data: labelsEstatus.map(l => totalEstatus[l] || 0), backgroundColor: "#6c757d" }
        ]
      },
      options: { plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
    });

    // Estatus AW
    const totalAW = contar(total, "estatusAW");
    const filtradoAW = contar(filtrado, "estatusAW");
    const labelsAW = [...new Set([...Object.keys(totalAW)])];

    if (chartFacturacion) chartFacturacion.destroy();
    chartFacturacion = new Chart(document.getElementById("grafFacturacion"), {
      type: "bar",
      data: {
        labels: labelsAW,
        datasets: [
          { label: "Filtrado", data: labelsAW.map(l => filtradoAW[l] || 0), backgroundColor: "#ffc107" },
          { label: "Total", data: labelsAW.map(l => totalAW[l] || 0), backgroundColor: "#6c757d" }
        ]
      },
      options: { plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
    });
  });
}
let chartTipo, chartEstatus, chartFacturacion;

// Función para abrir el modal y generar gráficas
async function abrirGraficas() {
  const tipo = document.getElementById("tipo").value;
  const concepto = document.getElementById("concepto").value.toLowerCase();
  const estatusAW = document.getElementById("estatusAW").value;
  const estatusAZ = document.getElementById("estatusAZ").value;

  const data = await getData();

  const filtrado = data.filter(r => {
    return (!tipo || r.tipoContrato === tipo) &&
           (!concepto || r.concepto.toLowerCase().includes(concepto)) &&
           (!estatusAW || r.estatusAW === estatusAW) &&
           (!estatusAZ || r.estatusAZ === estatusAZ);
  });

  generarGraficas(filtrado);

  const modal = new bootstrap.Modal(document.getElementById("modalGraficas"));
  modal.show();
}


// Función para generar gráficas comparando filtrado vs total
    // Estatus Facturación AW
    function generarGraficas(data) {

  const contar = (arr, campo) =>
    arr.reduce((acc, cur) => {
      const val = cur[campo] || "Sin dato";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  // === Tipo de contrato ===
  const tipos = contar(data, "tipoContrato");

  if (chartTipo) chartTipo.destroy();
  chartTipo = new Chart(grafTipo, {
    type: "bar",
    data: {
      labels: Object.keys(tipos),
      datasets: [{
        label: "Contratos",
        data: Object.values(tipos),
        backgroundColor: "#0d6efd"
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: "end",
          align: "end",
          font: { weight: "bold" }
        }
      },
      scales: { y: { beginAtZero: true } }
    },
    plugins: [ChartDataLabels]
  });

  // === Estatus ===
  const estatus = contar(data, "estatusAZ");

  if (chartEstatus) chartEstatus.destroy();
  chartEstatus = new Chart(grafEstatus, {
    type: "bar",
    data: {
      labels: Object.keys(estatus),
      datasets: [{
        label: "Contratos",
        data: Object.values(estatus),
        backgroundColor: "#198754"
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        datalabels: { anchor: "end", align: "end" }
      },
      scales: { y: { beginAtZero: true } }
    },
    plugins: [ChartDataLabels]
  });

  // === Estatus Facturación ===
  const fact = contar(data, "estatusAW");

  if (chartFacturacion) chartFacturacion.destroy();
  chartFacturacion = new Chart(grafFacturacion, {
    type: "bar",
    data: {
      labels: Object.keys(fact),
      datasets: [{
        label: "Contratos",
        data: Object.values(fact),
        backgroundColor: "#ffc107"
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        datalabels: { anchor: "end", align: "end" }
      },
      scales: { y: { beginAtZero: true } }
    },
    plugins: [ChartDataLabels]
  });
}

function exportarGraficas() {
  const zip = new JSZip();

  const graficas = [
    { id: "grafTipo", nombre: "tipo_contrato" },
    { id: "grafEstatus", nombre: "estatus" },
    { id: "grafFacturacion", nombre: "estatus_facturacion" }
  ];

  graficas.forEach(g => {
    const canvas = document.getElementById(g.id);
    if (!canvas) return;

    const img = canvas.toDataURL("image/png");
    zip.file(`${g.nombre}.png`, img.split(",")[1], { base64: true });
  });

  zip.generateAsync({ type: "blob" }).then(blob => {
    saveAs(blob, "graficas_contratos.zip");
  });
}