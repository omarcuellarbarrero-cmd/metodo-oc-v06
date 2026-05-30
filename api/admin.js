export default function handler(req, res) {
  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Panel Maestro - Método OC</title>
      <style>
          body { background-color: #121212; color: #fff; font-family: sans-serif; padding: 30px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          h2 { color: #00e676; border-bottom: 2px solid #00e676; padding-bottom: 10px; }
          label { display: block; margin-bottom: 5px; color: #00e676; font-weight: bold; }
          input, textarea { width: 100%; padding: 10px; background-color: #1e1e1e; border: 1px solid #333; color: #fff; border-radius: 5px; margin-bottom: 15px; box-sizing: border-box; }
          button { width: 100%; padding: 12px; color: #000; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; background-color: #00e676; }
          .msg { margin-top: 15px; padding: 10px; background-color: #1e1e1e; border-left: 4px solid #00e676; display: none; }
      </style>
  </head>
  <body>
      <div class="container">
          <div id="admin-panel">
              <h2>🛠️ Panel de Control Maestro - Método OC</h2>
              <p style="color: #aaa;">Inyectar nuevos tips técnicos en tiempo real para la base de datos.</p>

              <form id="tipForm">
                  <label>Marca:</label>
                  <input type="text" id="marca" required placeholder="Ej: Samsung, LG, Challenger">

                  <label>Modelo (Opcional):</label>
                  <input type="text" id="modelo" placeholder="Ej: UN40EH5300">

                  <label>Chasis / Matrícula de Tarjeta:</label>
                  <input type="text" id="chasis" required placeholder="Ej: TP.MS338.PB801">

                  <label>Síntoma de la Falla:</label>
                  <textarea id="falla" required rows="3" placeholder="Describa el síntoma detallado..."></textarea>

                  <label>Procedimiento de Solución:</label>
                  <textarea id="solucion" required rows="5" placeholder="Paso a paso para resolver la falla..."></textarea>

                  <button type="submit">🚀 Publicar Tip Exclusivo</button>
              </form>
              <div id="statusMsg" class="msg"></div>
          </div>
      </div>

      <script>
          document.getElementById('tipForm').addEventListener('submit', function(e) {
              e.preventDefault();
              const statusMsg = document.getElementById('statusMsg');
              statusMsg.style.display = 'block';
              statusMsg.innerText = 'Cargando módulos de inyección segura...';

              const nuevoTip = {
                  marca: document.getElementById('marca').value.trim(),
                  modelo: document.getElementById('modelo').value.trim().toUpperCase(),
                  chasis_tarjeta: document.getElementById('chasis').value.trim().toUpperCase(),
                  falla: document.getElementById('falla').value.trim(),
                  solucion: document.getElementById('solucion').value.trim(),
                  fecha: new Date().toISOString()
              };

              const FIREBASE_URL = 'https://metodo-oc-default-rtdb.firebaseio.com/tips_tecnicos.json';

              fetch(FIREBASE_URL, {
                  method: 'POST',
                  body: JSON.stringify(nuevoTip),
                  headers: { 'Content-Type': 'application/json' }
              })
              .then(res => {
                  if(res.ok) {
                      statusMsg.innerText = '✅ ¡Tip inyectado con éxito total en la base de datos, Maestro!';
                      document.getElementById('tipForm').reset();
                  } else {
                      statusMsg.innerText = '❌ Error de respuesta en el nodo de base de datos.';
                  }
              })
              .catch(err => {
                  statusMsg.innerText = '❌ Cortocircuito en la línea de transmisión REST: ' + err.message;
              });
          });
      </script>
  </body>
  </html>
  \`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
