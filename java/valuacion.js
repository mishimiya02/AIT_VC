
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
                const nombre = document.getElementById('nombre').value;
                const numeroContrato = document.getElementById('numero-contrato').value;
                const fechaInicio = new Date(document.getElementById('fecha-inicio').value);
                fechaInicio.setDate(fechaInicio.getDate() + 1);
                const fechaFin = new Date(document.getElementById('fecha-fin').value);
                const importeBruto = parseFloat(document.getElementById('importe-bruto').value);
                const porcentajeAlicuotas = parseFloat(document.getElementById('alicuotas').value) / 100;
                const porcentajeImpuestos = parseFloat(document.getElementById('impuestos').value) / 100;
                const aplicarInflacion = document.getElementById('inflacion').checked;
                const inflacionAniversarioStr = document.getElementById('inflacion-aniversario').value;
                const mesesPenalizacionStr = document.getElementById('meses-penalizacion').value;
                const porcentajePenalizaciones = parseFloat(document.getElementById('penalizaciones').value) / 100;
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
                    // Establecer la fecha al primer día del mes
                    mesActual.setDate(1);
                    
                    // Calcular inflación si es necesario
                    let inflacionAplicada = 0;
                    if (aplicarInflacion) {
                        // Verificar si es un mes de aniversario
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
                    
                    // Calcular descuento/incentivo si aplica
                    let descuento = 0;
                    if (concederDescuentos && mesesDescuento.includes(i + 1)) {
                        descuento = porcentajeDescuento * importeBrutoActualizado;
                    }
                    
                    // Calcular subtotal
                    const subtotal = importeBrutoActualizado - descuento;
                    
                    // Calcular alicuotas e impuestos
                    const alicuotas = porcentajeAlicuotas * subtotal;
                    const impuestoSobreMonto = porcentajeImpuestos * subtotal;
                    const impuestoSobreAlicuotas = porcentajeImpuestos * alicuotas;
                    
                    // Calcular penalización si el mes está en la lista
                    const esMesPenalizacion = mesesPenalizacion.includes(i + 1);
                    const penalizacion = esMesPenalizacion ? porcentajePenalizaciones * importeBrutoActualizado : 0;
                    
                    // Calcular totales
                    const totalMes = subtotal + alicuotas + impuestoSobreMonto + impuestoSobreAlicuotas + penalizacion;
                    acumuladoTotal += totalMes;
                    
                    // Calcular fecha límite (fecha + 4 días)
                    const fechaLimite = new Date(mesActual);
                    fechaLimite.setDate(fechaLimite.getDate() + 4);
                    
                    // Agregar fila a los datos
                    data.push({
                        consecutivo: i + 1,
                        fecha: new Date(mesActual),
                        fechaLimite: fechaLimite,
                        importeBruto: importeBruto,
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
                    
                    // Mover al siguiente mes
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
                return fecha.toLocaleDateString('es-MX', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
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
                let totalIB = 0;
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
                    totalIB += row.importeBruto;
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
                        <td>${formatearMoneda(row.importeBruto)}</td>
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
                const mesesPenalizacion = document.getElementById('meses-penalizacion');
                if (mesesPenalizacion.value) {
                    const meses = parseMeses(mesesPenalizacion.value);
                    if (meses.length === 0) {
                        mesesPenalizacion.parentElement.classList.add('error');
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


        document.addEventListener('DOMContentLoaded', () => {

    const scrollTop = document.querySelector('.scroll-top');
    const scrollInner = document.querySelector('.scroll-inner');
    const scrollBottom = document.getElementById('scroll-bottom');

    function ajustarScroll() {
        scrollInner.style.width = scrollBottom.scrollWidth + 'px';
    }

    // Sincronizar movimientos
    scrollTop.addEventListener('scroll', () => {
        scrollBottom.scrollLeft = scrollTop.scrollLeft;
    });

    scrollBottom.addEventListener('scroll', () => {
        scrollTop.scrollLeft = scrollBottom.scrollLeft;
    });

    // Ajustar cuando cargue y cuando cambie tamaño
    ajustarScroll();
    window.addEventListener('resize', ajustarScroll);
});