/// <reference path="../global.d.ts" />
/// <reference path="../vite-env.d.ts" />
import { GoogleGenerativeAI } from "@google/generative-ai";

const getClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY not found in environment");
    }
    return new GoogleGenerativeAI(apiKey);
};

export const generateDirectorResponse = async (feedback: string): Promise<string> => {
    try {
        const ai = getClient();
        const model = 'gemini-1.5-flash'; // Update to a valid model name

        const genModel = ai.getGenerativeModel({ model });

        const prompt = `You are a pretentious yet charming film director from the 1970s. 
            A viewer has just left the following feedback/message for the "Film Society": "${feedback}". 
            Write a short, witty, 2-sentence response acknowledging their feedback in character. 
            Be encouraging but artistic.`;

        const result = await genModel.generateContent(prompt);
        const response = await result.response;
        return response.text() || "The director is currently in his trailer. Thank you for the note.";
    } catch (error) {
        console.error("Failed to generate response", error);
        return "Our writers are on strike. We received your feedback, thank you.";
    }
};
