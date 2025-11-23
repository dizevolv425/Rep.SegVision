import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './ui/dropdown-menu';
import { NotificationsPopover } from './NotificationsPopover';
import { useNotifications } from './NotificationsContext';
import { useUserProfile, type UserProfile } from './UserProfileContext';
import { ThemeToggle } from './ThemeToggle';
import { useIsMobile } from './ui/use-mobile';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onNavigate?: (screen: string) => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export function AppHeader({ title, subtitle, onNavigate, onMenuClick, onLogout }: AppHeaderProps) {
  const { notifications } = useNotifications();
  const { profile, currentProfile, setCurrentProfile } = useUserProfile();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleProfileClick = () => {
    if (onNavigate) {
      // Redireciona para Configurações na aba Perfil
      onNavigate('settings');
    }
  };

  const handleNotificationsClick = () => {
    if (onNavigate) {
      onNavigate('notifications');
    }
  };

  const handleSwitchProfile = (newProfile: UserProfile) => {
    setCurrentProfile(newProfile);
  };

  return (
    <header className="h-[88px] tablet:h-[76px] bg-[var(--header-bg)] border-b border-[var(--neutral-border)] flex items-center justify-between shrink-0 px-[24px] py-[0px]">
      {/* Left: Menu button (mobile) + Title Block */}
      <div className="flex items-center gap-3">
        {/* Menu button - Only on mobile */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="h-9 w-9 p-0 text-[var(--neutral-icon)] hover:bg-[var(--neutral-subtle)] hover:text-[var(--neutral-text)] focus-visible:ring-2 focus-visible:ring-[var(--blue-primary-100)] focus-visible:ring-offset-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl tablet:text-xl text-[var(--neutral-text)]">{title}</h1>
          {subtitle && (
            <p className="hidden md:block text-[var(--neutral-text-muted)] leading-4 text-[14px]">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <NotificationsPopover
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
          onViewAll={handleNotificationsClick}
        >
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 p-0 text-[var(--neutral-icon)] hover:bg-[var(--neutral-subtle)] hover:text-[var(--neutral-text)] focus-visible:ring-2 focus-visible:ring-[var(--blue-primary-100)] focus-visible:ring-offset-2"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full bg-[var(--red-alert-400)] text-[var(--white-100)] text-[10px] leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </NotificationsPopover>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-[var(--blue-primary-100)] focus-visible:ring-offset-2 bg-[rgb(255,255,255)]"
            >
              <Avatar className="h-9 w-9">
                {profile?.avatar && <AvatarImage src={profile.avatar} alt={profile?.name || 'User'} />}
                <AvatarFallback className="bg-[var(--blue-primary-300)] text-[var(--white-100)] dark:bg-[var(--white-100)] dark:text-[var(--blue-primary-300)]">
                  {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
            <DropdownMenuLabel className="text-[var(--neutral-text)]">
              <div className="flex flex-col space-y-1">
                <p className="text-sm">{profile?.name || 'Usuário'}</p>
                <p className="text-xs text-[var(--neutral-text-muted)]">{profile?.email || ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--neutral-border)]" />
            {!isMobile && (
              <>
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] cursor-pointer"
                >
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[var(--neutral-border)]" />
              </>
            )}
            <DropdownMenuLabel className="text-[var(--neutral-text-muted)] text-xs">
              Trocar Perfil
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup value={currentProfile} onValueChange={(value) => handleSwitchProfile(value as UserProfile)}>
              <DropdownMenuRadioItem
                value="school"
                className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] cursor-pointer"
              >
                Escola
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="admin"
                className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] cursor-pointer"
              >
                Administrador
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator className="bg-[var(--neutral-border)]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-[var(--danger-bg)] hover:bg-[var(--neutral-subtle)] cursor-pointer"
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}