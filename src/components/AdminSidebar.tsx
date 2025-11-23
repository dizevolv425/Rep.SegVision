import React from 'react';
import { 
  LayoutDashboard,
  Building2,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  Plug,
  DollarSign,
  X,
  ArrowLeftRight
} from 'lucide-react';
import { Button } from './ui/button';
import { useUserProfile } from './UserProfileContext';
import { useNotifications } from './NotificationsContext';
import { useIsMobile } from './ui/use-mobile';
import { usePlatformBranding } from '../hooks/usePlatformBranding';

export type AdminScreen = 'dashboard' | 'schools' | 'finance' | 'pricing' | 'reports' | 'integrations' | 'settings' | 'notifications';

interface AdminSidebarProps {
  currentScreen: AdminScreen;
  onNavigate: (screen: AdminScreen) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard' as const, label: 'Dashboard Geral', icon: LayoutDashboard },
  { id: 'schools' as const, label: 'Escolas', icon: Building2 },
  { id: 'finance' as const, label: 'Financeiro Geral', icon: CreditCard },
  { id: 'pricing' as const, label: 'Planos & Preços', icon: DollarSign },
  { id: 'reports' as const, label: 'Relatórios & Auditoria', icon: BarChart3 },
  { id: 'notifications' as const, label: 'Notificações', icon: Bell, dynamicBadge: true },
  { id: 'integrations' as const, label: 'Integrações', icon: Plug },
  { id: 'settings' as const, label: 'Configurações', icon: Settings },
];

export function AdminSidebar({ currentScreen, onNavigate, isOpen, onClose }: AdminSidebarProps) {
  const { setCurrentProfile } = useUserProfile();
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();
  const { platformName, logoUrl } = usePlatformBranding();

  const handleNavigate = (screen: AdminScreen) => {
    onNavigate(screen);
    if (isMobile) {
      onClose();
    }
  };

  const handleSwitchProfile = () => {
    setCurrentProfile('school');
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop - Only on mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          w-[260px] bg-[var(--sidebar)] h-screen flex flex-col fixed left-0 top-0 z-50
          transition-transform duration-300 ease-in-out
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
      {/* Logo Area - Aligned with Header Height */}
      <div className="h-[88px] tablet:h-[76px] flex items-center px-4 shrink-0 justify-between">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={platformName}
              className="h-10 w-10 object-contain"
            />
          )}
          <h1 className="text-xl text-[var(--sidebar-foreground)] font-bold">{platformName}</h1>
        </div>
        {/* Close button - Only on mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="text-[var(--sidebar-foreground)] hover:opacity-80 transition-opacity p-1"
          >
            <X size={24} />
          </button>
        )}
      </div>
      
      {/* Divider Below Logo */}
      <div className="h-px bg-[var(--sidebar-border)] opacity-35 shrink-0"></div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            // Hide certain items on mobile for admin profile - keep only essential ones
            const allowedMobileItems = ['dashboard', 'finance', 'reports', 'notifications', 'settings'];
            if (isMobile && !allowedMobileItems.includes(item.id)) {
              return null;
            }
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
                  className={`
                    group relative w-full flex items-center px-3 py-2.5 rounded-[10px] text-left
                    transition-all duration-150 ease-out
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sidebar-ring)] focus-visible:outline-offset-2
                    ${isActive 
                      ? 'bg-[var(--sidebar-accent)]' 
                      : 'bg-transparent hover:bg-[var(--sidebar-accent)] hover:opacity-60'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={`
                      shrink-0 transition-colors duration-150 mr-2.5
                      ${isActive 
                        ? 'text-[var(--sidebar-foreground)]' 
                        : 'text-[var(--sidebar-foreground)] opacity-80 group-hover:opacity-100'
                      }
                    `}
                  />
                  <span 
                    className={`
                      text-[13px] leading-tight transition-colors duration-150
                      ${isActive 
                        ? 'text-[var(--sidebar-foreground)]' 
                        : 'text-[var(--sidebar-foreground)] opacity-80 group-hover:opacity-100'
                      }
                    `}
                  >
                    {item.label}
                  </span>
                  
                  {/* Badge contador */}
                  {(item.badge || (item.dynamicBadge && unreadCount > 0)) && (
                    <span 
                      className={`
                        inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] ml-2
                        text-[11px] leading-none transition-colors duration-150
                        ${isActive 
                          ? 'bg-[var(--sidebar-primary-foreground)] text-[var(--sidebar)]' 
                          : 'bg-[var(--sidebar-primary-foreground)] text-[var(--sidebar)]'
                        }
                      `}
                      style={{ fontWeight: 700 }}
                    >
                      {item.dynamicBadge ? unreadCount : item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Profile Switcher */}
      <div className="px-3 py-4">
        <div className="h-px bg-[var(--sidebar-border)] mb-4" />
        <button
          onClick={handleSwitchProfile}
          className="
            group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left
            bg-transparent hover:bg-[var(--sidebar-accent)]
            transition-all duration-150 ease-out
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sidebar-ring)] focus-visible:outline-offset-2
          "
        >
          <ArrowLeftRight 
            size={20} 
            className="shrink-0 text-[var(--sidebar-foreground)] opacity-80 group-hover:opacity-100 transition-colors duration-150" 
          />
          <span className="text-[13px] leading-tight text-[var(--sidebar-foreground)] opacity-80 group-hover:opacity-100 transition-colors duration-150">
            Trocar para Escola
          </span>
        </button>
      </div>
      </div>
    </>
  );
}