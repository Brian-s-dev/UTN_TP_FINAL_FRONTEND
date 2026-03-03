import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const obtenerRespuestaIA = async (mensajeUsuario) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(mensajeUsuario);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error en la API de Gemini:", error);
        return "Lo siento, estoy teniendo problemas de conexión en este momento.";
    }
};