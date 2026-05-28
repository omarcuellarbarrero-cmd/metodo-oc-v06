import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { equipo, marca, modelo, mediciones, sintomas } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como experto en el Método OC. Analiza el siguiente caso técnico:
        - Equipo: ${equipo}
        - Marca: ${marca}
        - Modelo: ${modelo}
        - Mediciones/Pruebas: ${mediciones}
        - Síntomas: ${sintomas}
        
        Proporciona un diagnóstico técnico preciso y pasos a seguir basado en la metodología OC.`;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ diagnostico: result.response.text() });
        
    } catch (error) {
        console.error("Error técnico:", error);
        return res.status(500).json({ error: "Error en la IA: " + error.message });
    }
}