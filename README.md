
 // Mostrar la tabla de resumen
    document.getElementById('tabla-resumen-container').style.display = 'block';
    
    // Actualizar la tabla de resumen
    document.getElementById('resumen-dias-vigencia').textContent = totalDiasVigencia;
    document.getElementById('resumen-importe-bruto').textContent = formatearMoneda(totalIB);
    document.getElementById('resumen-bruto-prorrateado').textContent = formatearMoneda(totalBrutoProrrateado);
    document.getElementById('resumen-monto-actualizado').textContent = formatearMoneda(totalMA);
    document.getElementById('resumen-descuento').textContent = formatearMoneda(totalDT);
    document.getElementById('resumen-subtotal').textContent = formatearMoneda(totalST);
    document.getElementById('resumen-alicuota').textContent = formatearMoneda(totalAL);
    document.getElementById('resumen-impuesto-monto').textContent = formatearMoneda(totalIM);
    document.getElementById('resumen-impuesto-alicuota').textContent = formatearMoneda(totalIA);
    document.getElementById('resumen-penalizacion').textContent = formatearMoneda(totalPE);
    document.getElementById('resumen-mensual').textContent = formatearMoneda(totalTM);
    document.getElementById('resumen-acumulado').textContent = formatearMoneda(totalAT);
    document.getElementById('resumen-monto-pagado').textContent = formatearMoneda(totalPagado);
    document.getElementById('resumen-saldo-contrato').textContent = formatearMoneda(saldoContrato);




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