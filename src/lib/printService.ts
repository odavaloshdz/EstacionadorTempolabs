export const printTicket = (ticketData: any) => {
  const ticketContent = `
    ================================
    TICKET DE ESTACIONAMIENTO
    ================================
    Número: ${ticketData.ticketNumber}
    Entrada: ${ticketData.entryTime}
    Placa: ${ticketData.licensePlate}
    --------------------------------
    ${ticketData.vehicleInfo?.color ? `Color: ${ticketData.vehicleInfo.color}\n` : ""}
    ${ticketData.vehicleInfo?.model ? `Modelo: ${ticketData.vehicleInfo.model}\n` : ""}
    Tipo: ${ticketData.vehicleInfo?.type || "No especificado"}
    --------------------------------
    Creado por: ${ticketData.createdBy || "Sistema"}
    ================================
  `;

  const printWindow = window.open("", "", "width=600,height=600");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Ticket de Estacionamiento</title>
        <style>
          body { font-family: monospace; padding: 20px; }
          pre { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <pre>${ticketContent}</pre>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const printReceipt = (ticketData: any) => {
  const receiptContent = `
    ================================
    RECIBO DE PAGO
    ================================
    Número: ${ticketData.ticketNumber}
    Entrada: ${ticketData.entryTime}
    Salida: ${ticketData.exitTime}
    Duración: ${ticketData.duration}
    --------------------------------
    Total a pagar: $${ticketData.amount?.toFixed(2)}
    ================================
  `;

  const printWindow = window.open("", "", "width=600,height=600");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Recibo de Pago</title>
        <style>
          body { font-family: monospace; padding: 20px; }
          pre { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <pre>${receiptContent}</pre>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
