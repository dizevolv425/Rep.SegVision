import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminSidebar, type AdminScreen } from './components/AdminSidebar';
import { AppHeader } from './components/AppHeader';
import { schoolScreenTitles, adminScreenTitles } from './components/screen-titles';
import { supabase } from './lib/supabase';
import { DashboardScreen } from './components/DashboardScreen';
import { AmbientesScreen } from './components/AmbientesScreen';
import { CamerasScreen } from './components/CamerasScreen';
import { AlertsScreen } from './components/AlertsScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { FinanceScreen } from './components/FinanceScreen';
import { ContactsScreen } from './components/ContactsScreen';
import { SupportScreen } from './components/SupportScreen';
import { AllTicketsScreen } from './components/AllTicketsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AdminDashboardScreen } from './components/admin/AdminDashboardScreen';
import { AdminSchoolsScreen } from './components/admin/AdminSchoolsScreen';
import { AdminReportsScreen } from './components/admin/AdminReportsScreen';
import { AdminFinanceScreen } from './components/admin/AdminFinanceScreen';
import { AdminPricingPlansScreenWrapper } from './components/admin/AdminPricingPlansScreenWrapper';
import { AdminIntegrationsScreen } from './components/admin/AdminIntegrationsScreen';
import { AdminNotificationsScreen } from './components/admin/AdminNotificationsScreen';
import { AdminSettingsScreen } from './components/admin/AdminSettingsScreen';
import { AmbientesProvider } from './components/AmbientesContext';
import { UserProfileProvider, useUserProfile } from './components/UserProfileContext';
import { NotificationsProvider } from './components/NotificationsContext';
import { ThemeProvider } from './components/ThemeContext';
import { PlatformBrandingProvider } from './contexts/PlatformBrandingContext';
import { NotificationsScreen } from './components/NotificationsScreen';
import BadgeShowcase from './components/BadgeShowcase';
import BadgeVisualTest from './components/BadgeVisualTest';
import FormShowcase from './components/FormShowcase';
import { AlertCardShowcase } from './components/AlertCardShowcase';
import { ToastShowcase } from './components/ToastShowcase';
import { Toaster } from './components/ui/sonner';

// Auth & Onboarding Screens
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/auth/ResetPasswordScreen';
import { PlanSelectionScreen } from './components/onboarding/PlanSelectionScreen';
import { CheckoutScreen } from './components/onboarding/CheckoutScreen';
import { EnterpriseSupportScreen } from './components/onboarding/EnterpriseSupportScreen';

export type Screen = 'dashboard' | 'environments' | 'cameras' | 'alerts' | 'analytics' | 'finance' | 'contacts' | 'support' | 'all-tickets' | 'settings' | 'notifications' | 'badge-showcase' | 'badge-visual-test' | 'form-showcase' | 'alert-card-showcase' | 'toast-showcase';

type AuthScreen = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'plan-selection' | 'checkout' | 'enterprise-support';

function AppContent() {
  const { currentProfile, setCurrentProfile, refreshProfile } = useUserProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise' | null>(null);
  const [isFirstAccess, setIsFirstAccess] = useState(false);

  const [currentSchoolScreen, setCurrentSchoolScreen] = useState<Screen>('dashboard');
  const [currentAdminScreen, setCurrentAdminScreen] = useState<AdminScreen>('dashboard');
  const [alertsSearchTerm, setAlertsSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          // Fetch user profile (sem join com schools para evitar RLS recursivo)
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_type, school_id, full_name, email')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;

          if (userData) {
            setIsAuthenticated(true);
            setCurrentProfile(userData.user_type);
            await refreshProfile();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkSession();

    // Fallback: se o getSession travar, liberamos o UI após 3s
    const timeout = setTimeout(() => setIsLoadingAuth(false), 3000);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthScreen('reset-password');
        setIsAuthenticated(false);
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        // O handleLoginSuccess já foi chamado pelo LoginScreen com o user_type correto
        // Não precisa fazer nada aqui
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentProfile('school');
        setAuthScreen('login');
        setIsFirstAccess(false);
        setSelectedPlan(null);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trocar para tela de reset caso a URL contenha o return do link de recuperação
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const hasRecoveryParams = hash.includes('type=recovery') || hash.includes('access_token');
    const hasCodeParam = search.includes('code=');

    if (hasRecoveryParams || hasCodeParam) {
      (async () => {
        try {
          const params = new URLSearchParams(hash.replace(/^#/, ''));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          if (type === 'recovery' && accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;

            setAuthScreen('reset-password');
            setIsAuthenticated(false);
          } else if (hasCodeParam) {
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (error) throw error;
          }
        } catch (err) {
          console.error('Erro ao estabelecer sessão de recuperação:', err);
        } finally {
          // Remove fragment da URL para evitar reprocessar
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
        }
      })();
    }
  }, []);

  const handleNavigateToAlertsWithSearch = (searchTerm: string) => {
    setAlertsSearchTerm(searchTerm);
    setCurrentSchoolScreen('alerts');
  };

  const handleSchoolNavigate = (screen: Screen) => {
    // Limpar termo de busca quando navegar para alerts de outra forma
    if (screen === 'alerts') {
      setAlertsSearchTerm('');
    }
    setCurrentSchoolScreen(screen);
  };

  const handleAdminNavigate = (screen: AdminScreen) => {
    setCurrentAdminScreen(screen);
  };

  // Auth handlers
  const handleLoginSuccess = (userType: 'admin' | 'school') => {
    setIsAuthenticated(true);
    setCurrentProfile(userType);
    setIsFirstAccess(false);
  };

  const handleRegisterSuccess = () => {
    // After registration, go to checkout/enterprise depending on selected plan
    if (selectedPlan === 'enterprise') {
      setAuthScreen('enterprise-support');
    } else {
      setAuthScreen('checkout');
    }
  };

  const handlePlanSelection = (planType: 'basic' | 'pro' | 'enterprise') => {
    setSelectedPlan(planType);
    // After plan selection, go to registration
    setAuthScreen('register');
  };

  const handlePaymentSuccess = () => {
    setIsAuthenticated(true);
    setCurrentProfile('school');
    setIsFirstAccess(true);
  };

  const handleResetPasswordSuccess = () => {
    setAuthScreen('login');
  };

  const handleBackToPlans = () => {
    setAuthScreen('plan-selection');
    setSelectedPlan(null);
  };

  const handleBackToLogin = () => {
    setAuthScreen('login');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // State will be updated by the onAuthStateChange listener
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: manually clear state if signOut fails
      setIsAuthenticated(false);
      setAuthScreen('login');
      setIsFirstAccess(false);
      setSelectedPlan(null);
    }
  };

  // Show loading while checking auth (fallback para evitar travar)
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#090F36] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">SegVision</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-sm text-white/70 mt-3">Carregando sessão...</p>
          <p className="text-xs text-white/50 mt-1">Se demorar, a tela de login abrirá automaticamente.</p>
        </div>
      </div>
    );
  }

  // Render Auth Screens
  if (!isAuthenticated) {
    switch (authScreen) {
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setAuthScreen('plan-selection')}
            onNavigateToForgotPassword={() => setAuthScreen('forgot-password')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={handleBackToLogin}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onNavigateToLogin={handleBackToLogin}
            onNavigateToReset={() => setAuthScreen('reset-password')}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordScreen
            onResetSuccess={handleResetPasswordSuccess}
          />
        );
      case 'plan-selection':
        return (
          <PlanSelectionScreen
            onSelectPlan={handlePlanSelection}
          />
        );
      case 'checkout':
        return selectedPlan && selectedPlan !== 'enterprise' ? (
          <CheckoutScreen
            planType={selectedPlan}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handleBackToPlans}
          />
        ) : null;
      case 'enterprise-support':
        return (
          <EnterpriseSupportScreen
            onBack={handleBackToPlans}
          />
        );
      default:
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setAuthScreen('register')}
            onNavigateToForgotPassword={() => setAuthScreen('forgot-password')}
          />
        );
    }
  }

  const renderSchoolScreen = () => {
    switch (currentSchoolScreen) {
      case 'dashboard':
        return <DashboardScreen onNavigate={handleSchoolNavigate} isFirstAccess={isFirstAccess} />;
      case 'environments':
        return <AmbientesScreen isFirstAccess={isFirstAccess} />;
      case 'cameras':
        return <CamerasScreen isFirstAccess={isFirstAccess} />;
      case 'alerts':
        return <AlertsScreen initialSearchTerm={alertsSearchTerm} isFirstAccess={isFirstAccess} />;
      case 'analytics':
        return <AnalyticsScreen onNavigateToAlerts={handleNavigateToAlertsWithSearch} isFirstAccess={isFirstAccess} />;
      case 'finance':
        return <FinanceScreen isFirstAccess={isFirstAccess} />;
      case 'contacts':
        return <ContactsScreen isFirstAccess={isFirstAccess} />;
      case 'support':
        return <SupportScreen onNavigate={handleSchoolNavigate} />;
      case 'all-tickets':
        return <AllTicketsScreen onNavigate={handleSchoolNavigate} />;
      case 'settings':
        return <SettingsScreen />;
      case 'notifications':
        return <NotificationsScreen onNavigate={handleSchoolNavigate} isFirstAccess={isFirstAccess} />;
      case 'badge-showcase':
        return <BadgeShowcase />;
      case 'badge-visual-test':
        return <BadgeVisualTest />;
      case 'form-showcase':
        return <FormShowcase />;
      case 'alert-card-showcase':
        return <AlertCardShowcase />;
      case 'toast-showcase':
        return <ToastShowcase />;
      default:
        return <DashboardScreen onNavigate={handleSchoolNavigate} isFirstAccess={isFirstAccess} />;
    }
  };

  const renderAdminScreen = () => {
    switch (currentAdminScreen) {
      case 'dashboard':
        return <AdminDashboardScreen isFirstAccess={isFirstAccess} />;
      case 'schools':
        return <AdminSchoolsScreen isFirstAccess={isFirstAccess} />;
      case 'finance':
        return <AdminFinanceScreen isFirstAccess={isFirstAccess} />;
      case 'pricing':
        return <AdminPricingPlansScreenWrapper isFirstAccess={isFirstAccess} />;
      case 'reports':
        return <AdminReportsScreen isFirstAccess={isFirstAccess} />;
      case 'integrations':
        return <AdminIntegrationsScreen isFirstAccess={isFirstAccess} />;
      case 'notifications':
        return <AdminNotificationsScreen isFirstAccess={isFirstAccess} />;
      case 'settings':
        return <AdminSettingsScreen />;
      default:
        return <AdminDashboardScreen isFirstAccess={isFirstAccess} />;
    }
  };

  const renderSidebar = () => {
    switch (currentProfile) {
      case 'school':
        return (
          <Sidebar 
            currentScreen={currentSchoolScreen} 
            onNavigate={handleSchoolNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        );
      case 'admin':
        return (
          <AdminSidebar 
            currentScreen={currentAdminScreen} 
            onNavigate={handleAdminNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        );
      default:
        return (
          <Sidebar 
            currentScreen={currentSchoolScreen} 
            onNavigate={handleSchoolNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        );
    }
  };

  const renderContent = () => {
    switch (currentProfile) {
      case 'school':
        return renderSchoolScreen();
      case 'admin':
        return renderAdminScreen();
      default:
        return renderSchoolScreen();
    }
  };

  const getHeaderProps = () => {
    switch (currentProfile) {
      case 'school':
        return schoolScreenTitles[currentSchoolScreen] || { title: 'SegVision', subtitle: '' };
      case 'admin':
        return adminScreenTitles[currentAdminScreen] || { title: 'SegVision', subtitle: '' };
      default:
        return { title: 'SegVision', subtitle: '' };
    }
  };

  const handleHeaderNavigate = (screen: string) => {
    if (currentProfile === 'school') {
      handleSchoolNavigate(screen as Screen);
    } else if (currentProfile === 'admin') {
      handleAdminNavigate(screen as AdminScreen);
    }
  };

  return (
    <AmbientesProvider>
      <NotificationsProvider>
        <div className="h-screen bg-[var(--neutral-bg)] overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
          {renderSidebar()}
          <div className="md:ml-[260px] flex flex-col h-screen">
            <AppHeader 
              {...getHeaderProps()} 
              onNavigate={handleHeaderNavigate}
              onMenuClick={() => setSidebarOpen(true)}
              onLogout={handleLogout}
            />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[var(--neutral-bg)]">
              {renderContent()}
            </main>
          </div>
        </div>
      </NotificationsProvider>
    </AmbientesProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProfileProvider>
        <PlatformBrandingProvider>
          <AppContent />
          <Toaster position="top-center" />
        </PlatformBrandingProvider>
      </UserProfileProvider>
    </ThemeProvider>
  );
}
