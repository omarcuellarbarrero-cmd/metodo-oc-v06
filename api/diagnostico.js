import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { GoogleGenAI } from '@google/generative-ai';

// 📡 CONFIGURACIÓN DEL ENTORNO (Mapeo de rutas nativo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ FILTROS DE ENTRADA Y ACCESO (Middleware)
app.use(cors());
app.use(express.json());

// 🛠️ SERVICIO DE ARCHIVOS ESTÁTICOS
// Esto le dice al servidor que entregue index.html y app.html directamente desde la raíz
app.use(express.static(__dirname));

// 📡 RUTA RAÍZ: Abre la puerta principal entregando la Landing Page de alumnos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🧠 MOTOR DE INTELIGENCIA ARTIFICIAL (Gemini API)
app.post('/api/diagnostico', async (req, res) => {
    try {
        const { marca, modelo, falla, usuario } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Falta la llave maestra GEMINI_API_KEY en el servidor." });
        }

        // Conexión con el modelo de Google Studio
        const ai = new GoogleGenAI({ apiKey });
        const model = ai.getGenerativeModel({ model: 'gemini-3.5-flash' });

        const prompt = `Actúa como un experto en soporte técnico bajo el Método OC. 
        El usuario ${usuario} consulta por el siguiente equipo:
        Marca: ${marca}
        Modelo: ${modelo}
        Falla: ${falla}
        Proporciona un diagnóstico preciso y estructurado según tus metodologías.`;

        const result = await model.generateContent(prompt);
        const respuestaIA = result.response.text();
        
        res.json({ respuesta: respuestaIA });
    } catch (error) {
        console.error("Error en la pista de IA:", error);
        res.status(500).json({ error: "Fallo interno en el procesador de diagnóstico." });
    }
});

// 🚀 ENCENDIDO DEL COMPONENTE
app.listen(PORT, () => {
    console.log(`🚀 Sistema Método OC operando en el puerto ${PORT}`);
});
