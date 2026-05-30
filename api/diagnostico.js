import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// 📡 CONFIGURACIÓN DEL ENTORNO (Mapeo de rutas nativo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ FILTROS DE ENTRADA (Middleware)
app.use(cors());
app.use(express.json());

// 🛠️ SERVICIO DE ARCHIVOS ESTÁTICOS
// Esto le dice al servidor que entregue index.html, app.html, estilos o imágenes directamente de la raíz
app.use(express.static(__dirname));

// 📡 RUTA RAÍZ: Abre la puerta principal entregando la Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 📡 RUTA DE TRABAJO: Por si acaso el sistema requiere redirección forzada a la estación
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'app.html'));
});

// 🧠 MOTOR DE INTELIGENCIA ARTIFICIAL (Gemini API)
app.post('/api/diagnostico', async (req, res) => {
    try {
        const { marca, modelo, falla, usuario } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Falta la llave maestra GEMINI_API_KEY en el servidor." });
        }

        // Aquí procesará los datos con el modelo de Google Studio
        // (Manteniendo la conexión limpia con su lógica técnica anterior)
        
        res.json({ respuesta: "Tarjeta de procesamiento de IA inicializada correctamente." });
    } catch (error) {
        console.error("Error en la pista de IA:", error);
        res.status(500).json({ error: "Fallo interno en el procesador de diagnóstico." });
    }
});

// 🚀 ENCENDIDO DEL COMPONENTE
app.listen(PORT, () => {
    console.log(`🚀 Tarjeta Nueva del Método OC Operando en el puerto ${PORT}`);
});
