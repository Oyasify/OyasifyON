import React, { useState, useRef, useEffect } from 'react';
import { generateContent } from '../../services/geminiService';
import { useAuth } from '../../hooks/useAuth';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const OyasifyAI: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Olá! Sou a Oyasify AI. Como posso te ajudar hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useAuth();
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await generateContent({ prompt: input, toolName: 'Oyasify AI' });
            const modelMessage: Message = { role: 'model', text: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: Message = { role: 'model', text: 'Desculpe, ocorreu um erro. Tente novamente.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto h-full flex flex-col max-w-3xl">
            <h1 className="text-3xl font-bold mb-4 text-center">Oyasify AI</h1>
            <div className="flex-grow bg-black/30 rounded-lg p-4 overflow-y-auto border border-purple-500/20 mb-4">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.role === 'model' && <i className="fas fa-robot text-xl text-purple-400 mb-1"></i>}
                            <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.text.trim()}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start items-end gap-2">
                             <i className="fas fa-robot text-xl text-purple-400 mb-1"></i>
                             <div className="max-w-lg p-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                                <i className="fas fa-spinner fa-spin"></i>
                             </div>
                         </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend();}} className="flex gap-2">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Converse com a Oyasify AI..."
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg text-white p-3 focus:outline-none focus:ring-2 resize-none"
                    style={{borderColor: theme.secondary, '--tw-ring-color': theme.primary} as React.CSSProperties}
                    rows={1}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="font-bold py-2 px-6 rounded-lg text-lg transition-colors disabled:opacity-50" style={{ backgroundColor: theme.primary }}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
}

export default OyasifyAI;
