import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, push, set } from 'firebase/database';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Estados para el formulario de tips
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [chasis, setChasis] = useState('');
  const [falla, setFalla] = useState('');
  const [solucion, setSolucion] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // CORREO AUTORIZADO (El cortafuegos maestro)
  const ADMIN_EMAIL = 'omarcuellarbarrero@gmail.com'; 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Si el correo no es el suyo, lo saca de taquito al inicio
        if (currentUser.email !== ADMIN_EMAIL) {
          router.push('/');
        } else {
          setUser(currentUser);
        }
      } else {
        router.push('/'); // Si no hay sesión, para afuera
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('Inyectando tip en la base de datos...');

    const db = getDatabase();
    const tipsRef = ref(db, 'tips_tecnicos');
    const nuevoTipRef = push(tipsRef); // Genera una llave única automática

    try {
      await set(nuevoTipRef, {
        marca: marca.trim(),
        modelo: modelo.trim().toUpperCase(),
        chasis_tarjeta: chasis.trim().toUpperCase(),
        falla: falla.trim(),
        solucion: solucion.trim(),
        fecha: new Date().toISOString()
      });

      setStatusMsg('✅ ¡Tip publicado con éxito total, Maestro!');
      // Limpiar campos del banco de trabajo
      setMarca('');
      setModelo('');
      setChasis('');
      setFalla('');
      setSolucion('');
    } catch (error) {
      console.error(error);
      setStatusMsg('❌ Error en el circuito: No se pudo guardar.');
    }
  };

  if (loading) return <div style={{padding: '20px', color: '#fff', backgroundColor: '#111', height: '100vh'}}>Escaneando credenciales de seguridad...</div>;
  if (!user) return null;

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#00e676', borderBottom: '2px solid #00e676', paddingBottom: '10px' }}>
        🛠️ Panel de Control Maestro - Electrónica Profesional
      </h2>
      <p style={{ color: '#aaa' }}>Subir nuevos tips técnicos en tiempo real para los alumnos Premium.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', marginTop: '20px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00e676' }}>Marca:</label>
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px' }} placeholder="Ej: Samsung, LG, Challenger" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00e676' }}>Modelo (Opcional):</label>
          <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px' }} placeholder="Ej: UN40EH5300" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00e676' }}>Chasis / Matrícula de Tarjeta:</label>
          <input type="text" value={chasis} onChange={(e) => setChasis(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px' }} placeholder="Ej: TP.MS338.PB801 o Chasis Genérico" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00e676' }}>Síntoma de la Falla:</label>
          <textarea value={falla} onChange={(e) => setFalla(e.target.value)} required rows="3" style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px' }} placeholder="Describa el síntoma (Ej: Parpadea el LED de standby 5 veces y no da orden de encendido)" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00e676' }}>Procedimiento de Solución:</label>
          <textarea value={solucion} onChange={(e) => setSolucion(e.target.value)} required rows="5" style={{ width: '100%', padding: '10px', backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '5px' }} placeholder="Paso a paso técnico (Ej: Revisar voltajes en la subfuente de 3.3V. Si el condensador C902 está desvalorizado, reemplazar por uno de 470uF a 16V)" />
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
  );
}
