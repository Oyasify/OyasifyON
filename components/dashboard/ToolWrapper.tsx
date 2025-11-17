import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PaymentModal from '../payments/PaymentModal';
import { Generator } from '../../types';
import { PLANS } from '../../constants';

interface ToolWrapperProps {
    tool: Generator;
    children: React.ReactNode;
}

const ToolWrapper: React.FC<ToolWrapperProps> = ({ tool, children }) => {
    const { checkAccess, user, consumeCredit, theme } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isToolVisible, setIsToolVisible] = useState(false);
    
    const credits = user?.generationCredits[tool.id] || 0;
    const { hasAccess, isSubscribed } = checkAccess(tool.id);

    const handleAccess = () => {
        if (hasAccess) {
            if(!isToolVisible){
                consumeCredit(tool.id);
            }
            setIsToolVisible(!isToolVisible);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className={`bg-black/20 backdrop-blur-md rounded-3xl border border-purple-500/20 transition-all duration-300 flex flex-col ${theme.shadow}`}>
                <div className="p-6 text-left flex-grow">
                    <div className="flex items-center gap-4">
                        <i className={`fas ${tool.icon} text-2xl`} style={{ color: theme.primary }}></i>
                        <div>
                            <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                            <p className="text-gray-400 text-sm">{tool.description}</p>
                        </div>
                    </div>
                </div>
                 <div className={`p-4 border-t border-gray-700/50 flex items-center ${hasAccess ? 'justify-between' : 'justify-end'}`}>
                    {hasAccess && (
                        <div className="text-sm text-gray-300">
                             {isSubscribed && (PLANS[user?.access.plan || 'free'].benefits.includes('Gerações ilimitadas')) ? (
                                <span className='text-green-400'>Acesso Ilimitado</span>
                            ) : (
                                <span>Créditos: <span className="font-bold text-white">{credits}</span></span>
                            )}
                        </div>
                    )}
                    <button onClick={handleAccess} className="font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105" style={{ backgroundColor: theme.primary }}>
                        {hasAccess ? (isToolVisible ? 'Fechar' : 'Usar') : `Pagar (R$${tool.price.toFixed(2)})`}
                    </button>
                </div>
                {isToolVisible && hasAccess && (
                     <div className="p-6 border-t border-gray-700/50">
                        {children}
                    </div>
                )}
            </div>
            {isModalOpen && (
                <PaymentModal
                    type="generation"
                    itemName={tool.id}
                    price={tool.price}
                    pixCode={tool.pixCode}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default ToolWrapper;