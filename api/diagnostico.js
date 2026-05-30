import { GoogleGenAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // 🛡️ Habilitar CORS para que app.html pueda consultar la API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar la petición de control previa (Preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Debe ser POST.' });
    }

    try {
        const { marca, modelo, falla, usuario } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Falta la llave GEMINI_API_KEY en las variables de Vercel." });
        }

        // 🧠 Inicializar el motor de Google Gemini
        const ai = new GoogleGenAI({ apiKey });
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Aquí la instrucción para la IA
        const prompt = `Actúa como un experto en soporte técnico bajo el Método OC. 
        El usuario ${usuario} consulta por:
        Marca: ${marca}
        Modelo: ${modelo}
        Falla: ${falla}
        Genera un diagnóstico preciso y estructurado.`;

        const result = await model.generateContent(prompt);
        const respuestaIA = result.response.text();

        // Devuelve la respuesta en formato JSON
        return res.status(200).json({ respuesta: respuestaIA });

    } catch (error) {
        console.error("Error en la función de Vercel:", error);
        return res.status(500).json({ error: "Fallo interno en el procesador de diagnóstico Serverless." });
    }
}
