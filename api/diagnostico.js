import { GoogleGenerativeAI } from "@google/generative-ai";
import { tips } from "./tips.js";

async function invocarIAConReintento(model, prompt, intentos = 3) {
    for (let i = 0; i < intentos; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            if (error.message.includes("503") || error.message.includes("high demand")) {
                if (i < intentos - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
                    continue;
                }
            }
            throw error;
        }
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { equipo, marca, modelo, sintoma, mediciones } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

       // ... dentro del handler de api/diagnostico.js ...

const prompt = `Eres el asistente oficial del "Método OC", un sistema experto en reparación de electrónica.

REGLA DE ORO NÚMERO 1: Es MANDATORIO que revises primero la siguiente Base de Datos de Tips antes de responder. Si la marca, modelo o una falla similar está en esta lista, DEBES usar esa solución específica como base principal de tu diagnóstico.

=== BASE DE DATOS DE TIPS (MÉTODO OC) ===
${tips}
========================================

Instrucciones para el diagnóstico:
1. Compara el caso del alumno con la Base de Datos de Tips.
2. Si encuentras coincidencia en los Tips (por ejemplo, por marca y modelo como RCA o Samsung, o por síntoma), menciona explícitamente al alumno: "Basado en los Tips del Método OC..." y dale esa solución exacta.
3. Complementa el diagnóstico con tu conocimiento técnico solo para los pasos de medición, pero NO ignores los Tips.

CASO TÉCNICO A PROCESAR:
- Tipo de Equipo: ${equipo}
- Marca: ${marca}
- Modelo: ${modelo}
- Síntoma Reportado: ${sintoma}
- Mediciones de Voltaje/Pruebas: ${mediciones}

Proporciona el diagnóstico con un lenguaje técnico, claro y estructurado.`;

        const respuesta = await invocarIAConReintento(model, prompt);
        return res.status(200).json({ diagnostico: respuesta });
    } catch (error) {
        return res.status(500).json({ error: "El sistema está saturado. Por favor, intente nuevamente en unos segundos." });
    }
}
// ... justo después de recibir la respuesta de la IA
await guardarEnHistorial({
    usuario: req.body.usuario, // O como identifique a su colega
    marca: req.body.marca,
    modelo: req.body.modelo,
    falla: req.body.falla,
    respuesta: diagnosticoIA
});
// --- Función para guardar en el historial ---
async function guardarEnHistorial(data) {
    try {
        const FIREBASE_URL = 'https://metodooc-alumnos-default-rtdb.firebaseio.com/historial_busquedas.json';
        await fetch(FIREBASE_URL, {
            method: 'POST',
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString()
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error al registrar historial:", error);
    }
}