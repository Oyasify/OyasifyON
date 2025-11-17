import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    onNavigate: (view: 'dashboard' | 'profile' | 'admin' | 'oyasify-ai' | 'products' | 'music') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const { user, logout, theme, getNotificationCount } = useAuth();
    const isAdmin = user?.profile.badges.includes('⭐ Dono');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const walletRef = useRef<HTMLDivElement>(null);
    const notificationCount = getNotificationCount();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (walletRef.current && !walletRef.current.contains(event.target as Node)) {
                setIsWalletOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef, walletRef]);

    return (
        <header className="bg-black/20 backdrop-blur-sm shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => onNavigate('dashboard')} className="flex-shrink-0 flex items-center gap-2 text-white">
                            <i className={`fas fa-star text-xl`} style={{ color: theme.primary }}></i>
                            <span className="font-bold text-xl">Oyasify</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {isAdmin && (
                             <div className="flex items-center gap-2 sm:gap-4">
                                <div className="relative" ref={walletRef}>
                                    <button onClick={() => setIsWalletOpen(!isWalletOpen)} className="text-sm font-bold p-2 rounded-lg bg-green-500/20 text-green-300 flex items-center gap-2">
                                        <i className="fas fa-wallet text-lg"></i>
                                    </button>
                                    {isWalletOpen && (
                                        <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-gray-800/90 backdrop-blur-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in ${theme.shadow}`} style={{ animationDuration: '200ms' }}>
                                            <div className="p-4 text-center">
                                                <p className="text-sm text-gray-300">Faturamento Total</p>
                                                <p className="text-2xl font-bold text-white mt-1">
                                                    R$ {user?.walletBalance?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => onNavigate('admin')} className={`relative text-sm font-bold p-2 rounded-lg bg-yellow-500/20 text-yellow-300 flex items-center gap-2`}>
                                    <i className="fas fa-bell"></i>
                                    <span className="hidden sm:inline">Painel Admin</span>
                                    {notificationCount > 0 && (
                                         <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-800">
                                            {notificationCount}
                                        </span>
                                    )}
                                </button>
                             </div>
                        )}
                         <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10">
                                <img src={user?.profile.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover"/>
                            </button>
                            {isDropdownOpen && (
                                <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-gray-800/90 backdrop-blur-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in ${theme.shadow}`} style={{ animationDuration: '200ms' }}>
                                    <div className="py-1">
                                        <div className="px-4 py-3 border-b border-gray-700">
                                            <p className="text-sm text-white">Logado como</p>
                                            <p className="truncate text-sm font-medium text-gray-300">{user?.nickname}</p>
                                        </div>
                                        <button onClick={() => { onNavigate('profile'); setIsDropdownOpen(false); }} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-4 py-2 text-sm">Seu Perfil</button>
                                        <button onClick={() => { onNavigate('products'); setIsDropdownOpen(false); }} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-4 py-2 text-sm">Suíte Criativa de IA</button>
                                        <button onClick={() => { onNavigate('music'); setIsDropdownOpen(false); }} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-4 py-2 text-sm">Música</button>
                                        <button onClick={() => { onNavigate('oyasify-ai'); setIsDropdownOpen(false); }} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-4 py-2 text-sm">Oyasify AI</button>
                                        <div className="border-t border-gray-700 my-1"></div>
                                        <button onClick={logout} className="text-red-400 hover:bg-red-500/20 hover:text-red-300 block w-full text-left px-4 py-2 text-sm">Sair</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;