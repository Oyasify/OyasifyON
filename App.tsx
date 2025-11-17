import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/auth/Profile';
import Header from './components/ui/Header';
import SplashScreen from './components/ui/SplashScreen';
import AdminPanel from './components/admin/AdminPanel';
import MusicPage from './components/music/MusicPage';

type View = 'dashboard' | 'profile' | 'admin' | 'music';
type Page = 'splash' | 'auth' | 'app';

const AppContent: React.FC = () => {
    const { user, loading, theme } = useAuth();
    const [page, setPage] = useState<Page>('splash');
    const [view, setView] = useState<View>('dashboard');
    const [authView, setAuthView] = useState<'login' | 'register'>('login');

    useEffect(() => {
        if (!loading) {
            if (user) {
                setPage('app');
                const nonDashboardViews = ['profile', 'admin', 'music'];
                // Default view for all users, including admin, is 'dashboard'.
                // Admin can navigate to their panel via the header.
                if (!nonDashboardViews.includes(view)) {
                    setView('dashboard');
                }
            } else {
                 setTimeout(() => {
                    // stay on splash for a bit
                    if (page === 'splash') return;
                    setPage('auth');
                }, 500);
            }
        }
    }, [user, loading, page, view]);
    
    const navigate = useCallback((newView: View) => {
        if (user) {
            // Prevent non-admins from accessing admin panel
            if (newView === 'admin' && !user.profile.badges.includes('⭐ Dono')) {
                return;
            }
            setView(newView);
        }
    }, [user]);

    const handleAuthNavigate = (target: 'login' | 'register') => {
        setAuthView(target);
    }
    
    const startApp = () => {
        setPage('auth');
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-900 text-white">
                <i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i>
            </div>
        );
    }

    return (
        <div id="theme-provider" className={`h-full w-full overflow-hidden ${theme.textClass}`} style={{ background: theme.background }}>
             {page === 'splash' && <SplashScreen onEnter={startApp} />}
             {page === 'auth' && (
                 <div className="h-full w-full animated-gradient" style={{ background: theme.background }}>
                    {authView === 'register' 
                        ? <Register onNavigate={() => handleAuthNavigate('login')} /> 
                        : <Login onNavigate={() => handleAuthNavigate('register')} />
                    }
                 </div>
             )}
             {page === 'app' && user && (
                <div className="flex flex-col h-full font-sans animate-fade-in animated-gradient" style={{ background: theme.background }}>
                    <Header onNavigate={navigate} />
                    <main className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-8">
                        {view === 'dashboard' && <Dashboard />}
                        {view === 'profile' && <Profile />}
                        {view === 'admin' && <AdminPanel />}
                        {view === 'music' && <MusicPage />}
                    </main>
                </div>
             )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
