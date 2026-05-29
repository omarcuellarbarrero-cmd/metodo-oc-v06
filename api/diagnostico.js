import { GoogleGenerativeAI } from "@google/generative-ai";
import { tips } from "./tips.js"; 

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { equipo, marca, modelo, sintoma, mediciones } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Usamos el modelo estándar 1.5 Flash (es el más rápido y fiable ahora mismo)
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

        const prompt = `Actúa como experto en el Método OC. Analiza con estos datos:
        Tips de referencia: ${JSON.stringify(tips)}
        Datos del equipo: ${equipo} - ${marca} ${modelo}
        Síntoma: ${sintoma}
        Mediciones: ${mediciones}
        
        Dame un diagnóstico técnico y pasos a seguir basado en la metodología OC.`;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ diagnostico: result.response.text() });
        
    } catch (error) {
        console.error("Error en IA:", error);
        return res.status(500).json({ error: "Error técnico: " + error.message });
    }
}