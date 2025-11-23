import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Lock,
  User,
  Upload,
  AlertCircle,
  CheckCircle,
  Bell,
  Image,
  Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { showToast } from '../ui/toast-utils';
import { useIsMobile } from '../ui/use-mobile';

// Importar todos os hooks criados
import { useUserProfile } from '../../hooks/useUserProfile';
import { usePlatformBranding } from '../../hooks/usePlatformBranding';
import { useInternalUsers } from '../../hooks/useInternalUsers';
import { useNotificationPreferences } from '../../hooks/useNotificationPreferences';
import { useSecuritySettings } from '../../hooks/useSecuritySettings';
import { useUserProfile as useUserProfileContext } from '../UserProfileContext';

export function AdminSettingsScreen() {
  const isMobile = useIsMobile();

  // Hooks integration
  const {
    profile,
    isLoading: isLoadingProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
  } = useUserProfile();

  // Context para sincronizar avatar no header
  const { refreshProfile: refreshHeaderProfile } = useUserProfileContext();

  const {
    platformName,
    logoUrl,
    isLoading: isLoadingBranding,
    updateBranding,
    uploadLogo,
  } = usePlatformBranding();

  const {
    users,
    isLoading: isLoadingUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useInternalUsers();

  const {
    preferences,
    isLoading: isLoadingPreferences,
    updatePreferences,
  } = useNotificationPreferences();

  const {
    settings: securitySettings,
    logs: securityLogs,
    isLoading: isLoadingSettings,
    isLoadingLogs,
    updateSettings: updateSecuritySettings,
  } = useSecuritySettings();

  // Local state for forms
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Profile form
  const [profileName, setProfileName] = useState(profile?.full_name || '');
  const [profilePhone, setProfilePhone] = useState(profile?.phone || '');
  const [profileRole, setProfileRole] = useState(profile?.role || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Platform branding form
  const [localPlatformName, setLocalPlatformName] = useState(platformName);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(logoUrl);

  // New user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  // Security settings form
  const [inactivityTimeout, setInactivityTimeout] = useState(
    securitySettings?.inactivity_timeout_minutes?.toString() || '30'
  );
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(
    securitySettings?.max_login_attempts?.toString() || '5'
  );
  const [passwordExpiration, setPasswordExpiration] = useState(
    securitySettings?.password_expiration_days?.toString() || '90'
  );

  // Update local state when data loads
  React.useEffect(() => {
    if (profile) {
      setProfileName(profile.full_name);
      setProfilePhone(profile.phone || '');
      setProfileRole(profile.role || '');
    }
  }, [profile]);

  React.useEffect(() => {
    setLocalPlatformName(platformName);
    setLogoPreview(logoUrl);
  }, [platformName, logoUrl]);

  React.useEffect(() => {
    if (securitySettings) {
      setInactivityTimeout(securitySettings.inactivity_timeout_minutes.toString());
      setMaxLoginAttempts(securitySettings.max_login_attempts.toString());
      setPasswordExpiration(securitySettings.password_expiration_days.toString());
    }
  }, [securitySettings]);

  // Handlers
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: profileName,
        phone: profilePhone,
        role: profileRole,
      });
      showToast.success({ title: 'Perfil atualizado com sucesso' });
    } catch (error) {
      showToast.error({ title: 'Erro ao atualizar perfil', description: (error as Error).message });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast.error({ title: 'Preencha todos os campos' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error({ title: 'As senhas não coincidem' });
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      showToast.success({ title: 'Senha alterada com sucesso' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showToast.error({ title: 'Erro ao alterar senha', description: (error as Error).message });
    }
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
      // Sincronizar avatar no header
      await refreshHeaderProfile();
      showToast.success({ title: 'Avatar atualizado com sucesso' });
    } catch (error) {
      showToast.error({ title: 'Erro ao fazer upload do avatar', description: (error as Error).message });
    }
  };

  const handleSavePlatformBranding = async () => {
    try {
      // Upload logo if selected
      if (logoFile) {
        await uploadLogo(logoFile);
      }

      // Update platform name if changed
      if (localPlatformName !== platformName) {
        await updateBranding({ platform_name: localPlatformName });
      }

      showToast.success({ title: 'Configurações da plataforma atualizadas' });
      setLogoFile(null);
    } catch (error) {
      showToast.error({ title: 'Erro ao atualizar plataforma', description: (error as Error).message });
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      showToast.error({ title: 'Preencha todos os campos obrigatórios' });
      return;
    }

    try {
      await createUser({
        full_name: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        role: newUserRole,
        password: newUserPassword,
      });

      showToast.success({
        title: 'Usuário criado com sucesso',
        description: 'Um e-mail foi enviado com as instruções de acesso'
      });

      // Reset form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserRole('');
      setNewUserPassword('');
      setIsAddUserOpen(false);
    } catch (error) {
      showToast.error({ title: 'Erro ao criar usuário', description: (error as Error).message });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete);
      showToast.success({ title: 'Usuário removido com sucesso' });
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      showToast.error({ title: 'Erro ao remover usuário', description: (error as Error).message });
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      showToast.success({ title: 'Status atualizado com sucesso' });
    } catch (error) {
      showToast.error({ title: 'Erro ao atualizar status', description: (error as Error).message });
    }
  };

  const handleSaveNotificationPreferences = async () => {
    if (!preferences) return;

    try {
      await updatePreferences({
        security_alerts: preferences.security_alerts,
        new_contracts: preferences.new_contracts,
        payment_reminders: preferences.payment_reminders,
        school_updates: preferences.school_updates,
        weekly_reports: preferences.weekly_reports,
        email_enabled: preferences.email_enabled,
        push_enabled: preferences.push_enabled,
        in_app_enabled: preferences.in_app_enabled,
      });
      showToast.success({ title: 'Preferências salvas com sucesso' });
    } catch (error) {
      showToast.error({ title: 'Erro ao salvar preferências', description: (error as Error).message });
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      await updateSecuritySettings({
        inactivity_timeout_minutes: parseInt(inactivityTimeout),
        max_login_attempts: parseInt(maxLoginAttempts),
        password_expiration_days: parseInt(passwordExpiration),
      });
      showToast.success({ title: 'Configurações de segurança atualizadas' });
    } catch (error) {
      showToast.error({ title: 'Erro ao atualizar configurações', description: (error as Error).message });
    }
  };

  const getRoleBadge = (userType: string) => {
    if (userType === 'admin') {
      return <Badge variant="heavy" tone="primary" size="s">Administrador</Badge>;
    }
    return <Badge variant="light" tone="neutral" size="s">Operador</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="medium" tone="success" size="s">Ativo</Badge>;
    }
    return <Badge variant="light" tone="neutral" size="s">Inativo</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="heavy" tone="danger" size="s">Crítico</Badge>;
      case 'warning':
        return <Badge variant="medium" tone="warning" size="s">Atenção</Badge>;
      case 'info':
      default:
        return <Badge variant="light" tone="neutral" size="s">Info</Badge>;
    }
  };

  // Show loading state
  if (isLoadingProfile || isLoadingBranding || isLoadingUsers || isLoadingPreferences || isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-bg)]" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Tabs defaultValue="profile" className="h-full flex flex-col">
        <TabsList className="bg-[var(--card)] mb-4 md:mb-6 p-1 rounded-lg border border-[var(--neutral-border)] w-full overflow-x-auto flex-shrink-0">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[var(--primary-bg)] data-[state=active]:text-white text-[var(--neutral-text)] flex items-center gap-2 whitespace-nowrap"
          >
            <User size={16} />
            Meu Perfil
          </TabsTrigger>
          <TabsTrigger
            value="platform"
            className="data-[state=active]:bg-[var(--primary-bg)] data-[state=active]:text-white text-[var(--neutral-text)] flex items-center gap-2 whitespace-nowrap"
          >
            <Image size={16} />
            Plataforma
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-[var(--primary-bg)] data-[state=active]:text-white text-[var(--neutral-text)] flex items-center gap-2 whitespace-nowrap"
          >
            <Users size={16} />
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[var(--primary-bg)] data-[state=active]:text-white text-[var(--neutral-text)] flex items-center gap-2 whitespace-nowrap"
          >
            <Bell size={16} />
            Notificações
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[var(--primary-bg)] data-[state=active]:text-white text-[var(--neutral-text)] flex items-center gap-2 whitespace-nowrap"
          >
            <Shield size={16} />
            Segurança Global
          </TabsTrigger>
        </TabsList>

        {/* MEU PERFIL TAB */}
        <TabsContent value="profile" className="space-y-4 md:space-y-6 flex-1 overflow-y-auto">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[var(--neutral-subtle)] flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-[var(--neutral-text-muted)]" />
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--neutral-subtle)] hover:bg-[var(--neutral-subtle)]/80 rounded-md transition-colors">
                      <Upload size={16} />
                      <span className="text-sm">Alterar Avatar</span>
                    </div>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadAvatar}
                  />
                  <p className="text-sm text-[var(--neutral-text-muted)] mt-1">
                    JPG, PNG ou GIF. Máximo 2MB.
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[var(--neutral-text)]">Nome Completo</Label>
                <Input
                  id="name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="border-[var(--neutral-border)]"
                />
              </div>

              {/* Email (readonly) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--neutral-text)]">E-mail</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="border-[var(--neutral-border)] bg-[var(--neutral-subtle)]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[var(--neutral-text)]">Telefone</Label>
                <Input
                  id="phone"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="border-[var(--neutral-border)]"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="cargo" className="text-[var(--neutral-text)]">Cargo</Label>
                <Input
                  id="cargo"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  placeholder="Ex: Administrador do Sistema"
                  className="border-[var(--neutral-border)]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-[var(--primary-bg)] text-white hover:opacity-90"
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-[var(--neutral-text)]">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-[var(--neutral-border)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-[var(--neutral-text)]">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-[var(--neutral-border)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[var(--neutral-text)]">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-[var(--neutral-border)]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  className="bg-[var(--primary-bg)] text-white hover:opacity-90"
                >
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLATAFORMA TAB */}
        <TabsContent value="platform" className="space-y-4 md:space-y-6 flex-1 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Identidade Visual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-[var(--neutral-text)]">Logotipo da Plataforma</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-[var(--neutral-border)] rounded-lg flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Upload size={32} className="text-[var(--neutral-text-muted)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--neutral-subtle)] hover:bg-[var(--neutral-subtle)]/80 rounded-md transition-colors">
                        <Upload size={16} />
                        <span className="text-sm">Escolher Logotipo</span>
                      </div>
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <p className="text-sm text-[var(--neutral-text-muted)] mt-1">
                      PNG ou SVG recomendado. Máximo 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Platform Name */}
              <div className="space-y-2">
                <Label htmlFor="platformName" className="text-[var(--neutral-text)]">Nome da Plataforma</Label>
                <Input
                  id="platformName"
                  value={localPlatformName}
                  onChange={(e) => setLocalPlatformName(e.target.value)}
                  placeholder="SegVision"
                  className="border-[var(--neutral-border)]"
                />
                <p className="text-sm text-[var(--neutral-text-muted)]">
                  Este nome será exibido na sidebar e em toda a plataforma.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePlatformBranding}
                  className="bg-[var(--primary-bg)] text-white hover:opacity-90"
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USUÁRIOS TAB */}
        <TabsContent value="users" className="space-y-4 md:space-y-6 flex-1 overflow-y-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[var(--neutral-text)]">Usuários Internos</CardTitle>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[var(--primary-bg)] text-white hover:opacity-90">
                    <Plus size={16} className="mr-2" />
                    Adicionar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[var(--neutral-text)]">Novo Usuário Interno</DialogTitle>
                    <DialogDescription className="text-[var(--neutral-text-muted)]">
                      Envie um convite para um novo usuário da plataforma.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newUserName" className="text-[var(--neutral-text)]">Nome Completo *</Label>
                      <Input
                        id="newUserName"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="João Silva"
                        className="border-[var(--neutral-border)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newUserEmail" className="text-[var(--neutral-text)]">E-mail *</Label>
                      <Input
                        id="newUserEmail"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="joao@segvision.com"
                        className="border-[var(--neutral-border)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newUserPhone" className="text-[var(--neutral-text)]">Telefone</Label>
                      <Input
                        id="newUserPhone"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="border-[var(--neutral-border)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newUserRole" className="text-[var(--neutral-text)]">Cargo</Label>
                      <Input
                        id="newUserRole"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        placeholder="Operador"
                        className="border-[var(--neutral-border)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newUserPassword" className="text-[var(--neutral-text)]">Senha Temporária *</Label>
                      <Input
                        id="newUserPassword"
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Senha temporária"
                        className="border-[var(--neutral-border)]"
                      />
                      <p className="text-sm text-[var(--neutral-text-muted)]">
                        O usuário deverá alterar a senha no primeiro acesso.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserOpen(false)}
                      className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      className="bg-[var(--primary-bg)] text-white hover:opacity-90"
                    >
                      Criar Usuário
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-bg)]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--neutral-border)]">
                        <th className="text-left py-3 px-4 text-[var(--neutral-text)] font-medium">Nome</th>
                        <th className="text-left py-3 px-4 text-[var(--neutral-text)] font-medium">E-mail</th>
                        <th className="text-left py-3 px-4 text-[var(--neutral-text)] font-medium">Cargo</th>
                        <th className="text-left py-3 px-4 text-[var(--neutral-text)] font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-[var(--neutral-text)] font-medium">Último Acesso</th>
                        <th className="text-right py-3 px-4 text-[var(--neutral-text)] font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-[var(--neutral-border)] hover:bg-[var(--neutral-subtle)]">
                          <td className="py-3 px-4 text-[var(--neutral-text)]">{user.full_name}</td>
                          <td className="py-3 px-4 text-[var(--neutral-text-muted)]">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="text-[var(--neutral-text-muted)]">{user.role || '-'}</span>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                          <td className="py-3 px-4 text-[var(--neutral-text-muted)]">
                            {user.last_access ? new Date(user.last_access).toLocaleString('pt-BR') : 'Nunca'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[var(--card)] border-[var(--neutral-border)]">
                                <DropdownMenuItem
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                >
                                  {user.status === 'active' ? 'Desativar' : 'Ativar'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setUserToDelete(user.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[var(--neutral-text)]">Remover Usuário</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
                  Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  className="!bg-red-600 !text-white hover:!bg-red-700 !border-0"
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* NOTIFICAÇÕES TAB */}
        <TabsContent value="notifications" className="space-y-4 md:space-y-6 flex-1 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Categories */}
              <div className="space-y-4">
                <h3 className="font-medium text-[var(--neutral-text)]">Categorias</h3>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Alertas de Segurança</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Receber notificações de alertas críticos</p>
                  </div>
                  <Switch
                    checked={preferences?.security_alerts || false}
                    onCheckedChange={(checked) => updatePreferences({ security_alerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Novos Contratos</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Quando uma nova escola for cadastrada</p>
                  </div>
                  <Switch
                    checked={preferences?.new_contracts || false}
                    onCheckedChange={(checked) => updatePreferences({ new_contracts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Lembretes de Pagamento</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Vencimentos e pagamentos pendentes</p>
                  </div>
                  <Switch
                    checked={preferences?.payment_reminders || false}
                    onCheckedChange={(checked) => updatePreferences({ payment_reminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Atualizações de Escolas</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Mudanças importantes nas escolas</p>
                  </div>
                  <Switch
                    checked={preferences?.school_updates || false}
                    onCheckedChange={(checked) => updatePreferences({ school_updates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Relatórios Semanais</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Resumo semanal por e-mail</p>
                  </div>
                  <Switch
                    checked={preferences?.weekly_reports || false}
                    onCheckedChange={(checked) => updatePreferences({ weekly_reports: checked })}
                  />
                </div>
              </div>

              {/* Notification Channels */}
              <div className="border-t border-[var(--neutral-border)] pt-6 space-y-4">
                <h3 className="font-medium text-[var(--neutral-text)]">Canais de Notificação</h3>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Notificações por E-mail</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Receber notificações por e-mail</p>
                  </div>
                  <Switch
                    checked={preferences?.email_enabled || false}
                    onCheckedChange={(checked) => updatePreferences({ email_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Notificações Push</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Notificações no navegador</p>
                  </div>
                  <Switch
                    checked={preferences?.push_enabled || false}
                    onCheckedChange={(checked) => updatePreferences({ push_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-[var(--neutral-text)]">Notificações na Aplicação</Label>
                    <p className="text-sm text-[var(--neutral-text-muted)]">Notificações dentro da plataforma</p>
                  </div>
                  <Switch
                    checked={preferences?.in_app_enabled || false}
                    onCheckedChange={(checked) => updatePreferences({ in_app_enabled: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotificationPreferences}
                  className="bg-[var(--primary-bg)] text-white hover:opacity-90"
                >
                  Salvar Preferências
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEGURANÇA GLOBAL TAB */}
        <TabsContent value="security" className="space-y-4 md:space-y-6 flex-1 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inactivityTimeout" className="text-[var(--neutral-text)]">
                  Tempo de Inatividade (minutos)
                </Label>
                <Input
                  id="inactivityTimeout"
                  type="number"
                  value={inactivityTimeout}
                  onChange={(e) => setInactivityTimeout(e.target.value)}
                  className="border-[var(--neutral-border)]"
                />
                <p className="text-sm text-[var(--neutral-text-muted)]">
                  Tempo máximo de inatividade antes de deslogar automaticamente.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts" className="text-[var(--neutral-text)]">
                  Máximo de Tentativas de Login
                </Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(e.target.value)}
                  className="border-[var(--neutral-border)]"
                />
                <p className="text-sm text-[var(--neutral-text-muted)]">
                  Número máximo de tentativas de login antes de bloquear a conta.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiration" className="text-[var(--neutral-text)]">
                  Expiração de Senha (dias)
                </Label>
                <Input
                  id="passwordExpiration"
                  type="number"
                  value={passwordExpiration}
                  onChange={(e) => setPasswordExpiration(e.target.value)}
                  className="border-[var(--neutral-border)]"
                />
                <p className="text-sm text-[var(--neutral-text-muted)]">
                  Período após o qual o usuário deve trocar a senha.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSecuritySettings}
                  className="bg-[var(--primary-bg)] text-white hover:opacity-90"
                >
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Logs de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-bg)]" />
                </div>
              ) : securityLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Shield className="w-12 h-12 text-[var(--neutral-text-muted)] mb-3" />
                  <p className="text-sm text-[var(--neutral-text-muted)]">
                    Nenhum log de auditoria registrado ainda
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {securityLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="border-b border-[var(--neutral-border)] pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getSeverityBadge(log.severity)}
                            <span className="text-sm font-medium text-[var(--neutral-text)]">
                              {log.event_type}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--neutral-text-muted)]">{log.description}</p>
                          {log.user_name && (
                            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
                              Por: {log.user_name} ({log.user_email})
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-[var(--neutral-text-muted)] whitespace-nowrap ml-4">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
