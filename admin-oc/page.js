
'use client';
import { useState } from 'react';

export default function AdminPanel() {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [chasis, setChasis] = useState('');
  const [falla, setFalla] = useState('');
  const [solucion, setSolucion] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('⚡ Conectando con el nodo de base de datos...');

    const nuevoTip = {
      marca: marca.trim(),
      modelo: modelo.trim().toUpperCase(),
      chasis_tarjeta: chasis.trim().toUpperCase(),
      falla: falla.trim(),
      solucion: solucion.trim(),
      fecha: new Date().toISOString()
    };

    // URL REST Directa de Firebase (Se conecta mediante peticiones de datos estándar)
    const FIREBASE_URL = 'https://metodo-oc-default-rtdb.firebaseio.com/tips_tecnicos.json';

    try {
      const response = await fetch(FIREBASE_URL, {
        method: 'POST',
        body: JSON.stringify(nuevoTip),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setStatusMsg('✅ ¡Tip inyectado con éxito total, Maestro!');
        setMarca('');
        setModelo('');
        setChasis('');
        setFalla('');
        setSolucion('');
      } else {
        setStatusMsg('❌ Error: El nodo de Firebase rechazó la conexión.');
      }
    } catch (error) {
      setStatusMsg('❌ Cortocircuito en la transmisión: ' + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#00e676', borderBottom: '2px solid #00e676', paddingBottom: '10px' }}>
          🛠️ Panel de Control Maestro - Método OC
        </h2>
        <p style={{ color: '#aaa' }}>Subir nuevos tips técnicos en tiempo real para los alumnos Premium.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#00e676', fontWeight: 'bold' }}>Marca:</label>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} placeholder="Ej: Samsung, LG, Challenger" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#00e676', fontWeight: 'bold' }}>Modelo (Opcional):</label>
            <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} placeholder="Ej: UN40EH5300" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#00e676', fontWeight: 'bold' }}>Chasis / Matrícula de Tarjeta:</label>
            <input type="text" value={chasis} onChange={(e) => setChasis(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} placeholder="Ej: TP.MS338.PB801" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#00e676', fontWeight: 'bold' }}>Síntoma de la Falla:</label>
            <textarea value={falla} onChange={(e) => setFalla(e.target.value)} required rows="3" style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} placeholder="Describa el síntoma detallado de la tarjeta..." />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#00e676', fontWeight: 'bold' }}>Procedimiento de Solución:</label>
            <textarea value={solucion} onChange={(e) => setSolucion(e.target.value)} required rows="5" style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} placeholder="Paso a paso técnico para resolver la falla..." />
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#00e676', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
            🚀 Publicar Tip Exclusivo
          </button>

          {statusMsg && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1e1e1e', borderLeft: '4px solid #00e676', color: '#fff' }}>
              {statusMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
