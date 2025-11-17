import { GoogleGenAI } from "@google/genai";

// IMPORTANT: This key is managed externally by the environment. Do not change this line.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("API_KEY environment variable not set. AI features will be in demo mode.");
}

interface GenerationParams {
    prompt: string;
    style?: string;
    mood?: string;
    bpm?: string;
    keySignature?: string;
    toolName?: string;
}

export const generateContent = async (params: GenerationParams): Promise<string> => {
    if (!ai) {
        return Promise.resolve(`Modo de demonstração: A funcionalidade de IA está desativada porque a API Key não foi configurada.

Resultado para "${params.prompt}" no estilo ${params.style || 'padrão'}:

(Verso 1)
No mundo digital, sem chave pra ligar
Oyasify dorme, sem canção pra mostrar
Um gerador potente, em modo de espera
Sonhando com os versos da nova era.

(Refrão)
Oh, modo de demonstração, tela sem cor
Me dê a API Key, por favor!
Quero criar hits, sentir a emoção
Mas sem a chave, só resta a simulação.`);
    }
    
    try {
        let fullPrompt: string;

        if (params.toolName === 'Oyasify AI') {
            fullPrompt = `Você é 'Oyasify AI', um assistente de IA geral e prestativo. Responda à pergunta do usuário de forma concisa e útil. Pergunta do usuário: "${params.prompt}"`;
        } else {
            fullPrompt = `
                Você é 'Oyasify', um assistente de IA especialista em criação musical.
                Sua tarefa é usar a ferramenta "${params.toolName || 'Gerador de Conteúdo'}".
                
                Detalhes da Requisição do Usuário:
                - Pedido: ${params.prompt}
                - Estilo Musical: ${params.style || 'Não especificado'}
                - Humor/Vibe: ${params.mood || 'Não especificado'}
                - BPM: ${params.bpm || 'Não especificado'}
                - Tonalidade: ${params.keySignature || 'Não especificado'}

                Gere uma resposta criativa, útil e bem formatada.
            `;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Ocorreu um erro ao tentar gerar o conteúdo. Por favor, tente novamente.";
    }
};