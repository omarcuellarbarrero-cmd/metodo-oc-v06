import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    const { equipo, sintomas } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Actúa como experto en el Método OC. Diagnostica este problema de ${equipo}: ${sintomas}.`;

    try {
        const result = await model.generateContent(prompt);
        res.status(200).json({ diagnostico: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error al consultar a la IA" });
    }
}