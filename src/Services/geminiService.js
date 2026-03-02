import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializamos la API con la clave del archivo .env
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const obtenerRespuestaIA = async (mensajeUsuario) => {
    try {
        // Elegimos el modelo (gemini-pro es bueno para texto)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generamos la respuesta
        const result = await model.generateContent(mensajeUsuario);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error en la API de Gemini:", error);
        return "Lo siento, estoy teniendo problemas de conexión en este momento.";
    }
};