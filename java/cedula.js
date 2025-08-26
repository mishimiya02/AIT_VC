document.addEventListener('DOMContentLoaded', function() {
    const tipoOptions = document.querySelectorAll('.tipo-option');
    const mesesGarantia = document.getElementById('meses-garantia');
    const mesesInfo = document.getElementById('meses-info');
    const instrumentoSelect = document.getElementById('instrumento');
    const btnGenerarPDF = document.getElementById('generar-pdf');
    let calculosRealizados = false;
    
    // Inicializar meses de garantía
    /*   mesesInfo.textContent = `Meses de garantía establecidos en: ${mesesGarantia.value}`;*/
    
    // Función para cambiar tipo de garantía
    function cambiarTipoGarantia(option) {
        // Remover selección anterior
        document.querySelector('.tipo-option.selected').classList.remove('selected');
        
        // Añadir selección actual
        option.classList.add('selected');
        
        // Marcar el radio button correspondiente
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Actualizar meses de garantía según selección
        const meses = option.getAttribute('data-meses');
        mesesGarantia.value = meses;
        /* mesesInfo.textContent = `Meses de garantía establecidos en: ${meses}`;*/
        
        // Recalcular valores
        calcularValores();
    }
    
    // Función para manejar el cambio en el select de instrumento
    function manejarCambioInstrumento() {
        if (this.value === 'otro') {
            // Si selecciona "OTRO", desbloquear el input de meses
            mesesGarantia.readOnly = false;
            mesesGarantia.style.backgroundColor = '#fff';
            mesesGarantia.style.cursor = 'text';
            // También actualizar las opciones visuales
            cambiarTipoGarantia(document.getElementById('option-deposito'));
        } else {
            // Para otras opciones, bloquear el input
            mesesGarantia.readOnly = true;
            mesesGarantia.style.backgroundColor = '#f0f0f0';
            mesesGarantia.style.cursor = 'not-allowed';
            
            // Sincronizar con las opciones de tipo
            if (this.value === 'fianza') {
                cambiarTipoGarantia(document.getElementById('option-fianza'));
            } else {
                cambiarTipoGarantia(document.getElementById('option-deposito'));
            }
        }
    }
    
    // Añadir event listeners a las opciones
    tipoOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Solo permitir cambiar si no está en modo "OTRO"
            if (instrumentoSelect.value !== 'otro') {
                cambiarTipoGarantia(this);
            }
        });
    });
    
    // Sincronizar el select principal con las opciones de tipo
    instrumentoSelect.addEventListener('change', manejarCambioInstrumento);
    
    // Event listeners para inputs que deben disparar cálculos
    document.getElementById('contraprestacion').addEventListener('input', calcularValores);
    document.getElementById('alicuota').addEventListener('input', calcularValores);
    document.getElementById('iva').addEventListener('input', calcularValores);
    document.getElementById('garantia-vigente').addEventListener('input', calcularValores);
    mesesGarantia.addEventListener('input', calcularValores);
    
    // Función para calcular todos los valores
    function calcularValores() {
        // Obtener valores de los inputs
        const contraprestacion = parseFloat(document.getElementById('contraprestacion').value) || 0;
        const alicuota = parseFloat(document.getElementById('alicuota').value) || 0;
        const iva = parseFloat(document.getElementById('iva').value) || 0;
        const meses = parseFloat(document.getElementById('meses-garantia').value) || 0;
        const garantiaVigente = parseFloat(document.getElementById('garantia-vigente').value) || 0;
        
        // Calcular subtotal
        const subtotal = contraprestacion * (1 + alicuota / 100);
        document.getElementById('subtotal').textContent = subtotal.toFixed(2);

        // Calcular IVA sobre la contraprestación inicial
        const ivaCalculado = contraprestacion * (iva / 100);

        // Calcular contraprestación mensual (subtotal + IVA sobre contraprestación)
        const contraprestacionMensual = subtotal + ivaCalculado;
        document.getElementById('contraprestacion-mensual').textContent = contraprestacionMensual.toFixed(2);
    
        // Calcular valor de la garantía
        const valorGarantia = contraprestacionMensual * meses;
        document.getElementById('valor-garantia').textContent = valorGarantia.toFixed(2);
        
        // Calcular total por garantizar
        const totalGarantizar = Math.max(0, valorGarantia - garantiaVigente);
        document.getElementById('total-garantizar').textContent = totalGarantizar.toFixed(2);
        
        // Habilitar el botón de generar PDF
        calculosRealizados = true;
        btnGenerarPDF.disabled = false;
    }
    
    function generarPDF() {
        if (!calculosRealizados) {
            alert("Por favor, primero realiza los cálculos.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fuente formal (Helvetica es una de las fuentes estándar en PDF)
        doc.setFont("helvetica");
        doc.setTextColor(0, 0, 0); // Negro puro

        // Datos
        const tipoGarantia = document.querySelector('input[name="tipo-garantia"]:checked').value.toUpperCase();
        const contraprestacion = document.getElementById('contraprestacion').value;
        const alicuota = document.getElementById('alicuota').value;
        const subtotal = document.getElementById('subtotal').textContent;
        const iva = document.getElementById('iva').value;
        const contraprestacionMensual = document.getElementById('contraprestacion-mensual').textContent;
        const mesesGarantia = document.getElementById('meses-garantia').value;
        const valorGarantia = document.getElementById('valor-garantia').textContent;
        const garantiaVigente = document.getElementById('garantia-vigente').value;
        const totalGarantizar = document.getElementById('total-garantizar').textContent;

        let y = 20;

        // Encabezado
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text("CÉDULA DE DETERMINACIÓN DEL MONTO A GARANTIZAR", 105, y, { align: 'center' });
        y += 15;
        
        // Línea separadora
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;

        // Función auxiliar para agregar filas con valores alineados a la derecha
        function agregarFila(label, value, isBold = false, isHighlighted = false) {
            doc.setFontSize(11);
            
            if (isHighlighted) {
                doc.setFillColor(240, 240, 240); // Fondo gris claro para destacar
                doc.rect(20, y - 4, 170, 8, "F");
            }
            
            // Texto de la etiqueta
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, isBold ? 'bold' : 'normal');
            doc.text(label, 22, y);
            
            // Valor alineado a la derecha
            doc.setFont(undefined, 'bold');
            doc.text(value, 188, y, { align: 'right' });
            
            y += 8;
        }

        // Secciones
        agregarFila("TIPO DE GARANTÍA:", tipoGarantia, true);
        y += 2; // Espacio adicional
        
        agregarFila("CONTRAPRESTACIÓN MENSUAL BRUTA:", "$" + parseFloat(contraprestacion).toLocaleString('es-MX', { minimumFractionDigits: 2 }), true);
        agregarFila("% ALICUOTAS:", alicuota + "%");
        agregarFila("SUBTOTAL:", "$" + subtotal);
        agregarFila("% IVA:", iva + "%");
        agregarFila("CONTRAPRESTACIÓN MENSUAL:", "$" + contraprestacionMensual, true);
        agregarFila("MESES DE GARANTÍA:", mesesGarantia);
        agregarFila("VALOR DE LA GARANTÍA:", "$" + valorGarantia, true);
        agregarFila("GARANTÍA VIGENTE POR ESTE CONCEPTO:", "$" + parseFloat(garantiaVigente).toLocaleString('es-MX', { minimumFractionDigits: 2 }));
        
        y += 4; // Espacio antes del total
        
        // Total por garantizar (destacado)
        agregarFila("TOTAL POR GARANTIZAR:", "$" + totalGarantizar, true, true);

        y += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text("*SEGÚN TÉRMINOS COMERCIALES, CONTRATO, VIGENCIA Y/O COMÚN ACUERDO ENTRE LAS PARTES.", 20, y);
        y += 5;
        doc.text("EN DEPÓSITOS EN GARANTÍA LA FORMA DE PAGO ES TRANSFERENCIA BANCARIA.", 20, y);
        y += 5;
        doc.text("Documento generado el: " + new Date().toLocaleDateString('es-MX'), 20, y);

        // Guardar
        doc.save("cedula_garantia.pdf");
    }
    
    // Vincular el evento click del botón a la función generarPDF
    btnGenerarPDF.addEventListener('click', generarPDF);
    
    // Calcular valores iniciales
    calcularValores();
});
