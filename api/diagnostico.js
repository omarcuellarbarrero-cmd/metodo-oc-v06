import { GoogleGenerativeAI } from "@google/generative-ai";
import { tips } from "./tips.js";

async function invocarIAConReintento(model, prompt, intentos = 3) {
    for (let i = 0; i < intentos; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            // Si el error es de "Servicio no disponible" (503) o "Saturación", esperamos
            if (error.message.includes("503") || error.message.includes("high demand")) {
                if (i < intentos - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Espera progresiva
                    continue;
                }
            }
            throw error; // Si es otro tipo de error, lo lanzamos
        }
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { equipo, marca, modelo, sintoma, mediciones } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

        const prompt = `Actúa como experto en el Método OC.
        Tips disponibles: ${JSON.stringify(tips)}
        Caso: Equipo ${equipo}, ${marca} ${modelo}. Síntoma: ${sintoma}. Mediciones: ${mediciones}.`;

        const respuesta = await invocarIAConReintento(model, prompt);
        return res.status(200).json({ diagnostico: respuesta });
    } catch (error) {
        return res.status(500).json({ error: "El sistema está saturado. Por favor, intente nuevamente en unos segundos." });
    }
}