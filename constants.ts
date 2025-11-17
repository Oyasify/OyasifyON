import { Generator, Plan, Theme, PlanName, ThemeName } from "./types";

export const GENERATORS: Generator[] = [
    { id: 'music-idea', name: "Gerador de Ideia de Música", icon: 'fa-lightbulb', description: "Gere temas completos para músicas em qualquer estilo.", category: "Geral", price: 0.40, pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654040.405802BR5901N6001C62090505oyasu6304D235" },
    { id: 'viral-hook', name: "Gerador de Refrão Viral (Hook)", icon: 'fa-fire', description: "Gera refrões curtos e extremamente virais.", category: "TikTok", price: 0.50, pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654040.505802BR5901N6001C62090505oyasu6304B500" },
    { id: 'lyrics', name: "Gerador de Letra Completa", icon: 'fa-file-audio', description: "Gera músicas completas em qualquer estilo.", category: "Geral", price: 0.60, pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654040.605802BR5901N6001C62090505oyasu63041C5F" },
    { id: 'anime-rap', name: "Gerador Anime / Rap Geek", icon: 'fa-ghost', description: "Crie letras no universo geek e de animes.", category: "Anime & Geek Music", price: 0.50, pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654040.505802BR5901N6001C62090505oyasu6304B500" },
    { id: 'beat-concept', name: "Gerador de Beats / Conceitos", icon: 'fa-drum', description: "Receba ideias e conceitos para suas batidas.", category: "Beats", price: 0.30, pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654040.305802BR5901N6001C62090505oyasu6304F79F" },
];

export const PLANS: Record<PlanName, Plan> = {
    'free': { name: 'free', price: 0, pixCode: '', benefits: ['Acesso limitado', 'Funcionalidades básicas'] },
    'Oyasify Light': {
        name: 'Oyasify Light',
        price: 4.90,
        pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654044.905802BR5901N6001C62090505oyasu6304D171",
        benefits: ["20 gerações por dia", "Sem anúncios", "Acesso básico"]
    },
    'Oyasify Plus': {
        name: 'Oyasify Plus',
        price: 7.90,
        pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654047.905802BR5901N6001C62090505oyasu6304DD8D",
        benefits: ["Gerações ilimitadas", "Acesso a todos os estilos", "Turbo mode", "Temas exclusivos"]
    },
    'Oyasify Ultra': {
        name: 'Oyasify Ultra',
        price: 9.90,
        pixCode: "00020126360014BR.GOV.BCB.PIX0114+557399147518152040000530398654049.905802BR5901N6001C62090505oyasu630416CA",
        benefits: ["Acesso Vitalício", "Tudo do Plus", "Prioridade máxima", "Hooks profissionais", "Letras mais ricas"],
        isLifetime: true,
    }
};

export const THEMES: Record<ThemeName, Theme> = {
    "Cosmic Candy": { 
        name: "Cosmic Candy", 
        background: 'linear-gradient(270deg, #5D5C61, #938E99, #B7B5B3, #379683)', 
        textClass: "text-white", 
        primary: "#8EE4AF", 
        secondary: "#5CDB95",
        glowColor1: 'rgba(142, 228, 175, 0.7)',
        glowColor2: 'rgba(92, 219, 149, 0.5)',
        shadow: 'shadow-[0_8px_30px_rgb(142,228,175,0.2)]'
    },
    "Forest Spirit": { 
        name: "Forest Spirit", 
        background: 'linear-gradient(270deg, #1A2980, #26D0CE, #1A2980, #26D0CE)', 
        textClass: "text-white", 
        primary: "#26D0CE", 
        secondary: "#1A2980",
        glowColor1: 'rgba(38, 208, 206, 0.7)',
        glowColor2: 'rgba(26, 41, 128, 0.5)',
        shadow: 'shadow-[0_8px_30px_rgb(38,208,206,0.2)]'
    },
    "Ocean Dreams": { 
        name: "Ocean Dreams", 
        background: 'linear-gradient(270deg, #4b6cb7, #182848, #4b6cb7, #182848)', 
        textClass: "text-white", 
        primary: "#667eea", 
        secondary: "#4b6cb7",
        glowColor1: 'rgba(102, 126, 234, 0.7)',
        glowColor2: 'rgba(75, 108, 183, 0.5)',
        shadow: 'shadow-[0_8px_30px_rgb(102,126,234,0.2)]'
    },
    "Sakura Festival": { 
        name: "Sakura Festival", 
        background: 'linear-gradient(270deg, #FFC0CB, #FF69B4, #FFC0CB, #FF1493)', 
        textClass: "text-white", 
        primary: "#FF69B4", 
        secondary: "#FF1493",
        glowColor1: 'rgba(255, 105, 180, 0.7)',
        glowColor2: 'rgba(255, 20, 147, 0.5)',
        shadow: 'shadow-[0_8px_30px_rgb(255,105,180,0.2)]'
    },
};