import React from 'react';
import { LogOut, UserCircle, ArrowLeftRight } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useUserProfile } from './UserProfileContext';
import { NotificationsPopover } from './NotificationsPopover';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  onNavigate: (screen: any) => void;
  onLogout?: () => void;
}

export function TopBar({ onNavigate, onLogout }: TopBarProps) {
  const { currentProfile, setCurrentProfile } = useUserProfile();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleProfile = () => {
    onNavigate('profile');
  };

  const getProfileLabel = (profile: string) => {
    switch (profile) {
      case 'school': return 'Gestor da Escola';
      case 'admin': return 'Administrador do SaaS';
      default: return 'Perfil';
    }
  };

  const getProfileEmail = (profile: string) => {
    switch (profile) {
      case 'school': return 'escola@segvision.com';
      case 'admin': return 'admin@segvision.com';
      default: return '';
    }
  };

  const getProfileInitials = (profile: string) => {
    switch (profile) {
      case 'school': return 'ES';
      case 'admin': return 'AD';
      default: return 'U';
    }
  };

  return (
    <div className="h-16 bg-[var(--neutral-bg)] border-b border-[var(--neutral-border)] flex items-center justify-end px-8 gap-2 fixed top-0 right-0 left-60 z-30 px-[32px] py-[0px]">
      {/* Notificações Unificadas */}
      <NotificationsPopover onNavigate={onNavigate} />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Perfil do Usuário */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full py-[0px] p-[0px] m-[0px]">
            <Avatar className="h-10 w-10 border border-[var(--neutral-border)]">
              <AvatarImage src="" alt="Usuário" />
              <AvatarFallback className="bg-[var(--neutral-subtle)] text-[var(--neutral-text)]">
                {getProfileInitials(currentProfile)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-[var(--neutral-bg)] border-[var(--neutral-border)]" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-[var(--neutral-text)]">
                {getProfileLabel(currentProfile)}
              </p>
              <p className="text-xs leading-none text-[var(--neutral-text-muted)]">
                {getProfileEmail(currentProfile)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[var(--neutral-border)]" />
          <DropdownMenuItem onClick={handleProfile} className="cursor-pointer text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[var(--neutral-border)]" />
          <DropdownMenuLabel className="text-xs text-[var(--neutral-text-muted)]">
            Trocar perfil
          </DropdownMenuLabel>
          {currentProfile !== 'school' && (
            <DropdownMenuItem 
              onClick={() => setCurrentProfile('school')} 
              className="cursor-pointer text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm">Gestor da Escola</span>
                <span className="text-xs text-[var(--neutral-text-muted)]">Gestão da unidade e configurações</span>
              </div>
            </DropdownMenuItem>
          )}
          {currentProfile !== 'admin' && (
            <DropdownMenuItem 
              onClick={() => setCurrentProfile('admin')} 
              className="cursor-pointer text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm">Administrador do SaaS</span>
                <span className="text-xs text-[var(--neutral-text-muted)]">Financeiro global, contratos, integrações</span>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-[var(--neutral-border)]" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[var(--danger-bg)] hover:bg-[var(--neutral-subtle)] focus:text-[var(--danger-bg)]">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}