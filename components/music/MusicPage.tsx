import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  name: string;
  description: string;
  buttonText: string;
  link?: string;
}

const softwareAndPlugins: Record<string, Product[]> = {
  software: [
    { name: 'FL Studio Producer Edition', description: 'DAW completa para produção musical profissional.', buttonText: 'Visitar Site', link: 'https://filecr.com/windows/flstudio-21/' },
    { name: 'Ableton Live Suite', description: 'Software flexível para criação e performance ao vivo.', buttonText: 'Visitar Site', link: 'https://filecr.com/windows/able-tonlivesuite/' },
  ],
  plugins: [
    { name: 'Spitfire Audio LABS (Grátis)', description: 'Coleção de instrumentos virtuais gratuitos de alta qualidade.', buttonText: 'Visitar Site', link: 'https://labs.spitfireaudio.com/' },
    { name: 'Vital - Sintetizador Wavetable (Grátis)', description: 'Sintetizador poderoso e visual com uma versão gratuita incrível.', buttonText: 'Visitar Site', link: 'https://vital.audio/' },
  ],
};


const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { theme } = useAuth();
    const isClickable = !!product.link;

    const content = (
        <div className={`bg-black/20 backdrop-blur-md rounded-3xl border border-purple-500/20 overflow-hidden flex flex-col p-4 h-full transition-transform transform ${theme.shadow}`}>
            <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-sm text-gray-400 mt-1 flex-grow">{product.description}</p>
            </div>
            <button
                disabled={!isClickable}
                className={`mt-4 w-full font-bold py-2 px-4 rounded-lg ${isClickable ? 'cursor-pointer' : 'bg-gray-600 cursor-not-allowed opacity-70'}`}
                style={{ backgroundColor: isClickable ? theme.primary : undefined }}
                title={isClickable ? `Ver ${product.name}` : "Link de afiliado em breve"}
            >
                {product.buttonText}
            </button>
        </div>
    );
    
    if (isClickable) {
        return (
            <a href={product.link} target="_blank" rel="noopener noreferrer" className="no-underline text-white h-full block">
                {content}
            </a>
        );
    }
    
    return content;
};

const MusicPage: React.FC = () => {
  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-2">Ferramentas Musicais</h1>
      <p className="text-lg text-gray-400 mb-8">Softwares, DAWs e plugins para aprimorar suas produções.</p>
      
      {Object.entries(softwareAndPlugins).map(([category, products]) => (
        <section className="mb-12" key={category}>
            <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-purple-500/50 pb-2 capitalize">
                {category === 'software' ? 'Software & DAWs' : 'Plugins Essenciais'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
                <ProductCard key={product.name} product={product} />
            ))}
            </div>
        </section>
      ))}
    </div>
  );
};

export default MusicPage;