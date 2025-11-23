import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  User, 
  Lock, 
  Bell, 
  Monitor, 
  Building, 
  Plug, 
  Users, 
  FileText,
  Save,
  Camera,
  Smartphone,
  Globe,
  LogOut,
  UserPlus,
  Pencil,
  Trash2,
  Upload,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  CreditCard,
  Calendar,
  Package
} from 'lucide-react';
import { useUserProfile } from './UserProfileContext';
import { toast } from 'sonner@2.0.3';
import { PlanTab } from './SettingsScreenPlanTab';
import { useIsMobile } from './ui/use-mobile';

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface OperationalUser {
  id: string;
  name: string;
  cargo: string;
  email: string;
  createdAt: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'operador'; // Adicionado role para diferenciar administrador da escola de operador
}

interface SettingsScreenProps {
  initialTab?: string;
}

export function SettingsScreen({ initialTab = 'conta' }: SettingsScreenProps) {
  const { currentProfile } = useUserProfile();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile tab state
  const [name, setName] = useState('Gestor SegVision');
  const [email, setEmail] = useState('gestor@colegiosantamaria.com.br');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [cargo, setCargo] = useState('Diretor Geral');
  const [theme, setTheme] = useState('sistema');
  const [language, setLanguage] = useState('pt-BR');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications tab state
  const [notificationChannels, setNotificationChannels] = useState({
    whatsapp: true,
    email: true,
    inApp: true,
  });
  const [notificationTypes, setNotificationTypes] = useState({
    alerts: true,
    financial: true,
    system: true,
  });
  const [minimumSeverity, setMinimumSeverity] = useState('baixa');

  // Sessions tab state
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Desktop',
      browser: 'Chrome 120',
      location: 'São Paulo, BR',
      lastActive: 'Agora',
      isCurrent: true
    },
    {
      id: '2',
      device: 'Mobile',
      browser: 'Safari iOS',
      location: 'São Paulo, BR',
      lastActive: 'Há 2 horas',
      isCurrent: false
    }
  ]);

  // Organization tab state (Escola/Admin)
  const [schoolData, setSchoolData] = useState({
    name: 'Colégio Santa Maria',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    cep: '01234-567',
    phone: '(11) 3333-4444',
    email: 'contato@colegiosantamaria.com.br',
    responsible: 'Maria da Silva'
  });

  // Users tab state (Escola/Admin)
  const [operationalUsers, setOperationalUsers] = useState<OperationalUser[]>([
    {
      id: '1',
      name: 'Maria Diretora',
      cargo: 'Diretor',
      email: 'maria.diretora@escola.com',
      createdAt: '2024-01-05',
      status: 'active',
      role: 'admin'
    },
    {
      id: '2',
      name: 'João Silva',
      cargo: 'Operador de Segurança',
      email: 'joao.silva@escola.com',
      createdAt: '2024-01-10',
      status: 'active',
      role: 'operador'
    },
    {
      id: '3',
      name: 'Maria Santos',
      cargo: 'Apoio Operacional',
      email: 'maria.santos@escola.com',
      createdAt: '2024-01-15',
      status: 'active',
      role: 'operador'
    }
  ]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    cargo: '',
    email: '',
    password: ''
  });

  // Integrations tab state (Escola/Admin)
  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'WhatsApp Business', status: 'connected', lastSync: '2024-01-15 14:30' },
    { id: '2', name: 'E-mail SMTP', status: 'connected', lastSync: '2024-01-15 14:25' },
    { id: '3', name: 'Gateway de Pagamento', status: 'disconnected', lastSync: '-' },
    { id: '4', name: 'DocSign (Assinatura)', status: 'connected', lastSync: '2024-01-15 10:00' }
  ]);

  // Plan and Payment tab state (Escola only)
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Plano Pro',
    price: 899.90,
    billingCycle: 'mensal',
    cameras: 20,
    users: 10,
    storage: '500 GB',
    startDate: '2024-01-01',
    nextBilling: '2024-02-01',
    status: 'active'
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    cardNumber: '**** **** **** 4532',
    cardHolder: 'MARIA DA SILVA',
    expiryDate: '12/2026',
    brand: 'Visa'
  });

  const [plans] = useState([
    {
      id: 'basic',
      name: 'Plano Basic',
      subtitle: 'Vigilância Essencial (1 Canal)',
      price: 299.00,
      priceOnRequest: false,
      capacidadeRTSP: 1,
      capacityOver16: false,
      aiFeatures: [
        { id: 'detecaoObjetos', nome: 'Detecção de Objetos/Ações', descricao: 'Identifica armas, agressões e quedas em tempo real.', enabled: true, consumo: 'moderado' },
        { id: 'reconhecimentoFacial', nome: 'Reconhecimento Facial de Risco', descricao: 'Compara rostos detectados com banco de dados de indivíduos de risco.', enabled: false, consumo: 'alto' }
      ],
      suporte: 'padrao',
      historicoAlertas: false
    },
    {
      id: 'pro',
      name: 'Plano Pro',
      subtitle: 'Segurança Completa (Até 16 Canais)',
      price: 899.90,
      priceOnRequest: false,
      capacidadeRTSP: 16,
      capacityOver16: false,
      aiFeatures: [
        { id: 'detecaoObjetos', nome: 'Detecção de Objetos/Ações', descricao: 'Identifica armas, agressões e quedas em tempo real.', enabled: true, consumo: 'moderado' },
        { id: 'reconhecimentoFacial', nome: 'Reconhecimento Facial de Risco', descricao: 'Compara rostos detectados com banco de dados de indivíduos de risco.', enabled: true, consumo: 'alto' }
      ],
      suporte: 'prioritario',
      historicoAlertas: true
    },
    {
      id: 'enterprise',
      name: 'Plano Enterprise',
      subtitle: 'Solução Customizada (Escala Ilimitada)',
      price: null,
      priceOnRequest: true,
      capacidadeRTSP: null,
      capacityOver16: true,
      aiFeatures: [
        { id: 'detecaoObjetos', nome: 'Detecção de Objetos/Ações', descricao: 'Identifica armas, agressões e quedas em tempo real.', enabled: true, consumo: 'moderado' },
        { id: 'reconhecimentoFacial', nome: 'Reconhecimento Facial de Risco', descricao: 'Compara rostos detectados com banco de dados de indivíduos de risco.', enabled: true, consumo: 'alto' }
      ],
      suporte: 'dedicado',
      historicoAlertas: true
    }
  ]);

  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);
  const [isCancelPlanDialogOpen, setIsCancelPlanDialogOpen] = useState(false);
  const [isUpdatePaymentDialogOpen, setIsUpdatePaymentDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Handlers
  const handleSaveProfile = () => {
    toast.success('Alterações salvas com sucesso!');
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos de senha');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('A nova senha e a confirmação não coincidem');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    toast.success('Senha atualizada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = () => {
    toast.success('Preferências de notificação salvas!');
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast.success('Sessão encerrada com sucesso!');
  };

  const handleTerminateAllSessions = () => {
    setSessions(sessions.filter(s => s.isCurrent));
    toast.success('Todas as outras sessões foram encerradas!');
  };

  const handleSaveOrganization = () => {
    toast.success('Dados da organização salvos!');
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.cargo && newUser.email && newUser.password) {
      const user: OperationalUser = {
        id: Date.now().toString(),
        name: newUser.name,
        cargo: newUser.cargo,
        email: newUser.email,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        role: 'operador'
      };
      setOperationalUsers([...operationalUsers, user]);
      setNewUser({ name: '', cargo: '', email: '', password: '' });
      setIsAddUserModalOpen(false);
      toast.success('Usuário criado com sucesso!');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setOperationalUsers(operationalUsers.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
    toast.success('Status do usuário atualizado!');
  };

  const handleTestIntegration = (integrationName: string) => {
    toast.success(`Testando conexão com ${integrationName}...`);
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(integrations.map(i => 
      i.id === integrationId 
        ? { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' } 
        : i
    ));
  };

  const handleChangePlan = () => {
    if (!selectedPlanId) return;
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    if (selectedPlan) {
      setCurrentPlan({
        ...currentPlan,
        name: selectedPlan.name,
        price: selectedPlan.price,
        cameras: selectedPlan.cameras,
        users: selectedPlan.users,
        storage: selectedPlan.storage
      });
      setIsChangePlanDialogOpen(false);
      toast.success(`Plano alterado para ${selectedPlan.name} com sucesso!`);
    }
  };

  const handleCancelPlan = () => {
    setCurrentPlan({...currentPlan, status: 'cancelled'});
    setIsCancelPlanDialogOpen(false);
    toast.success('Plano cancelado. Você terá acesso até o fim do período de faturamento.');
  };

  const handleUpdatePaymentMethod = () => {
    if (!newCardData.cardNumber || !newCardData.cardHolder || !newCardData.expiryDate || !newCardData.cvv) {
      toast.error('Preencha todos os campos do cartão');
      return;
    }
    
    setPaymentMethod({
      type: 'card',
      cardNumber: `**** **** **** ${newCardData.cardNumber.slice(-4)}`,
      cardHolder: newCardData.cardHolder.toUpperCase(),
      expiryDate: newCardData.expiryDate,
      brand: 'Visa' // Em produção, detectar a bandeira
    });
    
    setNewCardData({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    setIsUpdatePaymentDialogOpen(false);
    toast.success('Método de pagamento atualizado com sucesso!');
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Desktop': return Monitor;
      case 'Mobile': return Smartphone;
      default: return Globe;
    }
  };

  // Determine visible tabs based on profile
  const visibleTabs = {
    conta: true,
    dadosCadastrais: currentProfile === 'school' && !isMobile, // Apenas desktop
    usuarios: currentProfile === 'school' && !isMobile, // Apenas desktop
    equipe: false,
    notificacoes: currentProfile === 'admin' ? !isMobile : (currentProfile === 'school' && !isMobile), // Apenas desktop
    plano: currentProfile === 'school' && !isMobile, // Apenas desktop
    integracoes: currentProfile === 'admin' && !isMobile // Apenas desktop
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 gap-2">
            {visibleTabs.conta && <TabsTrigger value="conta" className="px-4 dark:data-[state=active]:bg-[#2F5FFF] dark:data-[state=active]:text-white">Minha Conta e Acesso</TabsTrigger>}
            {visibleTabs.dadosCadastrais && <TabsTrigger value="dadosCadastrais" className="px-4 dark:data-[state=active]:bg-[#2F5FFF] dark:data-[state=active]:text-white">Dados Cadastrais</TabsTrigger>}
            {visibleTabs.usuarios && <TabsTrigger value="usuarios" className="px-4 dark:data-[state=active]:bg-[#2F5FFF] dark:data-[state=active]:text-white">Usuários Internos</TabsTrigger>}
            {visibleTabs.equipe && <TabsTrigger value="equipe" className="px-4 dark:data-[state=active]:bg-[#2F5FFF] dark:data-[state=active]:text-white">Gestão de Equipe e Estrutura</TabsTrigger>}
            {visibleTabs.notificacoes && <TabsTrigger value="notificacoes" className="px-4 dark:data-[state=active]:bg-[#2F5FFF] dark:data-[state=active]:text-white">Notificações</TabsTrigger>}
            {visibleTabs.plano && <TabsTrigger value="plano" className="px-4 dark:data-[state=active]:bg-[#2F5FFF] dark:data-[state=active]:text-white">Plano e Pagamento</TabsTrigger>}
            {visibleTabs.integracoes && <TabsTrigger value="integracoes" className="px-4 dark:data-[state=active]:bg-[#2F5FFF] dark:data-[state=active]:text-white">Integrações</TabsTrigger>}
          </TabsList>

          {/* Tab: Minha Conta e Acesso */}
          <TabsContent value="conta" className="space-y-6">
            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>PNG/JPG até 2MB</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-[rgb(255,255,255)] border-2 border-[var(--gray-200)] flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-[var(--neutral-icon)] dark:text-[var(--blue-primary-300)]" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Alterar foto
                    </Button>
                    {avatarUrl && (
                      <Button variant="outline" size="sm" onClick={() => setAvatarUrl('')}>
                        <X className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)] focus:border-[var(--primary-bg)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)] focus:border-[var(--primary-bg)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)] focus:border-[var(--primary-bg)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo/Função</Label>
                    <Input
                      id="cargo"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Seu cargo"
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)] focus:border-[var(--primary-bg)]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="bg-[var(--primary-bg)] text-white hover:opacity-95">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar alterações
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferências de Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Interface</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="sistema">Sistema</SelectItem>
                      <SelectItem value="claro">Claro</SelectItem>
                      <SelectItem value="escuro">Escuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Alterar Senha */}
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Sua senha deve ter pelo menos 8 caracteres</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)] focus:border-[var(--primary-bg)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)] focus:border-[var(--primary-bg)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)] focus:border-[var(--primary-bg)]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handlePasswordChange} className="bg-[var(--primary-bg)] text-white hover:opacity-95">
                    <Lock className="w-4 h-4 mr-2" />
                    Atualizar senha
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Parâmetros Globais de Segurança (Admin only) */}
            {currentProfile === 'admin' && (
              <Card>
                <CardHeader>
                  <CardTitle>Parâmetros Globais de Segurança</CardTitle>
                  <CardDescription>Configurações aplicadas a todos os usuários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inactivity-timeout">Tempo de inatividade (minutos)</Label>
                    <Input
                      id="inactivity-timeout"
                      type="number"
                      defaultValue="30"
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">Tentativas máximas de login</Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      defaultValue="5"
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-expiration">Expiração de senha (dias)</Label>
                    <Input
                      id="password-expiration"
                      type="number"
                      defaultValue="90"
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sessões Ativas */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Sessões Ativas</CardTitle>
                    <CardDescription>Dispositivos conectados à sua conta</CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full md:w-auto">
                        <LogOut className="w-4 h-4 mr-2" />
                        Encerrar todas as outras
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Encerrar todas as sessões?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação encerrará todas as outras sessões ativas, mantendo apenas a atual.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleTerminateAllSessions}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => {
                    const DeviceIcon = getDeviceIcon(session.device);
                    return (
                      <div key={session.id} className="bg-[var(--analytics-list-bg)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border border-[var(--neutral-border)] rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-[rgba(246,246,246,0)] rounded-lg">
                            <DeviceIcon className="w-5 h-5 text-[var(--neutral-icon)]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[var(--neutral-text)]">{session.device}</p>
                              {session.isCurrent ? (
                                <Badge variant="medium" tone="primary" size="s">Atual</Badge>
                              ) : (
                                <Badge variant="light" tone="info" size="s">Recente</Badge>
                              )}
                            </div>
                            <p className="text-sm text-[var(--neutral-text-muted)]">
                              {session.browser} • {session.location}
                            </p>
                            <p className="text-xs text-[var(--neutral-text-muted)]">
                              Última atividade: {session.lastActive}
                            </p>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTerminateSession(session.id)}
                            className="w-full md:w-auto"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Encerrar
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Dados Cadastrais */}
          <TabsContent value="dadosCadastrais" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Cadastrais da Escola</CardTitle>
                <CardDescription>Informações básicas da organização</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="school-name">Nome da Escola</Label>
                    <Input
                      id="school-name"
                      value={schoolData.name}
                      onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={schoolData.cnpj}
                      onChange={(e) => setSchoolData({ ...schoolData, cnpj: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={schoolData.address}
                      onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={schoolData.city}
                      onChange={(e) => setSchoolData({ ...schoolData, city: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={schoolData.state}
                      onChange={(e) => setSchoolData({ ...schoolData, state: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={schoolData.cep}
                      onChange={(e) => setSchoolData({ ...schoolData, cep: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-phone">Telefone</Label>
                    <Input
                      id="school-phone"
                      value={schoolData.phone}
                      onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-email">E-mail</Label>
                    <Input
                      id="school-email"
                      type="email"
                      value={schoolData.email}
                      onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                      className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveOrganization} className="bg-[var(--primary-bg)] text-white hover:opacity-95">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Gestão de Usuários da Escola */}
          <TabsContent value="usuarios" className="space-y-6">
            {/* Gestão de Usuários Operacionais */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Usuários Internos</CardTitle>
                    <CardDescription>Equipe de segurança e operação</CardDescription>
                  </div>
                  <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[var(--primary-bg)] text-white hover:opacity-95 w-full md:w-auto">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Adicionar Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Preencha os dados do usuário operacional
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-user-name">Nome</Label>
                          <Input
                            id="new-user-name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            placeholder="Nome completo"
                            className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-user-cargo">Cargo</Label>
                          <Input
                            id="new-user-cargo"
                            value={newUser.cargo}
                            onChange={(e) => setNewUser({ ...newUser, cargo: e.target.value })}
                            placeholder="Ex: Operador de Segurança"
                            className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-user-email">E-mail</Label>
                          <Input
                            id="new-user-email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="usuario@escola.com"
                            className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-user-password">Senha Inicial</Label>
                          <Input
                            id="new-user-password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="Mínimo 8 caracteres"
                            className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddUser} className="bg-[var(--primary-bg)] text-white hover:opacity-95">
                          Criar Usuário
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operationalUsers.map((user) => (
                    <div key={user.id} className="bg-[var(--analytics-list-bg)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border border-[var(--neutral-border)] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[rgba(246,246,246,0)] rounded-lg">
                          <User className="w-5 h-5 text-[var(--neutral-icon)]" />
                        </div>
                        <div className="flex-1">
                          {/* Badges no topo em mobile, inline em desktop */}
                          <div className="flex flex-col md:hidden gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {user.role === 'admin' && (
                                <Badge variant="heavy" tone="primary" size="s">
                                  Administrador
                                </Badge>
                              )}
                              <Badge 
                                variant={user.status === 'active' ? 'medium' : 'light'} 
                                tone={user.status === 'active' ? 'success' : 'neutral'} 
                                size="s"
                              >
                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Nome com badges inline em desktop */}
                          <div className="flex items-center gap-2">
                            <p className="text-[var(--neutral-text)]">{user.name}</p>
                            <div className="hidden md:flex items-center gap-2">
                              {user.role === 'admin' && (
                                <Badge variant="heavy" tone="primary" size="s">
                                  Administrador
                                </Badge>
                              )}
                              <Badge 
                                variant={user.status === 'active' ? 'medium' : 'light'} 
                                tone={user.status === 'active' ? 'success' : 'neutral'} 
                                size="s"
                              >
                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-[var(--neutral-text-muted)]">
                            {user.cargo} • {user.email}
                          </p>
                          <p className="text-xs text-[var(--neutral-text-muted)]">
                            Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="w-full md:w-auto"
                        >
                          {user.status === 'active' ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canais de Notificação</CardTitle>
                <CardDescription>Selecione onde deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[var(--neutral-text)]">WhatsApp</p>
                    <p className="text-sm text-[var(--neutral-text-muted)]">
                      Receber notificações via WhatsApp Business
                    </p>
                  </div>
                  <Switch
                    checked={notificationChannels.whatsapp}
                    onCheckedChange={(checked) => setNotificationChannels({ ...notificationChannels, whatsapp: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[var(--neutral-text)]">E-mail</p>
                    <p className="text-sm text-[var(--neutral-text-muted)]">
                      Receber notificações por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={notificationChannels.email}
                    onCheckedChange={(checked) => setNotificationChannels({ ...notificationChannels, email: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[var(--neutral-text)]">In-app</p>
                    <p className="text-sm text-[var(--neutral-text-muted)]">
                      Notificações dentro do sistema (sempre ativo)
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Notificação</CardTitle>
                <CardDescription>Escolha quais eventos deseja acompanhar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[var(--neutral-text)]">Alertas de Segurança</p>
                    <p className="text-sm text-[var(--neutral-text-muted)]">
                      Intrusões, reconhecimento facial, etc.
                    </p>
                  </div>
                  <Switch
                    checked={notificationTypes.alerts}
                    onCheckedChange={(checked) => setNotificationTypes({ ...notificationTypes, alerts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[var(--neutral-text)]">Financeiro</p>
                    <p className="text-sm text-[var(--neutral-text-muted)]">
                      Cobranças, pagamentos e vencimentos
                    </p>
                  </div>
                  <Switch
                    checked={notificationTypes.financial}
                    onCheckedChange={(checked) => setNotificationTypes({ ...notificationTypes, financial: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[var(--neutral-text)]">Sistema</p>
                    <p className="text-sm text-[var(--neutral-text-muted)]">
                      Atualizações, manutenções e avisos
                    </p>
                  </div>
                  <Switch
                    checked={notificationTypes.system}
                    onCheckedChange={(checked) => setNotificationTypes({ ...notificationTypes, system: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gravidade Mínima</CardTitle>
                <CardDescription>Receber apenas alertas a partir de:</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={minimumSeverity} onValueChange={setMinimumSeverity}>
                  <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} className="bg-[var(--primary-bg)] text-white hover:opacity-95">
                <Save className="w-4 h-4 mr-2" />
                Salvar preferências
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Plano e Pagamento */}
          <TabsContent value="plano">
            <PlanTab
              currentPlan={currentPlan}
              paymentMethod={paymentMethod}
              plans={plans}
              selectedPlanId={selectedPlanId}
              setSelectedPlanId={setSelectedPlanId}
              isChangePlanDialogOpen={isChangePlanDialogOpen}
              setIsChangePlanDialogOpen={setIsChangePlanDialogOpen}
              isCancelPlanDialogOpen={isCancelPlanDialogOpen}
              setIsCancelPlanDialogOpen={setIsCancelPlanDialogOpen}
              isUpdatePaymentDialogOpen={isUpdatePaymentDialogOpen}
              setIsUpdatePaymentDialogOpen={setIsUpdatePaymentDialogOpen}
              newCardData={newCardData}
              setNewCardData={setNewCardData}
              handleChangePlan={handleChangePlan}
              handleCancelPlan={handleCancelPlan}
              handleUpdatePaymentMethod={handleUpdatePaymentMethod}
            />
          </TabsContent>

          {/* Tab: Integrações */}
          <TabsContent value="integracoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações Externas</CardTitle>
                <CardDescription>Conecte serviços e APIs de terceiros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="bg-[var(--analytics-list-bg)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border border-[var(--neutral-border)] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[rgba(246,246,246,0)] rounded-lg">
                          <Plug className="w-5 h-5 text-[var(--neutral-icon)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[var(--neutral-text)]">{integration.name}</p>
                            <Badge 
                              variant={integration.status === 'connected' ? 'heavy' : 'light'} 
                              tone={integration.status === 'connected' ? 'success' : 'neutral'} 
                              size="s"
                            >
                              {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--neutral-text-muted)]">
                            {integration.status === 'connected' 
                              ? `Última sincronização: ${integration.lastSync}` 
                              : 'Não configurado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        {integration.status === 'connected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestIntegration(integration.name)}
                            className="w-full md:w-auto"
                          >
                            Testar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleIntegration(integration.id)}
                          className="w-full md:w-auto"
                        >
                          {integration.status === 'connected' ? 'Desconectar' : 'Conectar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}