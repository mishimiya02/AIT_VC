


document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('valuation-form');
            const calcularBtn = document.getElementById('calcular');
            const exportarBtn = document.getElementById('exportar-excel');
            const exportarword = document.getElementById('exportar-word');
            const exportarpdf = document.getElementById('exportar-pdf');     
            const inflacionCheckbox = document.getElementById('inflacion');
            const inflacionAniversarioContainer = document.getElementById('inflacion-aniversario-container');
            const descuentosCheckbox = document.getElementById('descuentos');
            const porcentajeDescuentoContainer = document.getElementById('porcentaje-descuento-container');
            const mesesDescuentoContainer = document.getElementById('meses-descuento-container');
            
            // Mostrar/ocultar el campo de inflación por aniversario según la selección
            inflacionCheckbox.addEventListener('change', function() {
                inflacionAniversarioContainer.style.display = this.checked ? 'block' : 'none';
            });
            
            // Mostrar/ocultar el campo de porcentaje de descuento según la selección
            descuentosCheckbox.addEventListener('change', function() {
                porcentajeDescuentoContainer.style.display = this.checked ? 'block' : 'none';
                mesesDescuentoContainer.style.display = this.checked ? 'block' : 'none';
            });
            
            // Función principal de cálculo
            calcularBtn.addEventListener('click', function() {
                if (!validateForm()) return;
                
                // Obtener valores del formulario
                const nombre = document.getElementById('nombre').value.trim() || "Usuario no especificado";
                const numeroContrato = document.getElementById('numero-contrato').value;
                const fechaInicio = new Date(document.getElementById('fecha-inicio').value);
                fechaInicio.setDate(fechaInicio.getDate() + 1);
                const fechaFin = new Date(document.getElementById('fecha-fin').value);
                const importeBruto = parseFloat(document.getElementById('importe-bruto').value);
                const porcentajeAlicuotas = parseFloat(document.getElementById('alicuotas').value) / 100;
                const porcentajeAlicuotas2 = parseFloat(document.getElementById('alicuotas2').value) / 100;
                const porcentajeAlicuotas3 = parseFloat(document.getElementById('alicuotas3').value) / 100;

                const porcentajeImpuestos = parseFloat(document.getElementById('impuestos').value) / 100;
                const aplicarInflacion = document.getElementById('inflacion').checked;
                const inflacionAniversarioStr = document.getElementById('inflacion-aniversario').value;
                // Por estas (con valores por defecto):
				const mesesPenalizacionStr = document.getElementById('meses-penalizacion').value || ""; // Cadena vacía si no hay valor
				const porcentajePenalizaciones = (parseFloat(document.getElementById('penalizaciones').value) || 0) / 100; // 0% si no hay valor
                
                const mecanismoGarantia = document.getElementById('mecanismo-garantia').value;
                const totalPagado = parseFloat(document.getElementById('total-pagado').value) || 0;
                const concederDescuentos = document.getElementById('descuentos').checked;
                const porcentajeDescuento = parseFloat(document.getElementById('porcentaje-descuento').value) || 0;
                const mesesDescuentoStr = document.getElementById('meses-descuento').value;
                const montoGarantiaExhibida = parseFloat(document.getElementById('monto-garantia-exhibida').value) || 0;
                
                // Procesar inflación por aniversario si está habilitada
                let inflacionPorAniversario = [];
                if (aplicarInflacion && inflacionAniversarioStr) {
                    inflacionPorAniversario = inflacionAniversarioStr.split(',').map(p => parseFloat(p.trim()) / 100);
                }
                
                // Procesar meses con penalización
                const mesesPenalizacion = parseMeses(mesesPenalizacionStr);
                
                // Procesar meses con descuento
                const mesesDescuento = concederDescuentos ? parseMeses(mesesDescuentoStr) : [];
                
                // Calcular la duración del contrato en meses
                const mesesContrato = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + 
                                     (fechaFin.getMonth() - fechaInicio.getMonth()) + 1;
                
                // Preparar los datos para el cálculo
				
				
				
				
				
                let data = [];
           
                let inflacionAcumulativa = 0;
                let acumuladoTotal = 0;
                let mesActual = new Date(fechaInicio);
                let aniversarioActual = 0;
                let inflacionAcumuladaAniversario = 0;
                let currentYear = fechaInicio.getFullYear();
                
                for (let i = 0; i < mesesContrato; i++) {
				// Asegura que mesActual siempre sea el primer día del mes
				//mesActual.setDate(1);

				// Inicializar fechas del contrato sin decimales de hora
				const inicioContrato = new Date(document.getElementById('fecha-inicio').value);
				const finContrato = new Date(document.getElementById('fecha-fin').value);

				inicioContrato.setHours(0, 0, 0, 0);
				finContrato.setHours(0, 0, 0, 0);

				const inicioMes = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
				const finMesActual = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);

				inicioMes.setHours(0, 0, 0, 0);
				finMesActual.setHours(0, 0, 0, 0);

				// Calcular días de vigencia
				let diasVigencia;
				if (i === 0) {
				diasVigencia = Math.floor((finMesActual - inicioContrato) / (1000 * 60 * 60 * 24)) ;
				} else if (i === mesesContrato - 1) {
				diasVigencia = Math.floor((finContrato - inicioMes) / (1000 * 60 * 60 * 24)) + 2;
				} else {
				diasVigencia = finMesActual.getDate();
				}
		
		
		//calcular tarifa proporcional
const aplicarAlicuotaCompleta = document.getElementById('alicuota-luz-completa').checked;
const aplicarMantenimientoCompleto = document.getElementById('alicuota-mantenimiento-completa').checked;
const aplicarAguaCompleto = document.getElementById('alicuota-agua-completa').checked;


const importeBrutoProrrateado = aplicarAlicuotaCompleta
    ? importeBruto  // Usa el importe completo sin prorrateo
    : calcularImporteBrutoProrrateado(importeBruto, diasVigencia, mesActual);


function calcularImporteBrutoProrrateado(importeBruto, diasVigencia, mesActual) {
    const diasDelMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
    return (importeBruto / diasDelMes) * diasVigencia;
}

		

		
    // Calcular inflación si es necesario
 // Calcular inflación si es necesario
let inflacionAplicada = 0;

if (aplicarInflacion && inflacionPorAniversario.length > 0) {
    // Verifica si estamos en el mes aniversario
    if ((i + 1) % 12 === 0) {  // cada 12 meses
        aniversarioActual++; // 1 para año 1, 2 para año 2, etc.
        if (aniversarioActual <= inflacionPorAniversario.length) {
            const inflacionAniversario = inflacionPorAniversario[aniversarioActual - 1];
            inflacionAplicada = importeBrutoProrrateado * inflacionAniversario;
            inflacionAcumuladaAniversario += inflacionAplicada;
        }
    }
}


// Calcular el monto actualizado con el importe prorrateado
const importeBrutoActualizado = importeBrutoProrrateado + inflacionAcumuladaAniversario;


    // Calcular descuento
    let descuento = 0;
    if (concederDescuentos && mesesDescuento.includes(i + 1)) {
        descuento = (porcentajeDescuento * importeBrutoActualizado)/100;
    }

    const subtotal = importeBrutoActualizado - descuento;
const diasDelMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();

const alicuotas = porcentajeAlicuotas * subtotal;

const alicuotas2 = importeBrutoProrrateado * porcentajeAlicuotas2;
const alicuotas3 = importeBrutoProrrateado * porcentajeAlicuotas3;



    const impuestoSobreMonto = porcentajeImpuestos * subtotal;
    const impuestoSobreAlicuotas = (alicuotas + alicuotas2 + alicuotas3) * 0.16;
    const esMesPenalizacion = mesesPenalizacion.includes(i + 1);
    const penalizacion = (mesesPenalizacion.length > 0 && esMesPenalizacion) ? porcentajePenalizaciones * importeBrutoActualizado : 0;
   const totalMes = subtotal
               + alicuotas        // luz
               + alicuotas2       // mantenimiento
               + alicuotas3       // agua
               + impuestoSobreMonto
               + impuestoSobreAlicuotas
               + penalizacion;

   

    const fechaLimite = new Date(mesActual);
    fechaLimite.setDate(fechaLimite.getDate() + 4);
	
	
		//funcion para formatear la fecha // Primero añade esta función auxiliar (puede ir al inicio de tu script)
function parseDateInput(inputValue) {
    if (!inputValue) return new Date(); // Fallback por si no hay valor
    
    const parts = inputValue.split('-');
    // Asegúrate de que el mes sea base 0 (enero = 0)
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

// Luego modifica tu código original:
let fechaMostrada;

if (i === 0) {
    fechaMostrada = parseDateInput(document.getElementById('fecha-inicio').value);
    fechaMostrada.setHours(0, 0, 0, 0);
} else if (i === mesesContrato - 1) {
    fechaMostrada = parseDateInput(document.getElementById('fecha-fin').value);
    fechaMostrada.setHours(0, 0, 0, 0);
} else {
    fechaMostrada = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
    fechaMostrada.setHours(0, 0, 0, 0);
}

acumuladoTotal += totalMes;
    // Guardar los datos del mes
    data.push({
        consecutivo: i + 1,	
		fecha: fechaMostrada,
        fechaLimite: fechaLimite,
        diasVigencia: diasVigencia,
        importeBruto: importeBruto,
		importeBrutoProrrateado: importeBrutoProrrateado, /*tarifa proporcional*/

        inflacionAnual: inflacionAplicada,
        inflacionAcumulativa: inflacionAcumuladaAniversario,
        montoActualizado: importeBrutoActualizado,
        descuento: descuento,
        subtotal: subtotal,
        alicuotas: alicuotas,
        alicuotas2: alicuotas2,
        alicuotas3: alicuotas3,
        impuestoSobreMonto: impuestoSobreMonto,
        impuestoSobreAlicuotas: impuestoSobreAlicuotas,
        penalizacion: penalizacion,
        totalMes: totalMes,
        acumuladoTotal: acumuladoTotal
    });

    // Avanzar al siguiente mes
    mesActual.setMonth(mesActual.getMonth() + 1);
}

                
                // Calcular garantías según el mecanismo seleccionado
                const garantias = [];
                const valorMensual = data[0] ? data[0].totalMes : 0;
                
                if (mecanismoGarantia === 'fianza') {
                    garantias.push({
                        tipo: 'Fianza',
                        valor: valorMensual * 12,
                        montoExhibido: montoGarantiaExhibida,
                        saldo: valorMensual * 12 - montoGarantiaExhibida
                    });
                } else if (mecanismoGarantia === 'deposito') {
                    garantias.push({
                        tipo: 'Depósito en Garantía',
                        valor: valorMensual * 3,
                        montoExhibido: montoGarantiaExhibida,
                        saldo: valorMensual * 3 - montoGarantiaExhibida
                    });
                }
                
                // Calcular valor total del contrato y saldo
                const valorTotalContrato = acumuladoTotal;
                const saldoContrato = valorTotalContrato - totalPagado;
                
                // Formatear y mostrar los resultados
                mostrarResultados(data, garantias, nombre, numeroContrato, valorTotalContrato, saldoContrato, totalPagado);
                
// Guardamos en una variable global para futura comparación
window.ultimaValuacionCalculada = {
    nombre,
    contrato: numeroContrato,
    valorTotal: valorTotalContrato,
    data
};





                // Mostrar botón de exportar a Excel
                exportarBtn.style.display = 'inline-block';
                exportarword.style.display = 'inline-block';
                exportarpdf.style.display = 'inline-block';
                
                // Mostrar gráficos
                mostrarGraficos(data);
            });
            
            // Función para formatear los números como moneda
        function formatearMoneda(valor) {
        const num = Number(valor);
        return isNaN(num) ? '$0.00' : num.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
        });
        }

            
            // Función para formatear fechas
            function formatearFecha(fecha) {
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            return `${dia}/${mes}/${anio}`;
        }

            
            // Función principal para mostrar resultados
            function mostrarResultados(data, garantias, nombre, numeroContrato, valorTotalContrato, saldoContrato, totalPagado) {
                const resultadosDiv = document.getElementById('resultados');
                const cuerpoTabla = document.getElementById('cuerpo-tabla');
                const tablaGarantia = document.getElementById('garantia-tabla');
                const userContract = document.getElementById('user-contract');
                const userContractRepeat = document.getElementById('user-contract-repeat');
                const totalImporteBruto = document.getElementById('total-importe-bruto');
                const totalMontoActualizado = document.getElementById('total-monto-actualizado');
                const totalAlicuota = document.getElementById('total-alicuota');
                const totalImpuestoMonto = document.getElementById('total-impuesto-monto');
                const totalImpuestoAlicuota = document.getElementById('total-impuesto-alicuota');
                const totalPenalizacion = document.getElementById('total-penalizacion');
                const totalDescuento = document.getElementById('total-descuento');
                const totalSubtotal = document.getElementById('total-subtotal');
                const totalMensual = document.getElementById('total-mensual');
                const totalAcumulado = document.getElementById('total-acumulado');
                const montoPagadoElement = document.getElementById('monto-pagado');
                const saldoContratoElement = document.getElementById('saldo-contrato');
                const pageNumer = document.getElementById('page-number');
				
                
                // Mostrar información del usuario y contrato
                userContract.textContent = `${nombre} - ${numeroContrato}`;
                userContractRepeat.textContent = `${nombre} - ${numeroContrato}`;
                document.getElementById('contract-info').style.display = 'block';
				
                
                // Limpiar las tablas
                cuerpoTabla.innerHTML = '';
                tablaGarantia.innerHTML = '';
                
                // Calcular totales
				let totalDiasVigencia = 0;

                let totalIB = 0;
				let totalBrutoProrrateado = 0;

/*aqui se inicializan */
                let totalAL1 = 0; // luz
                let totalAL2 = 0; // mantenimiento
                let totalAL3 = 0; // agua


                let totalMA = 0;
                let totalAL = 0;
               
                let totalIM = 0;
                let totalIA = 0;
                let totalPE = 0;
                let totalDT = 0;
                let totalST = 0;
                let totalTM = 0;
                let totalAT = 0;
                
                // Agregar filas a la tabla principal
                data.forEach(row => {
					totalDiasVigencia += row.diasVigencia;
					
					
                    totalIB += row.importeBruto;
					totalBrutoProrrateado += row.importeBrutoProrrateado;

                    totalMA += row.montoActualizado;
                    
                    
                    /*modificaciones alicuotas */
                    totalAL += row.alicuotas || 0;
                    totalAL2 += row.alicuotas2 || 0;
                    totalAL3 += row.alicuotas3 || 0;

                    totalIM += row.impuestoSobreMonto;
                    totalIA += row.impuestoSobreAlicuotas;
                    totalPE += row.penalizacion;
                    totalDT += row.descuento;
                    totalST += row.subtotal;
                    totalTM += row.totalMes;
                    totalAT = row.acumuladoTotal;
                    
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${row.consecutivo}</td>
                        <td>${formatearFecha(row.fecha)}</td>
                        <td>${formatearFecha(row.fechaLimite)}</td>
						<td>${row.diasVigencia}</td> <!-- ESTA ES LA NUEVA COLUMNA -->
                        <td>${formatearMoneda(row.importeBruto)}</td>
						<td>${formatearMoneda(row.importeBrutoProrrateado)}</td>

                        <td>${formatearMoneda(row.inflacionAnual)}</td>
                        <td>${formatearMoneda(row.inflacionAcumulativa)}</td>
                        <td>${formatearMoneda(row.montoActualizado)}</td>
                        <td>${formatearMoneda(row.descuento)}</td>
                        <td>${formatearMoneda(row.subtotal)}</td>
                        <td>${formatearMoneda(row.alicuotas)}</td>
                        <td>${formatearMoneda(row.alicuotas2)}</td>
                        <td>${formatearMoneda(row.alicuotas3)}</td>

                        <td>${formatearMoneda(row.impuestoSobreMonto)}</td>
                        <td>${formatearMoneda(row.impuestoSobreAlicuotas)}</td>
                        <td>${formatearMoneda(row.penalizacion)}</td>
                        <td>${formatearMoneda(row.totalMes)}</td>
                        <td>${formatearMoneda(row.acumuladoTotal)}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                });
                
                // Actualizar totales
				
                totalImporteBruto.textContent = formatearMoneda(totalIB);
                totalMontoActualizado.textContent = formatearMoneda(totalMA);
                totalAlicuota.textContent = formatearMoneda(totalAL);
                totalImpuestoMonto.textContent = formatearMoneda(totalIM);
                totalImpuestoAlicuota.textContent = formatearMoneda(totalIA);
                totalPenalizacion.textContent = formatearMoneda(totalPE);
                totalDescuento.textContent = formatearMoneda(totalDT);
                totalSubtotal.textContent = formatearMoneda(totalST);
                totalMensual.textContent = formatearMoneda(totalTM);
                totalAcumulado.textContent = formatearMoneda(totalAT);
                
                document.getElementById('total-alicuota2').textContent = formatearMoneda(totalAL2);
                document.getElementById('total-alicuota3').textContent = formatearMoneda(totalAL3);
				document.getElementById('total-dias-vigencia').textContent = totalDiasVigencia;
				document.getElementById('total-bruto-prorrateado').textContent = formatearMoneda(totalBrutoProrrateado);


                
                // Mostrar monto pagado y saldo del contrato
                montoPagadoElement.textContent = formatearMoneda(totalPagado);
                saldoContratoElement.textContent = formatearMoneda(saldoContrato);
                




                
                // Agregar tabla de garantías
                if (garantias.length > 0) {
                    let garantiaHTML = '<tr><th>Tipo de Garantía</th><th>Valor de Garantía</th><th>Monto Exhibido/Vigente</th><th>Saldo</th></tr>';
                    garantias.forEach(garantia => {
                        garantiaHTML += `
                            <tr>
                                <td>${garantia.tipo}</td>
                                <td>${formatearMoneda(garantia.valor)}</td>
                                <td>${formatearMoneda(garantia.montoExhibido)}</td>
                                <td>${formatearMoneda(garantia.saldo)}</td>
                            </tr>
                        `;
                    });
                    tablaGarantia.innerHTML = garantiaHTML;
                }
                
                // Mostrar los resultados
                resultadosDiv.style.display = 'block';
            }
            
            // Función para exportar a Excel de manera segura
 exportarBtn.addEventListener('click', async function () {
    const tabla = document.getElementById('tabla-resultados');
    const nombre = document.getElementById('nombre').value.trim() || "Usuario no especificado";
    const numeroContrato = document.getElementById('numero-contrato').value.trim() || "Sin contrato";

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Valuación');

    const columnasTabla = tabla.querySelectorAll('thead th').length;

// Convierte número de columna a letras estilo Excel (A, B, ..., Z, AA, AB, etc.)
function numeroAColumnaExcel(num) {
    let col = '';
    while (num > 0) {
        let modulo = (num - 1) % 26;
        col = String.fromCharCode(65 + modulo) + col;
        num = Math.floor((num - 1) / 26);
    }
    return col;
}

const ultimaCol = numeroAColumnaExcel(columnasTabla);



        // 🏢 Fila principal con nombre de la empresa
    worksheet.mergeCells(`A1:${ultimaCol}1`);
    const tituloEmpresa = worksheet.getCell('A1');
    tituloEmpresa.value = "AEROPUERTO INTERNACIONAL DE TOLUCA";/*esto va a ir hasta arriba */
    tituloEmpresa.font = { name: 'Aptos', size: 25, bold: true };
    tituloEmpresa.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.addRow([]);

    // 🧑‍💼 Nombre
    worksheet.mergeCells(`A4:${String.fromCharCode(64 + 8)}4`);
    const filaNombre = worksheet.getCell('A4');
    filaNombre.value = `Nombre: ${nombre}`;
    filaNombre.font = { name: 'Aptos', bold: true, size: 25 };
    filaNombre.alignment = { horizontal: 'center', vertical: 'middle' };

    // 📄 Contrato
    worksheet.mergeCells(`A5:${String.fromCharCode(64 + 8)}5`);
    const filaContrato = worksheet.getCell('A5');
    filaContrato.value = `Contrato: ${numeroContrato}`;
    filaContrato.font = { name: 'Aptos', italic: true, size: 25 };
    filaContrato.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.addRow([]);

    // 🧩 Encabezado de columnas
    const headers = Array.from(tabla.querySelectorAll('thead th')).map(th => th.textContent.trim());
    const headerRow = worksheet.addRow(headers);

    const tonosAzul = [
        'FF4DA6FF', 'FF3399FF', 'FF1A8CFF', 'FF007FFF', 'FF0066CC',
        'FF4DA6FF', 'FF3399FF', 'FF1A8CFF', 'FF007FFF', 'FF0066CC',
        'FF004C99', 'FF003366', 'FF001A66', 'FF00004D', 'FF000033',
        'FF00001A', 'FF000000'
    ];

    headerRow.eachCell((cell, colNumber) => {
        cell.font = { name: 'Aptos', bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: tonosAzul[(colNumber - 1) % tonosAzul.length] }
        };
        cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    // 📊 Agregar filas de datos
    const rows = tabla.querySelectorAll('tbody tr');
    rows.forEach(htmlRow => {
        const rowData = Array.from(htmlRow.querySelectorAll('td')).map(td => td.textContent.trim());
        const row = worksheet.addRow(rowData);
        row.eachCell(cell => {
            cell.font = { name: 'Aptos', size: 12 };
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'medium' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
    });

    // 📐 Ajustar ancho de columnas
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const text = cell.value ? cell.value.toString() : '';
            maxLength = Math.max(maxLength, text.length);
        });
        column.width = Math.max(maxLength + 2, 12);
    });

    // 📤 Descargar Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'valuacion_contrato.xlsx';
    a.click();
    URL.revokeObjectURL(url);
});



            // Función para parsear meses con formatos de comas y guiones
            function parseMeses(mesesStr) {
                if (!mesesStr) return [];
                
                const meses = [];
                const partes = mesesStr.split(',');
                
                partes.forEach(parte => {
                    const rango = parte.trim().split('-');
                    if (rango.length === 1) {
                        const mes = parseInt(rango[0]);
                        if (!isNaN(mes)) meses.push(mes);
                    } else if (rango.length === 2) {
                        const inicio = parseInt(rango[0]);
                        const fin = parseInt(rango[1]);
                        if (!isNaN(inicio) && !isNaN(fin) && inicio <= fin) {
                            for (let i = inicio; i <= fin; i++) {
                                meses.push(i);
                            }
                        }
                    }
                });
                
                return meses;
            }
            
            // Validación del formulario
            function validateForm() {
                let isValid = true;
                
				
				
				
                // Reiniciar estados de error
                const formGroups = document.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.classList.remove('error');
                });
                
                // Validar campos requeridos
                const requiredFields = document.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.parentElement.classList.add('error');
                        isValid = false;
                    }
                });
                
                // Validar porcentajes
                const percentageFields = document.querySelectorAll('#alicuotas, #impuestos, #penalizaciones, #porcentaje-descuento');
                percentageFields.forEach(field => {
                    if (field.value) {
                        const value = parseFloat(field.value);
                        if (value < 0 || value > 100) {
                            field.parentElement.classList.add('error');
                            isValid = false;
                        }
                    }
                });
                
                // Validar meses con penalización y descuento
                
			// Reemplazar por esta validación solo si hay contenido:
			const mesesPenalizacion = document.getElementById('meses-penalizacion');
			if (mesesPenalizacion.value.trim() !== "") {
			const meses = parseMeses(mesesPenalizacion.value);
			if (meses.length === 0) {
			mesesPenalizacion.parentElement.classList.add('error');
			isValid = false;
			}
			}
			// Para el porcentaje de penalización, mantener solo validación de rango si tiene valor:
			const penalizacionesField = document.getElementById('penalizaciones');
			if (penalizacionesField.value.trim() !== "") {
			const value = parseFloat(penalizacionesField.value);
			if (value < 0 || value > 100) {
			penalizacionesField.parentElement.classList.add('error');
			isValid = false;
			}
		}

                
                const mesesDescuento = document.getElementById('meses-descuento');
                if (mesesDescuento && mesesDescuento.value) {
                    const meses = parseMeses(mesesDescuento.value);
                    if (meses.length === 0) {
                        mesesDescuento.parentElement.classList.add('error');
                        isValid = false;
                    }
                }
                
                // Validar inflación por aniversario
                const inflacionAniversario = document.getElementById('inflacion-aniversario');
                if (inflacionAniversario && inflacionAniversario.value) {
                    const porcentajes = inflacionAniversario.value.split(',');
                    if (!porcentajes.every(p => !isNaN(parseFloat(p.trim())))) {
                        inflacionAniversario.parentElement.classList.add('error');
                        isValid = false;
                    }
                }
                
                return isValid;
            }
            
            // Función para mostrar gráficos
            function mostrarGraficos(data) {
                const chartsContainer = document.getElementById('charts-container');
                chartsContainer.style.display = 'grid';
                
                // Preparar datos para los gráficos
                const meses = data.map(row => `Mes ${row.consecutivo}`);
                const totalesMensuales = data.map(row => row.totalMes);
                const inflaciones = data.map(row => row.inflacionAcumulativa);
                
                // Gráfico de Evolución del Total Mensual
                const ctx1 = document.getElementById('totalMensualChart').getContext('2d');
                new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: meses,
                        datasets: [ {
                            label: 'Total Mensual',
                            data: totalesMensuales,
                            borderColor: '#003366',
                            backgroundColor: 'rgba(0, 51, 102, 0.1)',
                            tension: 0.4,
                            fill: true
                        } ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Evolución del Total Mensual'
                            }
                        }
                    }
                });
                
                // Gráfico de Inflación Acumulativa por Mes
                const ctx3 = document.getElementById('inflacionChart').getContext('2d');
                new Chart(ctx3, {
                    type: 'line',
                    data: {
                        labels: meses,
                        datasets: [ {
                            label: 'Inflación Acumulativa',
                            data: inflaciones,
                            borderColor: '#28a745',
                            backgroundColor: 'rgba(40, 167, 69, 0.1)',
                            tension: 0.4,
                            fill: true
                        } ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Evolución de la Inflación Acumulativa'
                            }
                        }
                    }
                });
            }
            // Guardar valuación actual (máximo 2)
document.getElementById('guardar-valuacion').addEventListener('click', function () {
    const nombre = document.getElementById('nombre').value.trim() || "Sin nombre";
    const contrato = document.getElementById('numero-contrato').value.trim() || "Sin contrato";

    if (!window.ultimaValuacionCalculada) {
        alert("Primero calcula la valuación.");
        return;
    }

    const valuaciones = JSON.parse(localStorage.getItem('valuaciones')) || [];

    // Solo conservar las 2 más recientes
    if (valuaciones.length >= 2) valuaciones.shift();

    valuaciones.push({
        timestamp: Date.now(),
        nombre,
        contrato,
        total: formatearMoneda(ultimaValuacionCalculada.valorTotal),
        datos: ultimaValuacionCalculada // toda la info detallada
    });

    localStorage.setItem('valuaciones', JSON.stringify(valuaciones));
    alert("Valuación guardada exitosamente.");
});

// Comparar 2 valuaciones guardadas
document.getElementById('comparar-valuaciones').addEventListener('click', function () {
    const valuaciones = JSON.parse(localStorage.getItem('valuaciones')) || [];
    if (valuaciones.length < 2) {
        alert("Se necesitan 2 valuaciones guardadas para comparar.");
        return;
    }

    const [v1, v2] = valuaciones;
    const d1 = v1.datos.data;
    const d2 = v2.datos.data;
    const longitud = Math.max(d1.length, d2.length);

    const formatea = n => formatearMoneda(n || 0);

    // Comparación general
    let html = `
        <h3>Resumen General</h3>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 30px;">
            <thead>
                <tr style="background-color: #333; color: white;">
                    <th>Campo</th>
                    <th>Valuación 1 (${v1.contrato})</th>
                    <th>Valuación 2 (${v2.contrato})</th>
                    <th>Diferencia</th>
                </tr>
            </thead>
            <tbody>
                ${compararCampo("Total Acumulado", v1.total, v2.total)}
                ${compararCampo("Inflación acumulada final", formatea(d1.at(-1).inflacionAcumulativa), formatea(d2.at(-1).inflacionAcumulativa))}
                ${compararCampo("Total Descuento", formatea(suma(d1, 'descuento')), formatea(suma(d2, 'descuento')))}
                ${compararCampo("Total Penalización", formatea(suma(d1, 'penalizacion')), formatea(suma(d2, 'penalizacion')))}
                ${compararCampo("Total Alicuotas", formatea(suma(d1, 'alicuotas')), formatea(suma(d2, 'alicuotas')))}
   
                ${compararCampo("Total Alicuotas 2", formatea(suma(d1, 'alicuotas2')), formatea(suma(d2, 'alicuotas2')))}
                ${compararCampo("Total Alicuotas 3", formatea(suma(d1, 'alicuotas3')), formatea(suma(d2, 'alicuotas3')))}

            
                </tbody>


        </table>
    `;

    // Comparación mes por mes
    html += `
        <h3>Comparación Mes por Mes</h3>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead>
                <tr style="background-color: #444; color: white;">
                    <th>Mes</th>
                    <th>Total Mes (V1)</th>
                    <th>Total Mes (V2)</th>
                    <th>Diferencia</th>

                    <th>Importe Bruto (V1)</th>
                    <th>Importe Bruto (V2)</th>
                    <th>Diferencia</th>

                    <th>Inflación Acum. (V1)</th>
                    <th>Inflación Acum. (V2)</th>
                    <th>Diferencia</th>
                    <th>Descuento (V1)</th>
                    <th>Descuento (V2)</th>
                    <th>Diferencia</th>
                    <th>Penalización (V1)</th>
                    <th>Penalización (V2)</th>
                    <th>Diferencia</th>
                     <th>Luz (V1)</th>
                    <th>Luz (V2)</th>
                    <th>Diferencia</th>
                   <th>Mantenimiento (V1)</th>
                    <th>Mantenimiento (V2)</th>
                    <th>Diferencia</th> 
                   <th>Agua (V1)</th>
                    <th>Agua (V2)</th>
                    <th>Diferencia</th>
                    <th>Diferencia Bruto + Servicios</th>

                </tr>
            </thead>
            <tbody>
    `;

// Calcular totales
const totalizador = (arr, campo) => arr.reduce((a, b) => a + (b?.[campo] || 0), 0);

const totV1 = {
    totalMes: totalizador(d1, 'totalMes'),
    importeBruto: totalizador(d1, 'importeBruto'),

    inflacion: totalizador(d1, 'inflacionAcumulativa'),
    descuento: totalizador(d1, 'descuento'),
    penalizacion: totalizador(d1, 'penalizacion'),
    luz: totalizador(d1, 'alicuotas'),
    mantenimiento: totalizador(d1, 'alicuotas2'),
    agua: totalizador(d1, 'alicuotas3'),
};

const totV2 = {
    totalMes: totalizador(d2, 'totalMes'),
    importeBruto: totalizador(d2, 'importeBruto'),

    inflacion: totalizador(d2, 'inflacionAcumulativa'),
    descuento: totalizador(d2, 'descuento'),
    penalizacion: totalizador(d2, 'penalizacion'),
    luz: totalizador(d2, 'alicuotas'),
    mantenimiento: totalizador(d2, 'alicuotas2'),
    agua: totalizador(d2, 'alicuotas3'),
};
let totalSumaDiferencias = 0;


    for (let i = 0; i < longitud; i++) {
  

      const mes = `Mes ${i + 1}`;
        const v1m = d1[i] || {};
        const v2m = d2[i] || {};
const difAgua = (v2m.alicuotas3 || 0) - (v1m.alicuotas3 || 0);
const difLuz = (v2m.alicuotas || 0) - (v1m.alicuotas || 0);
const difMantenimiento = (v2m.alicuotas2 || 0) - (v1m.alicuotas2 || 0);


        const td1 = v1m.totalMes || 0;
        const td2 = v2m.totalMes || 0;
        
        const ib1 = v1m.importeBruto || 0;
        const ib2 = v2m.importeBruto || 0;

        const ia1 = v1m.inflacionAcumulativa || 0;
        const ia2 = v2m.inflacionAcumulativa || 0;
        const de1 = v1m.descuento || 0;
        const de2 = v2m.descuento || 0;
        const pe1 = v1m.penalizacion || 0;
        const pe2 = v2m.penalizacion || 0;
  const diffImporteBruto = (v2m.importeBruto || 0) - (v1m.importeBruto || 0);
const diffLuz = (v2m.alicuotas || 0) - (v1m.alicuotas || 0);
const diffMantenimiento = (v2m.alicuotas2 || 0) - (v1m.alicuotas2 || 0);
const diffAgua = (v2m.alicuotas3 || 0) - (v1m.alicuotas3 || 0);

const sumaDiferencias = diffImporteBruto + diffLuz + diffMantenimiento + diffAgua;

totalSumaDiferencias += sumaDiferencias;



        html += `
            <tr>
                <td>${mes}</td>
                <td>${formatea(td1)}</td>
                <td>${formatea(td2)}</td>
                <td>${formatea(td2 - td1)}</td>

                <td>${formatea(ib1)}</td>
                <td>${formatea(ib2)}</td>   
                <td>${formatea(ib2 - ib1)}</td>


                <td>${formatea(ia1)}</td>
                <td>${formatea(ia2)}</td>
                <td>${formatea(ia2 - ia1)}</td>

                <td>${formatea(de1)}</td>
                <td>${formatea(de2)}</td>
                <td>${formatea(de2 - de1)}</td>

                <td>${formatea(pe1)}</td>
                <td>${formatea(pe2)}</td>
                <td>${formatea(pe2 - pe1)}</td>
                
                <td>${formatea(v1m.alicuotas || 0)}</td>
                <td>${formatea(v2m.alicuotas || 0)}</td>
                <td>${formatea((v2m.alicuotas || 0) - (v1m.alicuotas || 0))}</td>


                <td>${formatea(v1m.alicuotas2 || 0)}</td>

                <td>${formatea(v2m.alicuotas2 || 0)}</td>
                <td>${formatea((v2m.alicuotas2 || 0) - (v1m.alicuotas2 || 0))}</td>
                <td>${formatea(v1m.alicuotas3 || 0)}</td>
                <td>${formatea(v2m.alicuotas3 || 0)}</td>
                <td>${formatea((v2m.alicuotas3 || 0) - (v1m.alicuotas3 || 0))}</td>

                    <td>${formatea(sumaDiferencias)}</td>





            </tr>
        `;
    }


    

html += `
<tr style="background-color: #ddd; font-weight: bold;">
    <td>TOTALES</td>
    <td>${formatea(totV1.totalMes)}</td>
    <td>${formatea(totV2.totalMes)}</td>
    <td>${formatea(totV2.totalMes - totV1.totalMes)}</td>

<td>${formatea(totV1.importeBruto)}</td>
<td>${formatea(totV2.importeBruto)}</td>
<td>${formatea(totV2.importeBruto - totV1.importeBruto)}</td>


    <td>${formatea(totV1.inflacion)}</td>
    <td>${formatea(totV2.inflacion)}</td>
    <td>${formatea(totV2.inflacion - totV1.inflacion)}</td>

    <td>${formatea(totV1.descuento)}</td>
    <td>${formatea(totV2.descuento)}</td>
    <td>${formatea(totV2.descuento - totV1.descuento)}</td>

    <td>${formatea(totV1.penalizacion)}</td>
    <td>${formatea(totV2.penalizacion)}</td>
    <td>${formatea(totV2.penalizacion - totV1.penalizacion)}</td>

    <td>${formatea(totV1.luz)}</td>
    <td>${formatea(totV2.luz)}</td>
    <td>${formatea(totV2.luz - totV1.luz)}</td>

    <td>${formatea(totV1.mantenimiento)}</td>
    <td>${formatea(totV2.mantenimiento)}</td>
    <td>${formatea(totV2.mantenimiento - totV1.mantenimiento)}</td>

    <td>${formatea(totV1.agua)}</td>
    <td>${formatea(totV2.agua)}</td>
    <td>${formatea(totV2.agua - totV1.agua)}</td>
    <td>${formatea(totalSumaDiferencias)}</td>

</tr>
`;




    html += '</tbody></table>';

    document.getElementById('comparacion-contenido').innerHTML = html;
    document.getElementById('modal-comparacion').style.display = 'block';

    // Helpers
    function suma(arr, campo) {
        return arr.reduce((a, b) => a + (b[campo] || 0), 0);
    }

    function compararCampo(nombre, v1val, v2val) {
        const n1 = parseFloat(v1val.toString().replace(/[$,]/g, '')) || 0;
        const n2 = parseFloat(v2val.toString().replace(/[$,]/g, '')) || 0;
        const dif = n2 - n1;
        return `<tr>
            <td>${nombre}</td>
            <td>${formatea(n1)}</td>
            <td>${formatea(n2)}</td>
            <td>${formatea(dif)}</td>
        </tr>`;
    }
});


// Mostrar resumen de valuaciones guardadas al cargar
document.addEventListener('DOMContentLoaded', function () {
    mostrarResumenValuaciones();
});

// Función para mostrar resumen de valuaciones guardadas
function mostrarResumenValuaciones() {
    const contenedor = document.getElementById('resumen-valuaciones');
    const valuaciones = JSON.parse(localStorage.getItem('valuaciones')) || [];

    if (valuaciones.length === 0) {
        contenedor.innerHTML = '<p>No hay valuaciones guardadas.</p>';
        return;
    }

    let html = '<h3>Valuaciones Guardadas</h3><table border="1" style="width: 100%; text-align: center; border-collapse: collapse;">';
    html += '<tr><th>#</th><th>Contrato</th><th>Nombre</th><th>Total</th><th>Fecha guardado</th></tr>';

    valuaciones.forEach((val, i) => {
        const fecha = new Date(val.timestamp).toLocaleString();
        html += `<tr>
            <td>${i + 1}</td>
            <td>${val.contrato}</td>
            <td>${val.nombre}</td>
            <td>${val.total}</td>
            <td>${fecha}</td>
        </tr>`;
    });

    html += '</table>';
    contenedor.innerHTML = html;

    // Si hay 2, habilitar botón de comparación
    if (valuaciones.length === 2) {
        document.getElementById('comparar-valuaciones').disabled = false;
    }
}



function limpiarNumero(str) {
    return Number((str || '').toString().replace(/[^0-9.-]+/g, '')) || 0;
}










document.getElementById('exportar-comparacion-excel').addEventListener('click', async function () {
    const valuaciones = JSON.parse(localStorage.getItem('valuaciones')) || [];
    if (valuaciones.length < 2) {
        alert("No hay suficientes valuaciones para exportar.");
        return;
    }

    const [v1, v2] = valuaciones;
    const d1 = v1.datos.data;
    const d2 = v2.datos.data;
    const longitud = Math.max(d1.length, d2.length);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Comparación');

    // Encabezado
    ws.mergeCells('A1:M1');
    ws.getCell('A1').value = 'Comparación de Valuaciones';
    ws.getCell('A1').font = { size: 16, bold: true };
    ws.getCell('A1').alignment = { horizontal: 'center' };

    // Subtítulo
ws.mergeCells('A2:M2');
ws.getCell('A2').value = 'Cálculo de retroactivos';
ws.getCell('A2').font = { size: 12, italic: true };
ws.getCell('A2').alignment = { horizontal: 'center' };


    // Resumen general
    ws.addRow([]);
    ws.addRow(['Campo', 'Valuación 1', 'Valuación 2', 'Diferencia']);

const limpiarNumero = str => Number((str || '').toString().replace(/[^0-9.-]+/g, '')) || 0;

const resumen = [
    ['Total Acumulado', limpiarNumero(v1.total), limpiarNumero(v2.total)],
    ['Inflación acumulada final',
        limpiarNumero(d1.at(-1)?.inflacionAcumulativa),
        limpiarNumero(d2.at(-1)?.inflacionAcumulativa)],

    ['Importe Bruto Total',
    suma(d1, 'importeBruto'),
    suma(d2, 'importeBruto')],
 
   
    ['Total Descuento',
        suma(d1, 'descuento'),
        suma(d2, 'descuento')],
    ['Total Penalización',
        suma(d1, 'penalizacion'),
        suma(d2, 'penalizacion')],
    ['Total Luz ',
        suma(d1, 'alicuotas'),
        suma(d2, 'alicuotas')],
    ['Total Mantenimiento',
        suma(d1, 'alicuotas2'),
        suma(d2, 'alicuotas2')],
    ['Total Agua ',
        suma(d1, 'alicuotas3'),
        suma(d2, 'alicuotas3')]
];


resumen.forEach(([campo, v1val, v2val]) => {
    const n1 = parseFloat(v1val) || 0;
    const n2 = parseFloat(v2val) || 0;
    const dif = n2 - n1;

    const row = ws.addRow([campo, n1, n2, dif]);

    // Aplicar formato moneda y alineación derecha
    row.eachCell((cell, colNumber) => {
        if (colNumber > 1) {
            cell.numFmt = '"$"#,##0.00';
            cell.alignment = { horizontal: 'right' };
        } else {
            cell.font = { bold: true };
        }
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
});

    // Tabla comparativa por mes
    ws.addRow([]);
ws.addRow([
  'Mes',

  // Bloque V1
  'Mes (V1)', 'Año (V1)', 'Fecha (V1)', 'Total Mes (V1)',   'Importe Bruto (V1)',
'Inflación Acum. (V1)', 'Descuento (V1)', 'Penalización (V1)', 'Agua (V1)', 'Luz (V1)', 'Mantenimiento (V1)',

  // Bloque V2
  'Mes (V2)', 'Año (V2)', 'Fecha (V2)', 'Total Mes (V2)',  'Importe Bruto (V2)',
 'Inflación Acum. (V2)', 'Descuento (V2)', 'Penalización (V2)', 'Agua (V2)', 'Luz (V2)', 'Mantenimiento (V2)',

  // Bloque DIF
/*'Diferencia Total Mensual',*/   'Diferencia Importe Bruto',
'Diferencia Inflación', 'Diferencia Descuento',
  'Diferencia Penalización', 'Diferencia Agua', 'Diferencia Luz', 'Diferencia Mantenimiento',
  'Diferencia Total (Bruto + Servicios)','Diferencia Total (Bruto + Servicios)'

  
]);



/*estilos*/
const headerRow = ws.lastRow;

headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF004C99' } // azul fuerte
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
});

ws.columns.forEach(col => {
    let max = 0;
    col.eachCell(c => {
        if (c.value) max = Math.max(max, c.value.toString().length);
    });
    col.width = max + 2;
});


    for (let i = 0; i < longitud; i++) {
        const v1m = d1[i] || {};
        const v2m = d2[i] || {};

   const fechaV1 = v1m.fecha ? new Date(v1m.fecha) : null;
const fechaV2 = v2m.fecha ? new Date(v2m.fecha) : null;

const mesV1 = fechaV1 ? fechaV1.toLocaleString('es-MX', { month: 'long' }) : '';
const anioV1 = fechaV1 ? fechaV1.getFullYear() : '';
const fechaStrV1 = fechaV1 ? fechaV1.toLocaleDateString('es-MX') : '';

const mesV2 = fechaV2 ? fechaV2.toLocaleString('es-MX', { month: 'long' }) : '';
const anioV2 = fechaV2 ? fechaV2.getFullYear() : '';
const fechaStrV2 = fechaV2 ? fechaV2.toLocaleDateString('es-MX') : '';


const difImporteBruto = (v2m.importeBruto || 0) - (v1m.importeBruto || 0);
const difLuz = (v2m.alicuotas || 0) - (v1m.alicuotas || 0);
const difMantenimiento = (v2m.alicuotas2 || 0) - (v1m.alicuotas2 || 0);
const difAgua = (v2m.alicuotas3 || 0) - (v1m.alicuotas3 || 0);
const sumaDiferencias = difImporteBruto + difLuz + difMantenimiento + difAgua;


const row = [
  i + 1,

  // Bloque V1
  mesV1, anioV1, fechaStrV1,
  v1m.totalMes || 0,
  v1m.importeBruto || 0,
  v1m.inflacionAcumulativa || 0,
  v1m.descuento || 0,
  v1m.penalizacion || 0,
  v1m.alicuotas3 || 0, // Agua
  v1m.alicuotas || 0,  // Luz
  v1m.alicuotas2 || 0, // Mantenimiento

  // Bloque V2
  mesV2, anioV2, fechaStrV2,
  v2m.totalMes || 0,
    v2m.importeBruto || 0,
  v2m.inflacionAcumulativa || 0,
  v2m.descuento || 0,
  v2m.penalizacion || 0,
  v2m.alicuotas3 || 0,
  v2m.alicuotas || 0,
  v2m.alicuotas2 || 0,

  // Diferencias
  /*(v2m.totalMes || 0) - (v1m.totalMes || 0),*/
    (v2m.importeBruto || 0) - (v1m.importeBruto || 0),
  (v2m.inflacionAcumulativa || 0) - (v1m.inflacionAcumulativa || 0),
  (v2m.descuento || 0) - (v1m.descuento || 0),
  (v2m.penalizacion || 0) - (v1m.penalizacion || 0),
  (v2m.alicuotas3 || 0) - (v1m.alicuotas3 || 0),
  (v2m.alicuotas || 0) - (v1m.alicuotas || 0),
  (v2m.alicuotas2 || 0) - (v1m.alicuotas2 || 0),
    sumaDiferencias
  
];


        ws.addRow(row);
    }

    // Ajustar columnas
    ws.columns.forEach(col => {
        let max = 0;
        col.eachCell(c => {
            if (c.value) max = Math.max(max, c.value.toString().length);
        });
        col.width = max + 2;
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparacion_valuaciones.xlsx';
    a.click();
    URL.revokeObjectURL(url);

    function suma(arr, campo) {
        return arr.reduce((a, b) => a + (b[campo] || 0), 0);
    }
});


        });
		