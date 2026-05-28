import { GoogleGenerativeAI } from "@google/generative-ai";
import { tips } from "./tips.js"; // Importamos su biblioteca técnica

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { equipo, marca, modelo, sintoma, mediciones } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // El prompt obliga a revisar los tips primero
        const prompt = `Actúa como experto en el Método OC.
        Base de conocimientos disponible: ${JSON.stringify(tips)}
        
        Instrucción: Revisa primero la base de conocimientos. Si existe una solución o tip para el equipo ${marca} ${modelo}, úsalo.
        
        Caso a diagnosticar:
        - Equipo: ${equipo}
        - Síntoma: ${sintoma}
        - Mediciones: ${mediciones}
        
        Proporciona un diagnóstico basado en la metodología OC.`;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ diagnostico: result.response.text() });
    } catch (error) {
        return res.status(500).json({ error: "Error técnico: " + error.message });
    }
}