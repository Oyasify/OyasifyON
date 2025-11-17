import React, { useState } from 'react';
import { Plan, PlanName } from '../../types';
import { PLANS } from '../../constants';
import PaymentModal from './PaymentModal';
import { useAuth } from '../../hooks/useAuth';

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, theme } = useAuth();
    const isCurrentPlan = user?.access.plan === plan.name;

    return (
        <>
            <div className={`flex flex-col bg-black/20 backdrop-blur-md rounded-3xl border ${isCurrentPlan ? `border-green-400 ${theme.shadow}` : `border-purple-500/20 ${theme.shadow}`} p-6`}>
                <h3 className="text-2xl font-bold" style={{ color: theme.primary }}>{plan.name}</h3>
                <p className="text-4xl font-extrabold my-4">
                    R${plan.price.toFixed(2)}
                    {plan.isLifetime ? (
                        <span className="text-base font-normal text-gray-400"> Pagamento Único</span>
                    ) : (
                        <span className="text-base font-normal text-gray-400"> /mês</span>
                    )}
                </p>
                <ul className="space-y-2 text-gray-300 flex-grow">
                    {plan.benefits.map(benefit => (
                        <li key={benefit} className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-400"></i>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isCurrentPlan}
                    className="mt-6 w-full font-bold py-3 px-4 rounded-xl transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    style={{ backgroundColor: isCurrentPlan ? 'transparent' : theme.primary }}
                >
                    {isCurrentPlan ? 'Plano Atual' : (plan.isLifetime ? 'Acesso Vitalício' : 'Assinar Agora')}
                </button>
            </div>
            {isModalOpen && (
                <PaymentModal
                    type="plan"
                    itemName={plan.name}
                    price={plan.price}
                    pixCode={plan.pixCode}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}


const Plans: React.FC = () => {
    const planOrder: PlanName[] = ['Oyasify Light', 'Oyasify Plus', 'Oyasify Ultra'];
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planOrder.map(planName => (
                <PlanCard key={planName} plan={PLANS[planName]} />
            ))}
        </div>
    );
};

export default Plans;