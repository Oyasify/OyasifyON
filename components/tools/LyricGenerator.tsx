import React, { useState } from 'react';
import { generateContent } from '../../services/geminiService';
import { useAuth } from '../../hooks/useAuth';

const musicStyles = [
    "Rap Geek / Música Geek", "Trap", "Acústico", "Sad / Triste", "Indie",
    "Lo-fi", "Rock alternativo", "Hyperpop", "Drill", "K-pop style", "Pop moderno"
];


const LyricGenerator: React.FC = () => {
    const [style, setStyle] = useState(musicStyles[0]);
    const [theme, setTheme] = useState('');
    const [mood, setMood] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const { theme: appTheme } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult('');
        const prompt = `Gere uma letra de música com o tema "${theme}".`;
        const generatedLyrics = await generateContent({ prompt, style, mood });
        setResult(generatedLyrics);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Estilo Musical</label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2"
                            style={{borderColor: appTheme.secondary, '--tw-ring-color': appTheme.primary} as React.CSSProperties}
                        >
                            {musicStyles.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Humor/Vibe</label>
                        <input
                            type="text"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            placeholder="Ex: reflexivo, energético, sombrio"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2"
                             style={{borderColor: appTheme.secondary, '--tw-ring-color': appTheme.primary} as React.CSSProperties}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tema Principal</label>
                    <textarea
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="Descreva sobre o que é a música..."
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
                    {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Gerando...</> : <><i className="fas fa-magic"></i> Gerar Letra</>}
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

export default LyricGenerator;
