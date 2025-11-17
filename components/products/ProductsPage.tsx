import React from 'react';
import ToolWrapper from '../dashboard/ToolWrapper';
import LyricGenerator from '../tools/LyricGenerator';
import GenericGenerator from '../tools/GenericGenerator';
import { GENERATORS } from '../../constants';
import Plans from '../payments/Plans';

const ProductsPage: React.FC = () => {
    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Suíte Criativa de IA</h1>
            <p className="text-lg text-gray-400 mb-8">Sua coleção de ferramentas para dar vida às suas ideias. Escolha uma para começar.</p>
            
            <section id="generators" className='mb-12'>
                <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-purple-500/50 pb-2">✨ Ferramentas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GENERATORS.map(tool => (
                        <ToolWrapper key={tool.id} tool={tool}>
                            {tool.id === 'lyrics' 
                                ? <LyricGenerator /> 
                                : <GenericGenerator toolName={tool.name}/>
                            }
                        </ToolWrapper>
                    ))}
                </div>
            </section>

            <section id="premium">
                 <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-purple-500/50 pb-2">⭐ Planos Premium</h2>
                 <Plans />
            </section>
        </div>
    );
};

export default ProductsPage;