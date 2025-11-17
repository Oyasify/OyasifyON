import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import { THEMES } from '../../constants';

const formatTimeLeft = (expiresAt: number | null): string => {
    if (!expiresAt) return '';
    const totalSeconds = Math.floor((expiresAt - Date.now()) / 1000);

    if (totalSeconds <= 0) {
        return 'Expirado';
    }

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const Profile: React.FC = () => {
    const { user, updateProfile, theme, applyCoupon } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<Partial<User['profile']>>(user?.profile || {});
    const [saving, setSaving] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [timeLeft, setTimeLeft] = useState(formatTimeLeft(user?.access.expiresAt || null));
    
    const [pfpPreview, setPfpPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user?.access.expiresAt) {
            const timer = setInterval(() => {
                setTimeLeft(formatTimeLeft(user.access.expiresAt));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [user?.access.expiresAt]);


    if (!user) {
        return <div>Carregando perfil...</div>;
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profilePicture' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('A imagem é muito grande! Por favor, escolha uma imagem menor que 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (type === 'profilePicture') setPfpPreview(base64String);
                if (type === 'banner') setBannerPreview(base64String);
                setProfileData(prev => ({ ...prev, [type]: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleEditClick = () => {
        setProfileData(user.profile);
        setPfpPreview(null);
        setBannerPreview(null);
        setIsEditing(true);
    }

    const handleSave = async () => {
        setSaving(true);
        await updateProfile(profileData);
        setSaving(false);
        setIsEditing(false);
        setPfpPreview(null);
        setBannerPreview(null);
    };

    const handleApplyCoupon = async () => {
        setIsApplyingCoupon(true);
        setCouponMessage(null);
        const result = await applyCoupon(couponCode);
        setCouponMessage({ text: result.message, type: result.success ? 'success' : 'error' });
        setIsApplyingCoupon(false);
        if(result.success) setCouponCode('');
    }

    const currentBanner = bannerPreview || user.profile.banner;
    const currentPfp = pfpPreview || user.profile.profilePicture;

    return (
        <div className="container mx-auto max-w-4xl animate-float-up">
            <div className={`bg-black/30 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10 ${theme.shadow}`}>
                <div className="relative">
                    <img src={currentBanner} alt="Banner" className="w-full h-48 object-cover"/>
                    <div className="absolute top-full left-8 -translate-y-1/2">
                        <img src={currentPfp} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4" style={{ borderColor: theme.secondary }}/>
                    </div>
                </div>
                <div className="pt-20 px-8 pb-8">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-300">Nickname</label>
                                <input name="nickname" value={profileData.nickname || ''} onChange={handleInputChange} className="w-full bg-gray-800/60 p-2 rounded-xl text-white border border-gray-600" />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Foto de Perfil (JPG, PNG)</label>
                                    <input type="file" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, 'profilePicture')} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/40" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Banner (JPG, PNG)</label>
                                    <input type="file" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, 'banner')} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/40" />
                                </div>
                            </div>
                             <div>
                                <label className="text-sm font-bold text-gray-300">Biografia</label>
                                <textarea name="bio" value={profileData.bio || ''} onChange={handleInputChange} className="w-full bg-gray-800/60 p-2 rounded-xl text-white h-24 border border-gray-600" />
                            </div>
                             <div>
                                <label className="text-sm font-bold text-gray-300">Tema Visual</label>
                                <select name="theme" value={profileData.theme || 'Starlight Pop'} onChange={handleInputChange} className="w-full bg-gray-800/60 p-2 rounded-xl text-white border border-gray-600">
                                    {Object.keys(THEMES).map(themeName => (
                                        <option key={themeName} value={themeName}>{themeName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center">
                                    {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar'}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl">Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                        {user.profile.nickname} 
                                        {user.profile.badges.map(badge => <span key={badge} className="text-sm bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full">{badge}</span>)}
                                    </h2>
                                    <p className="text-gray-400">{user.email}</p>
                                </div>
                                <button onClick={handleEditClick} className="font-bold py-2 px-4 rounded-xl" style={{ backgroundColor: theme.primary }}>Editar Perfil</button>
                            </div>
                            <p className="mt-4 text-gray-300">{user.profile.bio}</p>
                             <div className="mt-4 text-sm text-gray-400">
                                Plano Atual: <span className="font-bold" style={{ color: theme.primary }}>{user.access.plan}</span>
                                {user.access.expiresAt && user.access.plan !== 'Oyasify Ultra' && (
                                    <span className="text-xs text-yellow-400 ml-2 bg-yellow-500/10 px-2 py-1 rounded-md">
                                        Expira em: {timeLeft}
                                    </span>
                                )}
                                {user.access.plan === 'Oyasify Ultra' && !user.access.expiresAt && (
                                    <span className="text-xs text-green-400 ml-2 bg-green-500/10 px-2 py-1 rounded-md">
                                        Acesso Vitalício
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="mt-8 border-t border-white/10 pt-6">
                        <h3 className="text-xl font-bold text-white mb-4">Código Promocional</h3>
                        <div className="flex gap-2 max-w-sm">
                            <input 
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Use o código (ex: GRATIS7)"
                                className="w-full bg-gray-800/60 border border-gray-600 rounded-xl text-white px-3 py-2 focus:outline-none focus:ring-2"
                                style={{borderColor: theme.secondary, '--tw-ring-color': theme.primary} as React.CSSProperties}
                            />
                            <button 
                                onClick={handleApplyCoupon} 
                                disabled={isApplyingCoupon}
                                className="font-bold py-2 px-4 rounded-xl text-sm transition-transform transform hover:scale-105"
                                style={{ backgroundColor: theme.primary }}
                            >
                                {isApplyingCoupon ? '...' : 'Aplicar'}
                            </button>
                        </div>
                        {couponMessage && (
                            <div className={`mt-3 p-3 rounded-xl text-sm ${couponMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {couponMessage.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
