import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PaymentRequest, ProductRequest } from '../../types';

const RequestItem: React.FC<{ request: ProductRequest, onAnswer: (id: string, links: string[]) => void }> = ({ request, onAnswer }) => {
    const [links, setLinks] = useState<string[]>(['', '', '', '', '']);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        await onAnswer(request.id, links);
        setIsProcessing(false);
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-3">
                <p className="font-bold">{request.userNickname}</p>
                <p className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-gray-300 bg-black/20 p-3 rounded-md mb-4">"{request.requestText}"</p>
            <div className="space-y-2">
                {links.map((link, index) => (
                    <input
                        key={index}
                        type="text"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        placeholder={`Produto ${index + 1}: link...`}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                ))}
            </div>
            <button onClick={handleSubmit} disabled={isProcessing} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                {isProcessing ? 'Enviando...' : 'Confirmar e Enviar'}
            </button>
        </div>
    );
}

const AdminPanel: React.FC = () => {
    const { user, getPendingPayments, approvePayment, rejectPayment, getAllPendingProductRequests, answerProductRequest } = useAuth();
    const [view, setView] = useState<'payments' | 'requests'>('payments');

    const [pendingPayments, setPendingPayments] = useState<PaymentRequest[]>([]);
    const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);
    const [pendingRequests, setPendingRequests] = useState<ProductRequest[]>([]);

    const refreshData = () => {
        setPendingPayments(getPendingPayments());
        setPendingRequests(getAllPendingProductRequests());
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleApprovePayment = async (id: string) => {
        setProcessingPaymentId(id);
        await approvePayment(id);
        refreshData();
        setProcessingPaymentId(null);
    };

    const handleRejectPayment = async (id: string) => {
        setProcessingPaymentId(id);
        await rejectPayment(id);
        refreshData();
        setProcessingPaymentId(null);
    };
    
    const handleAnswerRequest = async (id: string, links: string[]) => {
        await answerProductRequest(id, links);
        refreshData();
    };

    if (!user?.profile.badges.includes('⭐ Dono')) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-400">Acesso Negado</h1>
                <p className="text-gray-300">Esta área é restrita para administradores.</p>
            </div>
        );
    }

    const paymentCount = pendingPayments.length;
    const requestCount = pendingRequests.length;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white">Painel do Administrador</h1>

            <div className="flex border-b border-purple-500/30 mb-6">
                <button onClick={() => setView('payments')} className={`py-2 px-4 font-semibold transition-colors ${view === 'payments' ? 'border-b-2 border-purple-400 text-white' : 'text-gray-400'}`}>
                    Pagamentos <span className="bg-red-600 text-xs rounded-full px-2 py-1 ml-1">{paymentCount}</span>
                </button>
                <button onClick={() => setView('requests')} className={`py-2 px-4 font-semibold transition-colors ${view === 'requests' ? 'border-b-2 border-purple-400 text-white' : 'text-gray-400'}`}>
                    Pedidos <span className="bg-red-600 text-xs rounded-full px-2 py-1 ml-1">{requestCount}</span>
                </button>
            </div>
            
            {view === 'payments' && (
                 <div className="bg-black/30 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden border border-purple-500/20">
                     {pendingPayments.length > 0 ? (
                         <>
                            {/* Desktop View: Table */}
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-sm text-left text-gray-300">
                                    <thead className="text-xs text-white uppercase bg-gray-700/50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Usuário</th>
                                            <th scope="col" className="px-6 py-3">Item</th>
                                            <th scope="col" className="px-6 py-3">Tipo</th>
                                            <th scope="col" className="px-6 py-3">Data</th>
                                            <th scope="col" className="px-6 py-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingPayments.map((p) => (
                                            <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                                <td className="px-6 py-4 font-medium whitespace-nowrap">{p.userNickname} <br/> <span className="text-xs text-gray-400">{p.userEmail}</span></td>
                                                <td className="px-6 py-4">{p.itemName}</td>
                                                <td className="px-6 py-4 capitalize">{p.type}</td>
                                                <td className="px-6 py-4">{new Date(p.createdAt).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleApprovePayment(p.id)} disabled={processingPaymentId === p.id} className="font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded disabled:opacity-50">
                                                            {processingPaymentId === p.id ? '...' : 'Aceitar'}
                                                        </button>
                                                        <button onClick={() => handleRejectPayment(p.id)} disabled={processingPaymentId === p.id} className="font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded disabled:opacity-50">
                                                            {processingPaymentId === p.id ? '...' : 'Rejeitar'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile View: Cards */}
                            <div className="block md:hidden p-4 space-y-4">
                                {pendingPayments.map((p) => (
                                    <div key={p.id} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-white">{p.userNickname}</p>
                                                <p className="text-xs text-gray-400">{p.userEmail}</p>
                                            </div>
                                            <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="my-3 py-2 border-y border-gray-700">
                                            <p><span className="font-semibold">Item:</span> {p.itemName} ({p.type})</p>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => handleApprovePayment(p.id)} disabled={processingPaymentId === p.id} className="font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded disabled:opacity-50 text-sm">
                                                {processingPaymentId === p.id ? '...' : 'Aceitar'}
                                            </button>
                                            <button onClick={() => handleRejectPayment(p.id)} disabled={processingPaymentId === p.id} className="font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded disabled:opacity-50 text-sm">
                                                {processingPaymentId === p.id ? '...' : 'Rejeitar'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </>
                     ) : (
                         <p className="p-6 text-center text-gray-400">Nenhum pagamento pendente no momento.</p>
                     )}
                 </div>
            )}

            {view === 'requests' && (
                <div>
                     {pendingRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingRequests.map(req => (
                                <RequestItem key={req.id} request={req} onAnswer={handleAnswerRequest} />
                            ))}
                        </div>
                     ) : (
                         <p className="p-6 text-center text-gray-400 bg-black/20 rounded-lg">Nenhum pedido de produto pendente.</p>
                     )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;