document.addEventListener('DOMContentLoaded', () => {
    const botonPDF = document.getElementById('exportar-pdf');
    botonPDF.addEventListener('click', () => {
        const tabla = document.getElementById('tabla-resultados');
        const columnasTotales = tabla.rows[0].cells.length;
        const columnasVisibles = [0, 1, 2, 14, 15, 16];

        const columnasOcultadas = [];

        // Ocultar columnas que no queremos mostrar
        for (let row of tabla.rows) {
            for (let i = 0; i < columnasTotales; i++) {
                const cell = row.cells[i];
                if (cell && !columnasVisibles.includes(i)) {
                    cell.dataset.originalDisplay = cell.style.display;
                    cell.style.display = 'none';
                    columnasOcultadas.push(cell);
                }
            }
        }

        const resultados = document.getElementById('resultados');

        // Aplicar estilos para asegurar que no se corte
        resultados.style.pageBreakInside = 'avoid';
        resultados.style.breakInside = 'avoid';

        const opt = {
            margin: [0.4, 0.4, 0.4, 0.4], // top, left, bottom, right
            filename: 'valuacion-parcial.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                scrollY: 0
            },
            jsPDF: {
                unit: 'in',
                format: 'a3', // A3 para mejor espacio
                orientation: 'landscape'
            },
            pagebreak: {
                mode: ['avoid', 'css', 'legacy']
            }
        };

        html2pdf().set(opt).from(resultados).save().then(() => {
            // Restaurar columnas ocultas
            columnasOcultadas.forEach(cell => {
                cell.style.display = cell.dataset.originalDisplay || '';
                delete cell.dataset.originalDisplay;
            });

            // Restaurar estilo de contenedor
            resultados.style.pageBreakInside = '';
            resultados.style.breakInside = '';
        });
    });
});
