import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterProps {
    onNavigate: () => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, theme } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (nickname.length < 3) {
            setError("O nickname deve ter pelo menos 3 caracteres.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await register(nickname, email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent px-4 animate-fade-in">
            <div className={`max-w-md w-full bg-black/30 backdrop-blur-lg rounded-3xl p-8 space-y-6 border border-white/10 ${theme.shadow}`}>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Crie sua Conta</h1>
                    <p className="text-gray-300 mt-2">Comece a criar com IA agora mesmo.</p>
                </div>
                {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-xl text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        placeholder="Nickname (único)"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Senha (mínimo 6 caracteres)"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white font-bold py-3 px-4 rounded-xl transition-transform transform hover:scale-105 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        style={{ backgroundColor: theme.primary }}
                    >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Criar Conta'}
                    </button>
                </form>
                <p className="text-center text-gray-400">
                    Já tem uma conta?{' '}
                    <button onClick={onNavigate} className="font-medium hover:underline" style={{ color: theme.primary }}>
                        Entrar
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;