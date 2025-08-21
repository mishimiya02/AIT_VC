
    document.addEventListener('DOMContentLoaded', function() {
        const tipoOptions = document.querySelectorAll('.tipo-option');
        const mesesGarantia = document.getElementById('meses-garantia');
        const mesesInfo = document.getElementById('meses-info');
        const instrumentoSelect = document.getElementById('instrumento');
        const btnGenerarPDF = document.getElementById('generar-pdf');
        let calculosRealizados = false;
        
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
            mesesInfo.textContent = `Meses de garantía establecidos en: ${meses}`;
            
            // Recalcular valores
            calcularValores();
        }
        
        // Añadir event listeners a las opciones
        tipoOptions.forEach(option => {
            option.addEventListener('click', function() {
                cambiarTipoGarantia(this);
            });
        });
        
        // Sincronizar el select principal con las opciones de tipo
        instrumentoSelect.addEventListener('change', function() {
            if (this.value === 'fianza') {
                cambiarTipoGarantia(document.getElementById('option-fianza'));
            } else {
                cambiarTipoGarantia(document.getElementById('option-deposito'));
            }
        });
        
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
        
        // Función para generar PDF
        function generarPDF() {
            if (!calculosRealizados) {
                alert("Por favor, primero haz clic en CALCULAR para realizar los cálculos.");
                return;
            }
            
            // Inicializar jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Obtener valores del formulario
            const tipoGarantia = document.querySelector('input[name="tipo-garantia"]:checked').value;
            const contraprestacion = document.getElementById('contraprestacion').value;
            const alicuota = document.getElementById('alicuota').value;
            const iva = document.getElementById('iva').value;
            const mesesGarantia = document.getElementById('meses-garantia').value;
            const garantiaVigente = document.getElementById('garantia-vigente').value;
            const subtotal = document.getElementById('subtotal').textContent;
            const contraprestacionMensual = document.getElementById('contraprestacion-mensual').textContent;
            const valorGarantia = document.getElementById('valor-garantia').textContent;
            const totalGarantizar = document.getElementById('total-garantizar').textContent;
            
            // Configuración inicial del PDF
            doc.setFontSize(18);
            doc.text("CÉDULA DE DETERMINACIÓN", 105, 20, { align: 'center' });
            doc.setFontSize(14);
            doc.text("DEL MONTO A GARANTIZAR", 105, 28, { align: 'center' });
            
            // Línea separadora
            doc.setLineWidth(0.5);
            doc.line(20, 35, 190, 35);
            
            // Contenido del PDF
            let yPosition = 45;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text("Tipo de Garantía:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(tipoGarantia.toUpperCase(), 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("Contraprestación Mensual Bruta:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text("$" + parseFloat(contraprestacion).toLocaleString('es-MX', { minimumFractionDigits: 2 }), 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("% Alicuota:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(alicuota + "%", 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("Subtotal:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text("$" + subtotal, 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("% IVA:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(iva + "%", 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("Contraprestación Mensual:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text("$" + contraprestacionMensual, 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("Meses de Garantía:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(mesesGarantia, 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("Valor de la Garantía:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text("$" + valorGarantia, 70, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'bold');
            doc.text("Garantía Vigente:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text("$" + parseFloat(garantiaVigente).toLocaleString('es-MX', { minimumFractionDigits: 2 }), 70, yPosition);
            yPosition += 15;
            
            // Total por garantizar (destacado)
            doc.setFont(undefined, 'bold');
            doc.setFontSize(14);
            doc.text("TOTAL POR GARANTIZAR:", 20, yPosition);
            doc.setTextColor(0, 102, 204); // Color azul
            doc.text("$" + totalGarantizar, 70, yPosition);
            doc.setTextColor(0, 0, 0); // Volver a color negro
            
            // Fecha de generación
            yPosition += 20;
            doc.setFontSize(10);
            doc.setFont(undefined, 'italic');
            doc.text("Documento generado el: " + new Date().toLocaleDateString('es-MX'), 20, yPosition);
            
            // Guardar el PDF
            doc.save('cedula_garantia.pdf');
        }
        
        // Añadir event listeners para recalcular cuando cambien los valores
        document.getElementById('contraprestacion').addEventListener('input', function() {
            calculosRealizados = false;
            btnGenerarPDF.disabled = true;
            calcularValores();
        });
        document.getElementById('alicuota').addEventListener('input', function() {
            calculosRealizados = false;
            btnGenerarPDF.disabled = true;
            calcularValores();
        });
        document.getElementById('iva').addEventListener('input', function() {
            calculosRealizados = false;
            btnGenerarPDF.disabled = true;
            calcularValores();
        });
        document.getElementById('garantia-vigente').addEventListener('input', function() {
            calculosRealizados = false;
            btnGenerarPDF.disabled = true;
            calcularValores();
        });
        
        // Calcular valores iniciales
        calcularValores();
        
        // Prevenir que el usuario modifique manualmente los meses de garantía
        document.getElementById('meses-garantia').addEventListener('keydown', function(e) {
            e.preventDefault();
            return false;
        });
       
        // Botón generar PDF
        btnGenerarPDF.addEventListener('click', generarPDF);
    });
    