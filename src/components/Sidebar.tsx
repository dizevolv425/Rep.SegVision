import React from 'react';
import { 
  LayoutDashboard, 
  MapPin,
  Camera, 
  AlertTriangle, 
  TrendingUp,
  CreditCard, 
  Phone, 
  Brain,
  Settings,
  Bell,
  X
} from 'lucide-react';
import { Screen } from '../App';
import { useNotifications } from './NotificationsContext';
import { useIsMobile } from './ui/use-mobile';
import { usePlatformBranding } from '../hooks/usePlatformBranding';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'environments' as const, label: 'Ambientes', icon: MapPin },
  { id: 'cameras' as const, label: 'Câmeras', icon: Camera },
  { id: 'alerts' as const, label: 'Alertas Inteligentes', icon: AlertTriangle, badge: 8 },
  { id: 'analytics' as const, label: 'Análises', icon: TrendingUp },
  { id: 'finance' as const, label: 'Financeiro', icon: CreditCard },
  { id: 'contacts' as const, label: 'Contatos de Emergência', icon: Phone },
  { id: 'notifications' as const, label: 'Notificações', icon: Bell, dynamicBadge: true },
  { id: 'support' as const, label: 'Central de Inteligência', icon: Brain },
  { id: 'settings' as const, label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentScreen, onNavigate, isOpen, onClose }: SidebarProps) {
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();
  const { platformName, logoUrl } = usePlatformBranding();

  const handleNavigate = (screen: Screen) => {
    onNavigate(screen);
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
          <h1 className="text-xl text-[var(--sidebar-foreground)] font-bold text-[24px]">{platformName}</h1>
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
      <nav className="flex-1 py-4 overflow-y-auto py-[16px] px-[12px] m-[0px]">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            // Hide Analytics, Finance, and Environments on mobile for school profile
            if (isMobile && (item.id === 'analytics' || item.id === 'finance' || item.id === 'environments')) {
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
      </div>
    </>
  );
}