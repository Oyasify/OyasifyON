import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface SplashScreenProps {
    onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
    const { theme } = useAuth(); // Use the default theme for splash
    
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
                 <i className="fas fa-star text-6xl text-purple-400"></i>
                 <h1 className="text-6xl font-bold text-white tracking-tight">Oyasify</h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">Explore sua criatividade com o poder da Inteligência Artificial.</p>
            <button
                onClick={onEnter}
                style={{
                    backgroundColor: theme.primary,
                    '--glow-color-1': theme.glowColor1,
                    '--glow-color-2': theme.glowColor2,
                } as React.CSSProperties}
                className="text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-110 pulse-glow"
            >
                Entrar
            </button>
        </div>
    );
};

export default SplashScreen;