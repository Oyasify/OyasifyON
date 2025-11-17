
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LockedView: React.FC = () => {
    const { applyCoupon, simulatePayment } = useAuth();
    const [couponCode, setCouponCode] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApplyCoupon = async () => {
        setIsProcessing(true);
        setMessage(null);
        const result = await applyCoupon(couponCode);
        setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
        setIsProcessing(false);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setMessage(null);
        const result = await simulatePayment();
        setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
        setIsProcessing(false);
    };
    
    return (
        <div className="text-center bg-gray-700/50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-white">Acesso Restrito</h4>
            <p className="text-gray-300 mt-2 mb-4">Você precisa pagar ou usar um código para acessar esta área.</p>
            
            {message && (
                <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
                >
                    Pagar para Liberar
                </button>
                <div className="flex-1 flex gap-2">
                    <input 
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Use código (ex: GRATIS7)"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                     <button 
                        onClick={handleApplyCoupon} 
                        disabled={isProcessing}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                        Usar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LockedView;
