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
        const ivaCalculado = subtotal * (iva / 100);

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
    
    // Función para cargar y agregar imagen
    function loadAndAddImage(doc, url, x, y, width, height) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Para evitar problemas CORS
            img.src = url;
            
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    const dataURL = canvas.toDataURL('image/png');
                    doc.addImage(dataURL, 'PNG', x, y, width, height);
                    resolve(true);
                } catch (e) {
                    console.error("Error al agregar imagen:", e);
                    resolve(false);
                }
            };
            
            img.onerror = function() {
                console.error("Error al cargar la imagen:", url);
                resolve(false);
            };
        });
    }
    
    // Función para dividir texto en líneas que caben en el ancho del PDF
    function splitTextIntoLines(doc, text, maxWidth) {
        const lines = [];
        const words = text.split(' ');
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = doc.getTextWidth(currentLine + ' ' + word);
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
    
    async function generarPDF() {
    if (!calculosRealizados) {
        alert("Por favor, primero realiza los cálculos.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurar fuente formal
    doc.setFont("helvetica");
    doc.setTextColor(0, 0, 0);

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
    
    // Obtener valores de los campos opcionales
    const banco = document.getElementById('banco') ? document.getElementById('banco').value.trim() : '';
    const entidad = document.getElementById('entidad') ? document.getElementById('entidad').value.trim() : '';

    let y = 35; // Posición inicial más abajo para el logo

    // Intentar agregar el logo
    try {
        const logoCargado = await loadAndAddImage(doc, 'img/logo2n.png', 5, 5, 35, 15);
        
        if (!logoCargado) {
            // Fallback si no se puede cargar el logo
            doc.setFillColor(240, 240, 240);
            doc.rect(20, 15, 30, 15, "F");
            doc.setFontSize(8);
            doc.text("LOGO", 35, 23, { align: 'center' });
        }
    } catch (e) {
        console.error("Error con el logo:", e);
    }

    // Encabezado
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("CÉDULA DE DETERMINACIÓN DEL MONTO A GARANTIZAR", 105, y, { align: 'center' });
    y += 10;
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;



function agregarFila(label, value, isMonetary = false, isBold = false, isHighlighted = false) {
    doc.setFontSize(11);

    if (isHighlighted) {
        doc.setFillColor(240, 240, 240);
        doc.rect(20, y - 4, 170, 8, "F");
    }

    // Caso especial: TOTAL POR GARANTIZAR → todo en verde
    if (label.includes("TOTAL POR GARANTIZAR")) {
        const formattedValue = "$" + parseFloat(value).toLocaleString('es-MX', { minimumFractionDigits: 2 }) + " MXN";
        
        doc.setTextColor(0, 128, 0);
        doc.setFont(undefined, 'bold');
        doc.text(label, 22, y);
        doc.text(formattedValue, 188, y, { align: 'right' });
        
        doc.setTextColor(0, 0, 0); // restaurar para las demás filas
    } else {
        // Separar el primer carácter (símbolo) del resto
        const primerCaracter = label.charAt(0);
        const restoTexto = label.slice(1);

        // Primer carácter en verde
        doc.setTextColor(0, 128, 0);
        doc.setFont(undefined, 'bold');
        doc.text(primerCaracter, 22, y);

        // Resto del texto
        const textWidth = doc.getTextWidth(primerCaracter);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, isBold ? 'bold' : 'normal');
        doc.text(restoTexto, 22 + textWidth, y);

        // Formatear valor
        let formattedValue = value;
        if (isMonetary) {
            formattedValue = "$" + parseFloat(value).toLocaleString('es-MX', { minimumFractionDigits: 2 });
        }

        doc.setFont(undefined, isBold ? 'bold' : 'normal');
        doc.text(formattedValue, 188, y, { align: 'right' });
    }

    y += 8;
}













    // Luego, en las llamadas a agregarFila, cambiar las etiquetas:
    agregarFila("= CONTRAPRESTACIÓN MENSUAL BRUTA:", contraprestacion, true, true);
    agregarFila("+ % ALICUOTAS:", alicuota + "%", false);
    agregarFila("= SUBTOTAL:", subtotal, true);
    agregarFila("+ % IVA:", iva + "%", false);
    agregarFila("= CONTRAPRESTACIÓN MENSUAL:", contraprestacionMensual, true, true);
    agregarFila("× MESES DE GARANTÍA:", mesesGarantia, false);
    agregarFila("= VALOR DE LA GARANTÍA:", valorGarantia, true, true);
    agregarFila("- GARANTÍA VIGENTE POR ESTE CONCEPTO:", garantiaVigente, true);
            
    y += 4; // Espacio antes del total
    
    // Total por garantizar (destacado)
    agregarFila(" = TOTAL POR GARANTIZAR:", totalGarantizar, true, true, true);

    // Agregar información del banco y CLABE si están disponibles
    if (banco || entidad) {
        y += 5;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text("INFORMACIÓN BANCARIA:", 20, y);
        y += 7;
        
        doc.setFont(undefined, 'normal');
        if (banco) {
            doc.text("BANCO: " + banco, 20, y);
            y += 7;
        }
        
        if (entidad) {
            doc.text("CLABE: " + entidad, 20, y);
            y += 3;
        }
    }

    y += 5;
    doc.setFontSize(7);
    doc.setFont(undefined, 'italic');
    
    // Notas al pie
    doc.text("DETERMINACIÓN ELABORADA SEGÚN TÉRMINOS: COMERCIALES, CONTRATO,Y/O COMÚN", 20, y);
    y += 5;
     doc.text("ACUERDO ENTRE LAS PARTES.", 20, y);
    y += 5;
    doc.text("NOTA(S): NOTIFICAR EL CUMPLIMIENTO DE EXHIBICION DE GARANTÍA MEDIANTE CORREO ELECTRONICO", 20, y);
    y += 5;
     doc.text("ADJUNTANDO EL COMPROBANTE BANCARIO CUYO CONCEPTO DEBE INCLUIR EL TEXTO:DEPOSITO EN GARANTÍA", 20, y);
    y += 5;
   
    // PÁRRAFO COMPLETO CON SALTOS DE LÍNEA
    // PÁRRAFO COMPLETO CON SALTOS DE LÍNEA
const notaCompleta = "-EN CASO DE RENOVACIONES, AL CONTAR CON NA GARANTÍA VIGENTE CONSIDERAR PREFERENTEMENTE SU DEVOLUCIÓN PREVIA SOLICITUD POR ESCRITO DEL REPRESENTANTE LEGAL, INCLUYENDO MOTIVACIÓN,NÚMERO DE CONTRATO Y VIGENCIA, EN SU DEFECTO MANIFESTAR EN EL ESCRITO LA INTENCIÓN DE EXHIBIR EL DIFERENCIAL POR GARANTIZAR.";
// SEGUNDO PÁRRAFO
const segundoParrafo ="-EN TODOS LOS EVENTOS ANEXAR COPIA LEGIBLE DEL ESTADO DE CUENTA BANCARIA CON UNA ANTIGUEDAD NO MAYOR A 3 MESES Y EN DONDE SE MUESTRE LA CLABE INTERBANCARIA.";

// Dividir el texto en líneas que quepan en el ancho del PDF
const lineHeight = 5


const maxWidth = 170; // Ancho máximo disponible

doc.setFontSize(7);

// Primer párrafo
const lines1 = doc.splitTextToSize(notaCompleta, maxWidth);
lines1.forEach(line => {
    if (y > 270) { // Si se acerca al final de la página
        doc.addPage();
        y = 20;
    }
    doc.text(line, 20, y);
    y += lineHeight;
});

// Espacio entre párrafos
y += 1;

// Segundo párrafo
const lines2 = doc.splitTextToSize(segundoParrafo, maxWidth);
lines2.forEach(line => {
    if (y > 270) { // Si se acerca al final de la página
        doc.addPage();
        y = 20;
    }
    doc.text(line, 20, y);
    y += lineHeight;
});
    // Guardar
    doc.save("cedula_garantia.pdf");
}
    
    // Vincular el evento click del botón a la función generarPDF
    btnGenerarPDF.addEventListener('click', generarPDF);
    




// Reiniciar formulario en 0 al cargar la página
document.getElementById('contraprestacion').value = 0;
document.getElementById('alicuota').value = 0;
document.getElementById('iva').value = 0;
document.getElementById('garantia-vigente').value = 0;
document.getElementById('meses-garantia').value = 0;

// Calcular valores iniciales
calcularValores();


    // Calcular valores iniciales
    calcularValores();
});