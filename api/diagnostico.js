import { GoogleGenerativeAI } from "@google/generative-ai";
import { tips } from "./tips.js"; 

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        // 1. Inicializamos primero el cliente
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 2. Ahora sí podemos listar los modelos
        const modelList = await genAI.listModels();
        console.log("Modelos disponibles:", modelList); 
        
        // 3. Continuamos con el resto...
        const { equipo, marca, modelo, sintoma, mediciones } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Actúa como experto en el Método OC. Analiza con estos datos:
        Tips: ${JSON.stringify(tips)}
        Caso: ${equipo}, ${marca}, ${modelo}, Síntoma: ${sintoma}, Mediciones: ${mediciones}.`;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ diagnostico: result.response.text() });
        
    } catch (error) {
        console.error("Error completo:", error); // Esto es vital para ver qué está fallando
        if (error.message.includes("429")) {
            return res.status(200).json({ diagnostico: "El sistema está saturado. Por favor, espere un momento." });
        }
        return res.status(500).json({ error: "Error en servidor: " + error.message });
    }
}