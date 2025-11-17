import React, { useState } from 'react';
import { generateContent } from '../../services/geminiService';
import { useAuth } from '../../hooks/useAuth';

interface GenericGeneratorProps {
    toolName: string;
}

const GenericGenerator: React.FC<GenericGeneratorProps> = ({ toolName }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const { theme: appTheme } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult('');
        const generatedContent = await generateContent({ prompt, toolName });
        setResult(generatedContent);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Seu Pedido</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Descreva o que você quer criar com o ${toolName}...`}
                        required
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg text-white px-3 py-2 h-24 focus:outline-none focus:ring-2"
                        style={{borderColor: appTheme.secondary, '--tw-ring-color': appTheme.primary} as React.CSSProperties}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: appTheme.primary }}
                >
                    {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Gerando...</> : <><i className="fas fa-magic"></i> Gerar</>}
                </button>
            </form>

            {result && (
                <div className="mt-6 bg-black/20 p-6 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-bold text-white mb-3">Resultado:</h4>
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default GenericGenerator;
