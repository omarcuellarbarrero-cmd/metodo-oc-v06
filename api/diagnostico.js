import { GoogleGenerativeAI } from "@google/generative-ai";
import { tips } from "./tips.js"; 

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { equipo, marca, modelo, sintoma, mediciones } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como experto en el Método OC. Analiza con estos datos:
        Tips: ${JSON.stringify(tips)}
        Caso: ${equipo}, ${marca}, ${modelo}, Síntoma: ${sintoma}, Mediciones: ${mediciones}.`;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ diagnostico: result.response.text() });
        
    } catch (error) {
        if (error.message.includes("429")) {
            return res.status(200).json({ diagnostico: "El sistema está saturado. Por favor, espere un momento antes de volver a consultar." });
        }
        return res.status(500).json({ error: "Estamos ajustando el sistema, intente en breve." });
    }
}