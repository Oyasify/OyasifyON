import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ProductRequest } from '../../types';

interface Product {
  name: string;
  description: string;
  link: string;
}

const productCategories: Record<string, { name: string; icon: string; products: Product[] }> = {
  microfones: {
    name: 'Microfones',
    icon: 'fa-microphone-alt',
    products: [
      { name: 'Microfone Condensador Lexsen', description: 'Excelente custo-benefício para gravações de voz com clareza.', link: 'https://amzn.to/486rdcv' },
      { name: 'Microfone Fifine AM8', description: 'Microfone dinâmico versátil, ótimo para streaming, podcast e vocais.', link: 'https://amzn.to/3K50ViM' },
      { name: 'HyperX QuadCast S', description: 'Microfone condensador USB com múltiplos padrões polares e iluminação RGB.', link: 'https://amzn.to/3K3qocm' },
      { name: 'Microfone Condensador AT2020', description: 'Qualidade de estúdio. Um padrão da indústria para home studios.', link: 'https://amzn.to/3LRG56Z' },
    ],
  },
  'interfaces-fones': {
    name: 'Interfaces & Fones',
    icon: 'fa-headphones-alt',
    products: [
      { name: 'Fifine Interface de Audio', description: 'Interface de áudio simples e eficaz para conectar microfones XLR ao seu PC.', link: 'https://amzn.to/4i7x1qL' },
      { name: 'Interface Focusrite Scarlett 2i2', description: 'Conecte seu microfone com pré-amps de alta qualidade e clareza cristalina.', link: 'https://amzn.to/4oNltvp' },
      { name: 'Fone Audio-Technica ATH-M50x', description: 'Monitoramento preciso para gravação e mixagem, aclamado pela crítica.', link: 'https://amzn.to/4oTOipV' },
      { name: 'Headset Gamer Logitech G335', description: 'Leve e confortável para longas sessões, com áudio de qualidade.', link: 'https://amzn.to/47LmvSC' },
      { name: 'Havit Headphone Fone H2002d', description: 'Fone de ouvido com bom custo-benefício para jogos e monitoramento casual.', link: 'https://amzn.to/49i95P3' },
    ]
  },
  pcs: {
    name: 'PCs para Produção',
    icon: 'fa-desktop',
    products: [
      { name: 'Pc Completo (Barato)', description: 'Configuração de entrada para começar a produzir sem gastar muito.', link: 'https://amzn.to/3WZZhBW' },
      { name: 'Pc Completo (Acessível)', description: 'Ótimo equilíbrio entre performance e preço para um fluxo de trabalho fluido.', link: 'https://amzn.to/3LITPkz' },
      { name: 'Pc Completo (Caro)', description: 'Máquina de alta performance para projetos complexos e uso profissional.', link: 'https://amzn.to/4oLGo1S' },
    ],
  },
  celulares: {
      name: 'Celulares',
      icon: 'fa-mobile-alt',
      products: [
          { name: 'Samsung Galaxy A16 5G', description: 'Bom desempenho e conectividade 5G para o dia a dia.', link: 'https://amzn.to/3XkkLtz' },
          { name: 'Apple iPhone 13', description: 'Excelente câmera e performance, um ótimo custo-benefício da Apple.', link: 'https://amzn.to/43zMdHf' },
          { name: 'Apple iPhone 17 Pro', description: 'O futuro da performance e fotografia em um smartphone (Link de referência).', link: 'https://amzn.to/4i9S38i' },
          { name: 'Motorola Moto g56 5G', description: 'Experiência Android com tela fluida e boa bateria.', link: 'https://amzn.to/4pdrUYe' },
      ]
  },
  perifericos: {
    name: 'Teclados & Mouses',
    icon: 'fa-keyboard',
    products: [
      { name: 'Redragon TECLADO GAMER MECANICO', description: 'Teclado mecânico preciso e durável para produção e jogos.', link: 'https://amzn.to/47L33W3' },
      { name: 'Mouse Gamer ATTACK SHARK X11', description: 'Mouse leve e de alta precisão, ideal para longas sessões de edição.', link: 'https://amzn.to/43BmfDb' },
    ],
  },
  mousepads: {
    name: 'Mousepads',
    icon: 'fa-mouse-pointer',
    products: [
      { name: 'Mouse Pad Gamer Mapa Mundi Extra Grande', description: 'Superfície ampla para movimentos livres e precisos.', link: 'https://amzn.to/4pgxN7b' },
      { name: 'Havit Mouse Pad Grande Gamer MP860', description: 'Qualidade e durabilidade para gamers e criadores.', link: 'https://amzn.to/4p3cg2h' },
      { name: 'Mousepad Gamer Redragon Flick XL Cypher', description: 'Edição especial com design único e superfície otimizada.', link: 'https://amzn.to/4hZnDVW' },
    ]
  }
};

const ProductCard: React.FC<{ product: Product, index: number }> = ({ product, index }) => {
    const { theme } = useAuth();
    return (
        <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ animationDelay: `${index * 100}ms` }} className={`animate-float-up no-underline text-white h-full block bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden p-4 transition-all duration-300 ${theme.shadow} hover:border-purple-400/50`}>
            <div className="flex flex-col h-full">
                <h3 className="text-lg font-bold text-white flex-grow">{product.name}</h3>
                <p className="text-sm text-gray-400 mt-1 mb-4">{product.description}</p>
                <div className="mt-auto w-full font-bold py-2 px-4 rounded-xl text-center" style={{ backgroundColor: theme.primary }}>
                    Ver Oferta na Amazon
                </div>
            </div>
        </a>
    );
};

const RequestFormSection = () => {
    const { createProductRequest, theme } = useAuth();
    const [requestText, setRequestText] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!requestText.trim()) return;
        setIsSubmitting(true);
        const result = await createProductRequest(requestText);
        setMessage(result.message);
        setRequestText('');
        setIsSubmitting(false);
        setTimeout(() => setMessage(''), 5000);
    }
    
    return (
        <div className={`bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 p-6 ${theme.shadow}`}>
            <h3 className="text-xl font-bold text-white mb-2">Não encontrou o que queria?</h3>
            <p className="text-gray-400 mb-4 text-sm">Descreva o que você precisa e nosso dono irá encontrar as melhores opções para você em até 24h!</p>
            <form onSubmit={handleSubmit}>
                <textarea 
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Ex: 'Um microfone bom para voz e violão até R$500'"
                    required
                    className="w-full bg-gray-800/60 border border-gray-600 rounded-xl text-white p-3 h-24 focus:outline-none focus:ring-2 resize-y"
                    style={{'--tw-ring-color': theme.primary} as React.CSSProperties}
                />
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="mt-4 w-full font-bold py-2 px-4 rounded-xl transition-transform transform hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: theme.primary }}
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
                </button>
                {message && <p className="text-green-400 text-sm mt-3 text-center">{message}</p>}
            </form>
        </div>
    );
};

const MyRequestsSection = () => {
    const { getProductRequestsForUser, theme } = useAuth();
    const [myRequests, setMyRequests] = useState<ProductRequest[]>([]);

    useEffect(() => {
        setMyRequests(getProductRequestsForUser());
    }, []); // Note: This won't auto-update. A refresh mechanism would be needed for real-time.

    return (
        <div className={`bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 p-6 ${theme.shadow}`}>
            <h3 className="text-xl font-bold text-white mb-4">Meus Pedidos</h3>
            {myRequests.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Você ainda não fez nenhum pedido.</p>
            ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {myRequests.map(req => (
                        <div key={req.id} className="bg-gray-800/50 p-4 rounded-xl">
                            <p className="text-sm text-gray-300 mb-2">"{req.requestText}"</p>
                            {req.status === 'pending' ? (
                                <p className="text-xs font-bold text-yellow-400">Status: Pendente</p>
                            ) : (
                                <div>
                                    <p className="text-xs font-bold text-green-400 mb-2">Status: Respondido!</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                        {req.productLinks?.map((link, index) => (
                                            <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="text-center text-sm font-bold py-2 px-2 rounded-lg" style={{ backgroundColor: theme.primary }}>
                                                Opção {index + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { theme } = useAuth();
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

    if (selectedCategoryKey) {
        const category = productCategories[selectedCategoryKey];
        return (
            <div className="container mx-auto animate-fade-in">
                <button onClick={() => setSelectedCategoryKey(null)} className="flex items-center gap-2 mb-6 text-purple-300 hover:text-white">
                    <i className="fas fa-arrow-left"></i>
                    Voltar para Categorias
                </button>
                <h2 className="text-3xl font-bold text-white mb-6 capitalize">{category.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.products.map((product, index) => (
                        <ProductCard key={product.name} product={product} index={index}/>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="animate-float-up">
                <h1 className="text-4xl font-bold text-white mb-2">Equipamentos & Ferramentas</h1>
                <p className="text-lg text-gray-400 mb-8">Nossa seleção de produtos para seu setup criativo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(productCategories).map(([key, category], index) => (
                    <div key={key} onClick={() => setSelectedCategoryKey(key)} style={{ animationDelay: `${100 + index * 100}ms` }} className={`animate-float-up bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${theme.shadow} hover:border-purple-400/50`}>
                        <i className={`fas ${category.icon} text-4xl mb-4`} style={{ color: theme.primary }}></i>
                        <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                        <div className="mt-4 font-bold py-2 px-6 rounded-xl" style={{ backgroundColor: theme.primary }}>
                            Ver Produtos
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 border-t border-white/10 pt-8 animate-float-up" style={{ animationDelay: '500ms'}}>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <RequestFormSection />
                    <MyRequestsSection />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;