import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PlanName } from '../../types';

interface PaymentModalProps {
    type: 'plan' | 'generation';
    itemName: PlanName | string;
    price: number;
    pixCode: string;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ type, itemName, price, pixCode, onClose }) => {
    const { requestPayment, theme } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        const result = await requestPayment(type, itemName, pixCode);
        setMessage(result.message);
        // Don't close automatically, let the user see the message
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`bg-gray-800 rounded-3xl p-8 space-y-6 w-full max-w-md border border-purple-500/30 relative animate-float-up ${theme.shadow}`} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                
                {!message ? (
                    <>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Confirmação de Pagamento</h2>
                            <p className="text-gray-400 mt-2">
                                Item: <span className="font-bold" style={{ color: theme.primary }}>{itemName}</span>
                            </p>
                            <p className="text-4xl font-bold text-white my-4">R$ {price.toFixed(2)}</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">PIX Copia e Cola:</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={pixCode}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 text-xs"
                                />
                                <button onClick={handleCopy} className="text-white font-bold py-2 px-4 rounded-lg text-sm" style={{ backgroundColor: theme.primary }}>
                                    {copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Copie o código acima e pague no seu aplicativo do banco. Após o pagamento, clique em confirmar.
                        </p>

                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : 'Já Paguei, Confirmar'}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <i className="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
                        <h3 className="text-xl font-bold text-white">Pedido Enviado!</h3>
                        <p className="text-gray-300 mt-2">{message}</p>
                        <button onClick={onClose} className="mt-6 font-bold py-2 px-6 rounded-lg" style={{ backgroundColor: theme.primary }}>Fechar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;