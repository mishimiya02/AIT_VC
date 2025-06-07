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
    tituloEmpresa.value = "AEROPUERTO INTERNACIONAL DE TOLUCA";
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
celdas.forEach((td, index) => {
    const valor = td.textContent.trim();
    const cell = row.getCell(index + 1);

    // Detección mejorada de números
    if (/^-?\d{1,3}(,\d{3})*(\.\d{2})?$/.test(valor)) {
        // Números con formato 222.00 o 1,222.00
        cell.value = parseFloat(valor.replace(/,/g, ''));
        cell.numFmt = '#,##0.00';
    }
    // Resto de las condiciones para fechas, etc...
            // 🧠 Detectar y aplicar formato
            if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(valor)) {
                // Formato dd/mm/yyyy
                const [d, m, y] = valor.split('/');
                const year = y.length === 2 ? `20${y}` : y; // Asumir siglo 21 para años de 2 dígitos
                cell.value = new Date(`${year}-${m}-${d}`);
                cell.numFmt = 'dd/mm/yyyy';
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
                // Formato yyyy-mm-dd
                cell.value = new Date(valor);
                cell.numFmt = 'yyyy-mm-dd';
            } else if (/^\$[\d,]+(\.\d{2})?$/.test(valor)) {
                // Moneda en formato US
                cell.value = parseFloat(valor.replace(/[$,]/g, ''));
                cell.numFmt = '"$"#,##0.00';
            } else if (/^[\d,]+\.\d{2}$/.test(valor)) {
                // Número con decimales y comas como separadores de miles
                cell.value = parseFloat(valor.replace(/,/g, ''));
                cell.numFmt = '#,##0.00';
            } else if (/^[\d,]+$/.test(valor)) {
                // Número entero con comas como separadores de miles
                cell.value = parseInt(valor.replace(/,/g, ''), 10);
                cell.numFmt = '#,##0';
            } else if (/^-?\d+\.\d+$/.test(valor)) {
                // Número con decimales (sin comas)
                cell.value = parseFloat(valor);
                cell.numFmt = '0.00';
            } else if (/^-?\d+$/.test(valor)) {
                // Número entero (sin comas)
                cell.value = parseInt(valor, 10);
                cell.numFmt = '0';
            } else {
                // Texto por defecto
                cell.value = valor;
            }

            // 🎨 Estilos visuales
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
