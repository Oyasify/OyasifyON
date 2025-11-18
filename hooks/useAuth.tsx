import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { User, PlanName, PaymentRequest, Theme, ThemeName, ProductRequest } from '../types';
import { THEMES, PLANS, GENERATORS } from '../constants';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    theme: Theme;
    login: (email: string, password: string) => Promise<void>;
    register: (nickname: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (updatedProfileData: Partial<User['profile']>) => Promise<void>;
    checkAccess: (generatorId: string) => { hasAccess: boolean; isSubscribed: boolean };
    consumeCredit: (generatorId: string) => void;
    // Payment related
    requestPayment: (type: 'plan' | 'generation', itemName: string, pixCode: string) => Promise<{ success: boolean; message: string }>;
    getPendingPayments: () => PaymentRequest[];
    approvePayment: (paymentId: string) => Promise<void>;
    rejectPayment: (paymentId: string) => Promise<void>;
    applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string }>;
    // FIX: Added simulatePayment to fix an error in LockedView.tsx
    simulatePayment: () => Promise<{ success: boolean; message: string }>;
    // Product Requests
    createProductRequest: (requestText: string) => Promise<{ success: boolean; message: string }>;
    myProductRequests: ProductRequest[];
    getAllPendingProductRequests: () => ProductRequest[];
    answerProductRequest: (requestId: string, links: string[]) => Promise<void>;
    getNotificationCount: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const simpleHash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return h.toString();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<Theme>(THEMES['Ocean Dreams']);
    const [myProductRequests, setMyProductRequests] = useState<ProductRequest[]>([]);

    // --- LocalStorage Helpers ---
    const getFromStorage = <T,>(key: string, defaultValue: T): T => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    };
    const saveToStorage = <T,>(key: string, value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const updateUserInStorage = useCallback((updatedUser: User) => {
        const users = getFromStorage<User[]>('oyasify_users', []);
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        saveToStorage('oyasify_users', updatedUsers);
    }, []);

    useEffect(() => {
        const users = getFromStorage<User[]>('oyasify_users', []);
        const loggedInUserId = getFromStorage<string | null>('oyasify_loggedInUser', null);
        if (loggedInUserId) {
            let currentUser = users.find(u => u.id === loggedInUserId);
            if (currentUser) {
                // Check for expired subscription on load
                if (currentUser.access.expiresAt && Date.now() > currentUser.access.expiresAt) {
                    currentUser = {
                        ...currentUser,
                        access: { plan: 'free', expiresAt: null },
                        profile: {
                            ...currentUser.profile,
                            badges: currentUser.profile.badges.filter(b => b !== '🌟 Premium'),
                        }
                    };
                    updateUserInStorage(currentUser);
                }
                setUser(currentUser);

                const allRequests = getFromStorage<ProductRequest[]>('oyasify_product_requests', []);
                const userRequests = allRequests.filter(r => r.userId === currentUser.id).sort((a, b) => b.createdAt - a.createdAt);
                setMyProductRequests(userRequests);

                const userTheme = THEMES[currentUser.profile.theme] || THEMES['Ocean Dreams'];
                setTheme(userTheme);
            }
        }
        setLoading(false);
    }, [updateUserInStorage]);

    // Real-time subscription expiration check
    useEffect(() => {
        const intervalId = setInterval(() => {
            setUser(currentUser => {
                if (currentUser && currentUser.access.expiresAt && Date.now() > currentUser.access.expiresAt) {
                    console.log(`Subscription for ${currentUser.nickname} has expired. Downgrading.`);
                    const updatedUser: User = {
                        ...currentUser,
                        access: { plan: 'free', expiresAt: null },
                        profile: {
                            ...currentUser.profile,
                            badges: currentUser.profile.badges.filter(b => b !== '🌟 Premium'),
                        }
                    };
                    updateUserInStorage(updatedUser);
                    return updatedUser;
                }
                return currentUser;
            });
        }, 1000 * 60); // Check every minute for expired plans

        return () => clearInterval(intervalId);
    }, [updateUserInStorage]);


    const login = async (email: string, password: string) => {
        const users = getFromStorage<User[]>('oyasify_users', []);
        const lowercasedEmail = email.toLowerCase();
        const foundUser = users.find(u => u.email.toLowerCase() === lowercasedEmail && u.passwordHash === simpleHash(password));
        if (foundUser) {
            setUser(foundUser);
            const allRequests = getFromStorage<ProductRequest[]>('oyasify_product_requests', []);
            const userRequests = allRequests.filter(r => r.userId === foundUser.id).sort((a, b) => b.createdAt - a.createdAt);
            setMyProductRequests(userRequests);
            const userTheme = THEMES[foundUser.profile.theme] || THEMES['Ocean Dreams'];
            setTheme(userTheme);
            saveToStorage('oyasify_loggedInUser', foundUser.id);
        } else {
            throw new Error("Conta não encontrada");
        }
    };

    const register = async (nickname: string, email: string, password: string) => {
        const users = getFromStorage<User[]>('oyasify_users', []);
        const lowercasedEmail = email.toLowerCase();

        if (!lowercasedEmail.endsWith('@gmail.com')) {
            throw new Error("Por favor, utilize um e-mail @gmail.com para se cadastrar.");
        }

        if (users.some(u => u.email.toLowerCase() === lowercasedEmail)) {
            throw new Error("Este e-mail já está em uso.");
        }

        if (users.some(u => u.nickname.toLowerCase() === nickname.toLowerCase())) {
            throw new Error("Este nickname já está em uso.");
        }

        const isRegisteringAsAdmin = nickname.toLowerCase() === 'oyasu';
        
        if (isRegisteringAsAdmin && users.some(u => u.nickname.toLowerCase() === 'oyasu')) {
            throw new Error("O nickname 'Oyasu' não está mais disponível.");
        }

        const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            nickname,
            passwordHash: simpleHash(password),
            profile: {
                nickname,
                profilePicture: `https://avatar.iran.liara.run/public/boy?username=${nickname}`,
                banner: `https://picsum.photos/seed/${nickname}_banner/800/200`,
                bio: isRegisteringAsAdmin ? 'Dono do Oyasify.' : 'Novo na Oyasify!',
                badges: isRegisteringAsAdmin ? ['⭐ Dono'] : [],
                theme: 'Ocean Dreams',
            },
            access: { plan: isRegisteringAsAdmin ? 'Oyasify Ultra' : 'free', expiresAt: null },
            generationCredits: {},
            couponsUsed: [],
            walletBalance: isRegisteringAsAdmin ? 396.83 : 0,
        };
        
        saveToStorage('oyasify_users', [...users, newUser]);
        
        setUser(newUser);
        setMyProductRequests([]);
        setTheme(THEMES[newUser.profile.theme]);
        saveToStorage('oyasify_loggedInUser', newUser.id);
    };

    const logout = () => {
        setUser(null);
        setMyProductRequests([]);
        saveToStorage('oyasify_loggedInUser', null);
        // Force a full redirect to clear all component state and prevent data leakage between sessions.
        window.location.href = '/';
    };
    
    const updateProfile = async (updatedProfileData: Partial<User['profile']>) => {
        if (!user) return;
        const updatedUser = { ...user, profile: { ...user.profile, ...updatedProfileData } };
        setUser(updatedUser);
        updateUserInStorage(updatedUser);
        if (updatedProfileData.theme) {
            setTheme(THEMES[updatedProfileData.theme]);
        }
    };

    const checkAccess = useCallback((generatorId: string) => {
        if (!user) return { hasAccess: false, isSubscribed: false };
        if (user.profile.badges.includes('⭐ Dono')) {
            return { hasAccess: true, isSubscribed: true };
        }

        const plan = PLANS[user.access.plan];
        if (!plan) return { hasAccess: false, isSubscribed: false };

        const isSubscribed = user.access.plan !== 'free';
        const hasUnlimitedGenerations = plan.benefits.includes('Gerações ilimitadas');
        
        if (hasUnlimitedGenerations && isSubscribed) {
            return { hasAccess: true, isSubscribed: true };
        }
        
        const credits = user.generationCredits[generatorId] || 0;
        if (credits > 0) {
            return { hasAccess: true, isSubscribed };
        }

        return { hasAccess: false, isSubscribed };
    }, [user]);

    const consumeCredit = (generatorId: string) => {
        if(!user || user.profile.badges.includes('⭐ Dono')) return;

        const { isSubscribed } = checkAccess(generatorId);
        const plan = PLANS[user.access.plan];
        const hasUnlimitedGenerations = plan.benefits.includes('Gerações ilimitadas');
        if(isSubscribed && hasUnlimitedGenerations) return; // Don't consume credits for unlimited plans

        const currentCredits = user.generationCredits[generatorId] || 0;
        if(currentCredits > 0) {
            const updatedUser = {
                ...user,
                generationCredits: {
                    ...user.generationCredits,
                    [generatorId]: currentCredits - 1,
                }
            };
            setUser(updatedUser);
            updateUserInStorage(updatedUser);
        }
    }

    const requestPayment = async (type: 'plan' | 'generation', itemName: string, pixCode: string): Promise<{ success: boolean; message: string }> => {
        if (!user) return { success: false, message: "Você precisa estar logado." };
        
        const payments = getFromStorage<PaymentRequest[]>('oyasify_payments', []);
        const newPayment: PaymentRequest = {
            id: `payment_${Date.now()}`,
            userId: user.id,
            userEmail: user.email,
            userNickname: user.nickname,
            type,
            itemName,
            pixCode,
            status: 'pending',
            createdAt: Date.now()
        };
        saveToStorage('oyasify_payments', [...payments, newPayment]);
        return { success: true, message: "Seu acesso será liberado em até 24 horas após análise do pagamento." };
    };

    const getPendingPayments = () => {
        const payments = getFromStorage<PaymentRequest[]>('oyasify_payments', []);
        return payments.filter(p => p.status === 'pending').sort((a, b) => b.createdAt - a.createdAt);
    };

    const approvePayment = async (paymentId: string) => {
        const payments = getFromStorage<PaymentRequest[]>('oyasify_payments', []);
        const payment = payments.find(p => p.id === paymentId);
        if (!payment) return;

        let users = getFromStorage<User[]>('oyasify_users', []);
        let targetUser = users.find(u => u.id === payment.userId);
        if (!targetUser) return;
        
        let purchasePrice = 0;

        if (payment.type === 'plan') {
            const planName = payment.itemName as PlanName;
            const plan = PLANS[planName];
            purchasePrice = plan?.price || 0;
            targetUser.access.plan = planName;
            
            if (plan?.isLifetime) {
                targetUser.access.expiresAt = null; // Lifetime access
            } else {
                targetUser.access.expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
            }

            if(!targetUser.profile.badges.includes('🌟 Premium')) {
                targetUser.profile.badges.push('🌟 Premium');
            }
        } else if (payment.type === 'generation') {
            const generator = GENERATORS.find(g => g.id === payment.itemName);
            purchasePrice = generator?.price || 0;
            const currentCredits = targetUser.generationCredits[payment.itemName] || 0;
            targetUser.generationCredits[payment.itemName] = currentCredits + 1;
        }
        
        // Update admin wallet
        let adminUser = users.find(u => u.profile.badges.includes('⭐ Dono'));
        if(adminUser) {
            adminUser.walletBalance = (adminUser.walletBalance || 0) + purchasePrice;
            users = users.map(u => u.id === adminUser.id ? adminUser : u);
        }
        
        users = users.map(u => u.id === targetUser.id ? targetUser : u);
        saveToStorage('oyasify_users', users);
        
        payment.status = 'approved';
        saveToStorage('oyasify_payments', payments.map(p => p.id === paymentId ? payment : p));

        // If the current user is affected, update state
        if(user && (user.id === targetUser.id || user.id === adminUser?.id)) {
            const updatedCurrentUser = users.find(u => u.id === user.id)!;
            setUser(updatedCurrentUser);
        }
    };

    const rejectPayment = async (paymentId: string) => {
        const payments = getFromStorage<PaymentRequest[]>('oyasify_payments', []);
        const payment = payments.find(p => p.id === paymentId);
        if (payment) {
            payment.status = 'rejected';
            saveToStorage('oyasify_payments', payments);
        }
    };

    const applyCoupon = async (couponCode: string): Promise<{ success: boolean; message: string }> => {
        if (!user) {
            return { success: false, message: 'Você precisa estar logado.' };
        }
        if (couponCode.toUpperCase() !== 'GRATIS7') {
            return { success: false, message: 'Cupom inválido ou expirado.' };
        }
        if (user.couponsUsed?.includes('GRATIS7')) {
            return { success: false, message: 'Você já utilizou este cupom.' };
        }

        const updatedUser: User = {
            ...user,
            access: {
                ...user.access,
                plan: 'Oyasify Ultra',
                expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
            },
            couponsUsed: [...(user.couponsUsed || []), 'GRATIS7'],
        };
        
        if (!updatedUser.profile.badges.includes('🌟 Premium')) {
            updatedUser.profile.badges.push('🌟 Premium');
        }

        setUser(updatedUser);
        updateUserInStorage(updatedUser);

        return { success: true, message: 'Cupom GRATIS7 ativado! Você tem 7 dias de acesso Ultra.' };
    };

    const simulatePayment = async (): Promise<{ success: boolean; message: string }> => {
        if (!user) {
            return { success: false, message: 'Você precisa estar logado.' };
        }

        const updatedUser: User = {
            ...user,
            access: {
                ...user.access,
                plan: 'Oyasify Plus',
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            },
        };
        
        if (!updatedUser.profile.badges.includes('🌟 Premium')) {
            updatedUser.profile.badges.push('🌟 Premium');
        }

        setUser(updatedUser);
        updateUserInStorage(updatedUser);

        return { success: true, message: 'Pagamento simulado! Você recebeu o plano Oyasify Plus por 30 dias.' };
    };

    const createProductRequest = async (requestText: string): Promise<{ success: boolean; message: string }> => {
        if (!user) return { success: false, message: "Você precisa estar logado." };
        
        const requests = getFromStorage<ProductRequest[]>('oyasify_product_requests', []);
        const newRequest: ProductRequest = {
            id: `request_${Date.now()}`,
            userId: user.id,
            userNickname: user.nickname,
            requestText,
            status: 'pending',
            createdAt: Date.now(),
        };
        saveToStorage('oyasify_product_requests', [...requests, newRequest]);
        setMyProductRequests(prev => [newRequest, ...prev].sort((a,b) => b.createdAt - a.createdAt));
        return { success: true, message: "Seu pedido foi enviado! O dono irá analisar e responder em breve." };
    };

    const getAllPendingProductRequests = () => {
        const requests = getFromStorage<ProductRequest[]>('oyasify_product_requests', []);
        return requests.filter(r => r.status === 'pending').sort((a, b) => b.createdAt - a.createdAt);
    };

    const answerProductRequest = async (requestId: string, links: string[]) => {
        const requests = getFromStorage<ProductRequest[]>('oyasify_product_requests', []);
        const requestIndex = requests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'answered';
            requests[requestIndex].productLinks = links.filter(link => link.trim() !== '');
            saveToStorage('oyasify_product_requests', requests);

            const answeredRequest = requests[requestIndex];
            if (user && user.id === answeredRequest.userId) {
                setMyProductRequests(prev =>
                    prev.map(r => r.id === answeredRequest.id ? answeredRequest : r)
                );
            }
        }
    };
    
    const getNotificationCount = () => {
        if (!user || !user.profile.badges.includes('⭐ Dono')) return 0;
        const pendingPayments = getPendingPayments().length;
        const pendingRequests = getAllPendingProductRequests().length;
        return pendingPayments + pendingRequests;
    };

    return (
        <AuthContext.Provider value={{ 
            user, loading, theme, login, register, logout, updateProfile, checkAccess, consumeCredit, 
            requestPayment, getPendingPayments, approvePayment, rejectPayment, applyCoupon, simulatePayment,
            createProductRequest, myProductRequests, getAllPendingProductRequests, answerProductRequest, getNotificationCount
        }}>
            {children}
        {/* FIX: Corrected typo in closing tag from Auth.Provider to AuthContext.Provider */}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};