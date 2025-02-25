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
          body { 
            font-family: 'Courier New', monospace; 
            padding: 20px; 
            max-width: 400px;
            margin: 0 auto;
            background-color: #f9f9f9;
          }
          .ticket {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .ticket-header {
            text-align: center;
            border-bottom: 2px dashed #ccc;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .ticket-header h1 {
            font-size: 18px;
            margin: 0;
          }
          .ticket-content {
            font-size: 14px;
            line-height: 1.5;
          }
          .ticket-footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px dashed #ccc;
            font-size: 12px;
            text-align: center;
          }
          .ticket-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .ticket-info-label {
            font-weight: bold;
          }
          .separator {
            border-top: 1px dashed #ccc;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <h1>TICKET DE ESTACIONAMIENTO</h1>
          </div>
          <div class="ticket-content">
            <div class="ticket-info">
              <span class="ticket-info-label">Número:</span>
              <span>${ticketData.ticketNumber}</span>
            </div>
            <div class="ticket-info">
              <span class="ticket-info-label">Entrada:</span>
              <span>${ticketData.entryTime}</span>
            </div>
            <div class="ticket-info">
              <span class="ticket-info-label">Placa:</span>
              <span>${ticketData.licensePlate}</span>
            </div>
            
            <div class="separator"></div>
            
            ${ticketData.vehicleInfo?.color ? `
            <div class="ticket-info">
              <span class="ticket-info-label">Color:</span>
              <span>${ticketData.vehicleInfo.color}</span>
            </div>` : ""}
            
            ${ticketData.vehicleInfo?.model ? `
            <div class="ticket-info">
              <span class="ticket-info-label">Modelo:</span>
              <span>${ticketData.vehicleInfo.model}</span>
            </div>` : ""}
            
            <div class="ticket-info">
              <span class="ticket-info-label">Tipo:</span>
              <span>${ticketData.vehicleInfo?.type || "No especificado"}</span>
            </div>
            
            <div class="separator"></div>
            
            <div class="ticket-info">
              <span class="ticket-info-label">Creado por:</span>
              <span>${ticketData.createdBy || "Sistema"}</span>
            </div>
          </div>
          <div class="ticket-footer">
            Gracias por usar nuestro estacionamiento
          </div>
        </div>
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
    Placa: ${ticketData.licensePlate}
    ${ticketData.vehicleInfo?.type ? `Tipo: ${ticketData.vehicleInfo.type}\n` : ""}
    --------------------------------
    Total a pagar: $${ticketData.amount?.toFixed(2)}
    --------------------------------
    Creado por: ${ticketData.createdBy || "Sistema"}
    ${ticketData.closedBy ? `Cerrado por: ${ticketData.closedBy}` : ""}
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
          body { 
            font-family: 'Courier New', monospace; 
            padding: 20px; 
            max-width: 400px;
            margin: 0 auto;
            background-color: #f9f9f9;
          }
          .receipt {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px dashed #ccc;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .receipt-header h1 {
            font-size: 18px;
            margin: 0;
          }
          .receipt-content {
            font-size: 14px;
            line-height: 1.5;
          }
          .receipt-footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px dashed #ccc;
            font-size: 12px;
            text-align: center;
          }
          .receipt-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .receipt-info-label {
            font-weight: bold;
          }
          .separator {
            border-top: 1px dashed #ccc;
            margin: 10px 0;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
          }
          .staff-info {
            font-size: 12px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="receipt-header">
            <h1>RECIBO DE PAGO</h1>
          </div>
          <div class="receipt-content">
            <div class="receipt-info">
              <span class="receipt-info-label">Número:</span>
              <span>${ticketData.ticketNumber}</span>
            </div>
            <div class="receipt-info">
              <span class="receipt-info-label">Entrada:</span>
              <span>${ticketData.entryTime}</span>
            </div>
            <div class="receipt-info">
              <span class="receipt-info-label">Salida:</span>
              <span>${ticketData.exitTime}</span>
            </div>
            <div class="receipt-info">
              <span class="receipt-info-label">Duración:</span>
              <span>${ticketData.duration}</span>
            </div>
            
            <div class="separator"></div>
            
            <div class="receipt-info">
              <span class="receipt-info-label">Placa:</span>
              <span>${ticketData.licensePlate}</span>
            </div>
            ${ticketData.vehicleInfo?.type ? `
            <div class="receipt-info">
              <span class="receipt-info-label">Tipo:</span>
              <span>${ticketData.vehicleInfo.type}</span>
            </div>` : ""}
            
            <div class="separator"></div>
            
            <div class="total">
              Total a pagar: $${ticketData.amount?.toFixed(2)}
            </div>
            
            <div class="staff-info">
              <div class="receipt-info">
                <span class="receipt-info-label">Creado por:</span>
                <span>${ticketData.createdBy || "Sistema"}</span>
              </div>
              ${ticketData.closedBy ? `
              <div class="receipt-info">
                <span class="receipt-info-label">Cerrado por:</span>
                <span>${ticketData.closedBy}</span>
              </div>` : ""}
            </div>
          </div>
          <div class="receipt-footer">
            Gracias por su preferencia
          </div>
        </div>
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
