
 document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('valuation-form');
            const calcularBtn = document.getElementById('calcular');
            const exportarBtn = document.getElementById('exportar-excel');
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
                let importeBrutoActualizado = importeBruto;
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
                    const importeBrutoProrrateado = calcularImporteBrutoProrrateado(
    importeBruto,
    diasVigencia,
    mesActual
);

function calcularImporteBrutoProrrateado(importeBruto, diasVigencia, mesActual) {
    const diasDelMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
    return (importeBruto / diasDelMes) * diasVigencia;
}

		

		
    // Calcular inflación si es necesario
    let inflacionAplicada = 0;
    if (aplicarInflacion) {
        if (mesActual.getMonth() === fechaInicio.getMonth()) {
            aniversarioActual++;
            if (aniversarioActual <= inflacionPorAniversario.length) {
                const inflacionAniversario = inflacionPorAniversario[aniversarioActual - 1];
                inflacionAplicada = importeBruto * inflacionAniversario;
                inflacionAcumuladaAniversario += inflacionAplicada;
                importeBrutoActualizado = importeBruto + inflacionAcumuladaAniversario;
            }
        }
    }

    // Calcular descuento
    let descuento = 0;
    if (concederDescuentos && mesesDescuento.includes(i + 1)) {
        descuento = porcentajeDescuento * importeBrutoActualizado;
    }

    const subtotal = importeBrutoActualizado - descuento;
    const alicuotas = porcentajeAlicuotas * subtotal;
    const impuestoSobreMonto = porcentajeImpuestos * subtotal;
    const impuestoSobreAlicuotas = porcentajeImpuestos * alicuotas;
    const esMesPenalizacion = mesesPenalizacion.includes(i + 1);
    const penalizacion = (mesesPenalizacion.length > 0 && esMesPenalizacion) ? porcentajePenalizaciones * importeBrutoActualizado : 0;
    const totalMes = subtotal + alicuotas + impuestoSobreMonto + impuestoSobreAlicuotas + penalizacion;
    acumuladoTotal += totalMes;

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
                
                // Mostrar botón de exportar a Excel
                exportarBtn.style.display = 'inline-block';
                
                // Mostrar gráficos
                mostrarGraficos(data);
            });
            
            // Función para formatear los números como moneda
            function formatearMoneda(numero) {
                return numero.toLocaleString('es-MX', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
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
                    totalAL += row.alicuotas;
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
            exportarBtn.addEventListener('click', function() {
                const tabla = document.getElementById('tabla-resultados');
                const worksheet = XLSX.utils.table_to_sheet(tabla);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Valuación");
                
                // Guardar el archivo
                XLSX.writeFile(workbook, "valuacion_contrato.xlsx");
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
        });
		