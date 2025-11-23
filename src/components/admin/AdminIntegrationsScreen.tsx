import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { EmptyState } from '../EmptyState';
import { 
  Plug, 
  Database, 
  Mail, 
  Lock,
  Webhook,
  Key,
  CheckCircle2,
  AlertCircle,
  Settings,
  Plus,
  Trash2,
  MessageCircle,
  Send
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { showToast } from '../ui/toast-utils';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error';
  category: 'api' | 'payment' | 'communication' | 'storage';
  lastSync?: string;
}

interface WebhookType {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastTriggered?: string;
}

const mockIntegrations: Integration[] = [
  {
    id: 'int-1',
    name: 'API de Reconhecimento Facial',
    description: 'Integração com serviço de IA para reconhecimento facial',
    icon: Database,
    status: 'connected',
    category: 'api',
    lastSync: '2024-06-20 14:30'
  },
  {
    id: 'int-2',
    name: 'SendGrid (SMTP)',
    description: 'Serviço de envio de emails transacionais',
    icon: Mail,
    status: 'connected',
    category: 'communication',
    lastSync: '2024-06-20 13:15'
  },
  {
    id: 'int-3',
    name: 'Stripe',
    description: 'Gateway de pagamentos e faturamento',
    icon: Lock,
    status: 'disconnected',
    category: 'payment',
  },
];

const mockWebhooks: WebhookType[] = [
  {
    id: 'wh-1',
    name: 'Webhook de Alertas',
    url: 'https://api.school.com/webhooks/alerts',
    events: ['alert.created', 'alert.resolved'],
    status: 'active',
    lastTriggered: '2024-06-20 14:22'
  },
  {
    id: 'wh-2',
    name: 'Webhook de Faturamento',
    url: 'https://api.school.com/webhooks/billing',
    events: ['invoice.created', 'payment.received'],
    status: 'active',
    lastTriggered: '2024-06-19 09:15'
  },
];

interface AdminIntegrationsScreenProps {
  isFirstAccess?: boolean;
}

export function AdminIntegrationsScreen({ isFirstAccess = false }: AdminIntegrationsScreenProps) {
  const [integrations, setIntegrations] = useState<Integration[]>(isFirstAccess ? [] : mockIntegrations);
  const [webhooks, setWebhooks] = useState<WebhookType[]>(isFirstAccess ? [] : mockWebhooks);
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false);
  const [whatsAppStatus, setWhatsAppStatus] = useState<'connected' | 'error'>('connected');
  const [isTestWhatsAppOpen, setIsTestWhatsAppOpen] = useState(false);
  const [testSchool, setTestSchool] = useState('');
  const [testContact, setTestContact] = useState('');
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configureWhatsAppOpen, setConfigureWhatsAppOpen] = useState(false);
  const [disconnectWhatsAppOpen, setDisconnectWhatsAppOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const config = {
      connected: { variant: 'heavy' as const, tone: 'success' as const, label: 'Conectada' },
      disconnected: { variant: 'medium' as const, tone: 'neutral' as const, label: 'Desconectado' },
      error: { variant: 'heavy' as const, tone: 'danger' as const, label: 'Falha' },
      active: { variant: 'heavy' as const, tone: 'success' as const, label: 'Ativo' },
      inactive: { variant: 'medium' as const, tone: 'neutral' as const, label: 'Inativo' }
    };
    const { variant, tone, label } = config[status as keyof typeof config];
    return <Badge variant={variant} tone={tone} size="s">{label}</Badge>;
  };

  const toggleWebhookStatus = (id: string) => {
    setWebhooks(webhooks.map(wh => 
      wh.id === id ? { ...wh, status: wh.status === 'active' ? 'inactive' : 'active' } : wh
    ));
  };

  const deleteWebhook = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este webhook?')) {
      setWebhooks(webhooks.filter(wh => wh.id !== id));
    }
  };

  const handleTestWhatsApp = () => {
    if (!testSchool || !testContact) {
      showToast('error', 'Selecione uma escola e um contato');
      return;
    }

    // Simula envio de teste
    const success = Math.random() > 0.2; // 80% de sucesso
    
    if (success) {
      showToast('success', 'Mensagem de teste enviada com sucesso!');
      setIsTestWhatsAppOpen(false);
      setTestSchool('');
      setTestContact('');
    } else {
      showToast('error', 'Falha ao enviar mensagem. Verifique a conexão com WhatsApp.');
    }
  };

  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigureDialogOpen(true);
  };

  const handleDisconnectIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setDisconnectDialogOpen(true);
  };

  const confirmDisconnect = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.map(int =>
        int.id === selectedIntegration.id
          ? { ...int, status: 'disconnected' as const, lastSync: undefined }
          : int
      ));
      showToast('success', `${selectedIntegration.name} desconectado com sucesso`);
      setDisconnectDialogOpen(false);
      setSelectedIntegration(null);
    }
  };

  const handleConnectIntegration = (integration: Integration) => {
    setIntegrations(integrations.map(int =>
      int.id === integration.id
        ? { ...int, status: 'connected' as const, lastSync: new Date().toLocaleString('pt-BR') }
        : int
    ));
    showToast('success', `${integration.name} conectado com sucesso`);
  };

  const saveIntegrationConfig = () => {
    showToast('success', 'Configurações salvas com sucesso');
    setConfigureDialogOpen(false);
    setSelectedIntegration(null);
  };

  const saveWhatsAppConfig = () => {
    showToast('success', 'Configurações do WhatsApp salvas com sucesso');
    setConfigureWhatsAppOpen(false);
  };

  const confirmDisconnectWhatsApp = () => {
    setWhatsAppStatus('error');
    showToast('success', 'WhatsApp Business API desconectado');
    setDisconnectWhatsAppOpen(false);
  };

  const handleReconnectWhatsApp = () => {
    setWhatsAppStatus('connected');
    showToast('success', 'WhatsApp Business API reconectado com sucesso');
  };

  // Show empty state for first access
  if (isFirstAccess && integrations.length === 0 && webhooks.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={Plug}
          title="Nenhuma integração configurada"
          description="As integrações com APIs externas e webhooks estarão disponíveis após configurar as escolas no sistema."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="bg-[var(--neutral-subtle)] border-[var(--neutral-border)]">
          <TabsTrigger value="integrations" className="data-[state=active]:bg-[var(--neutral-bg)]">Integrações</TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-[var(--neutral-bg)]">Webhooks</TabsTrigger>
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-[var(--neutral-bg)]">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          {/* WhatsApp Error Banner */}
          {whatsAppStatus === 'error' && (
            <div className="bg-[var(--red-alert-50)] dark:bg-[var(--red-alert-300)]/10 border border-[var(--red-alert-300)] rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-[var(--red-alert-300)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[var(--neutral-text)] mb-1">WhatsApp desconectado</h4>
                  <p className="text-sm text-[var(--neutral-text-muted)]">
                    A integração com WhatsApp está desconectada. Alertas não serão entregues.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Card */}
          <Card className="border-[var(--neutral-border)]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--green-alert-50)] dark:bg-[var(--green-alert-400)]/10 rounded-md">
                    <MessageCircle className="h-5 w-5 text-[var(--green-alert-400)]" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-[var(--neutral-text)]">WhatsApp Business API</CardTitle>
                    <p className="text-sm text-[var(--neutral-text-muted)] mt-1">
                      Envio automático de alertas críticos para contatos das escolas
                    </p>
                  </div>
                </div>
                {getStatusBadge(whatsAppStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-[var(--neutral-text)] text-sm">Número/Conta Remetente</Label>
                  <p className="text-sm text-[var(--neutral-text-muted)] mt-1">+55 11 98765-4321</p>
                </div>
                
                <div>
                  <Label className="text-[var(--neutral-text)] text-sm">Template de Mensagem</Label>
                  <div className="mt-2 p-3 bg-[var(--neutral-subtle)] dark:bg-[var(--blue-primary-800)] rounded-lg border border-[var(--neutral-border)]">
                    <p className="text-sm text-[var(--neutral-text)]" style={{ whiteSpace: 'pre-line' }}>
                      {`[ALERTA] {{Tipo}} – {{Escola}}\n\nGravidade: {{Alta|Média|Baixa}}\nCâmera: {{Nome}}\nData/Hora: {{DD/MM HH:mm}}\n\nVeja no sistema: {{link_alerta}}`}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--neutral-text-muted)] mt-2">
                    Por conformidade com LGPD, apenas metadados são enviados. Imagens e vídeos não são incluídos.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog open={isTestWhatsAppOpen} onOpenChange={setIsTestWhatsAppOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                      disabled={whatsAppStatus === 'error'}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Testar Envio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                    <DialogHeader>
                      <DialogTitle className="text-[var(--neutral-text)]">Testar Envio de WhatsApp</DialogTitle>
                      <DialogDescription className="text-[var(--neutral-text-muted)]">
                        Selecione uma escola e um contato para enviar uma mensagem de teste
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-[var(--neutral-text)]">Escola</Label>
                        <Select value={testSchool} onValueChange={setTestSchool}>
                          <SelectTrigger className="border-[var(--neutral-border)]">
                            <SelectValue placeholder="Selecione uma escola" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="escola-1">Colégio São Paulo</SelectItem>
                            <SelectItem value="escola-2">Escola Municipal Centro</SelectItem>
                            <SelectItem value="escola-3">Instituto Educacional ABC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[var(--neutral-text)]">Contato</Label>
                        <Select value={testContact} onValueChange={setTestContact} disabled={!testSchool}>
                          <SelectTrigger className="border-[var(--neutral-border)]">
                            <SelectValue placeholder="Selecione um contato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contato-1">Maria Silva - Diretora</SelectItem>
                            <SelectItem value="contato-2">João Santos - Vice-Diretor</SelectItem>
                            <SelectItem value="contato-3">Ana Costa - Coordenadora</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-[var(--neutral-text-muted)]">
                          Apenas contatos marcados para receber WhatsApp são listados
                        </p>
                      </div>

                      <div className="p-3 bg-[var(--turquoise-alert-50)] dark:bg-[var(--turquoise-alert-400)]/10 border border-[var(--turquoise-alert-400)] rounded-lg">
                        <div className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-[var(--turquoise-alert-400)] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-[var(--neutral-text)]">
                            Uma mensagem de teste será enviada para o contato selecionado
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsTestWhatsAppOpen(false);
                            setTestSchool('');
                            setTestContact('');
                          }}
                          className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleTestWhatsApp}
                          className="bg-[var(--green-alert-400)] text-white hover:opacity-96"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Teste
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {whatsAppStatus === 'connected' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                      onClick={() => setConfigureWhatsAppOpen(true)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[var(--neutral-border)] text-[var(--danger-bg)] hover:bg-[var(--neutral-subtle)]"
                      onClick={() => setDisconnectWhatsAppOpen(true)}
                    >
                      Desconectar
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="bg-[var(--primary-bg)] text-white hover:opacity-96"
                    onClick={handleReconnectWhatsApp}
                  >
                    <Plug className="mr-2 h-4 w-4" />
                    Reconectar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Other Integrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="border-[var(--neutral-border)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--neutral-subtle)] rounded-md">
                          <Icon className="h-5 w-5 text-[var(--neutral-icon)]" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-[var(--neutral-text)]">{integration.name}</CardTitle>
                          <p className="text-sm text-[var(--neutral-text-muted)] mt-1">{integration.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {integration.lastSync && (
                      <p className="text-xs text-[var(--neutral-text-muted)] mb-3">
                        Última sincronização: {integration.lastSync}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                            onClick={() => handleConfigureIntegration(integration)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Configurar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-[var(--neutral-border)] text-[var(--danger-bg)] hover:bg-[var(--neutral-subtle)]"
                            onClick={() => handleDisconnectIntegration(integration)}
                          >
                            Desconectar
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm"
                          className="flex-1 bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
                          onClick={() => handleConnectIntegration(integration)}
                        >
                          <Plug className="mr-2 h-4 w-4" />
                          Conectar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddWebhookOpen} onOpenChange={setIsAddWebhookOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]">
                  <Plus className="h-4 w-4" />
                  Adicionar Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
                <DialogHeader>
                  <DialogTitle className="text-[var(--neutral-text)]">Adicionar Webhook</DialogTitle>
                  <DialogDescription className="text-[var(--neutral-text-muted)]">
                    Configure um novo webhook para receber notificações de eventos do sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-[var(--neutral-text)]">Nome</Label>
                    <Input 
                      placeholder="Nome do webhook"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--neutral-text)]">URL</Label>
                    <Input 
                      placeholder="https://api.example.com/webhook"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--neutral-text)]">Eventos</Label>
                    <Select>
                      <SelectTrigger className="border-[var(--neutral-border)]">
                        <SelectValue placeholder="Selecione os eventos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alerts">Alertas</SelectItem>
                        <SelectItem value="billing">Faturamento</SelectItem>
                        <SelectItem value="all">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setIsAddWebhookOpen(false)}
                      className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={() => setIsAddWebhookOpen(false)}
                      className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="border-[var(--neutral-border)]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-[var(--neutral-text)]">{webhook.name}</h3>
                        {getStatusBadge(webhook.status)}
                      </div>
                      <p className="text-sm text-[var(--neutral-text-muted)] mb-2">{webhook.url}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {webhook.events.map((event, idx) => (
                          <span key={idx} className="px-2 py-1 bg-[var(--neutral-subtle)] text-[var(--neutral-text)] rounded text-xs">
                            {event}
                          </span>
                        ))}
                      </div>
                      {webhook.lastTriggered && (
                        <p className="text-xs text-[var(--neutral-text-muted)]">
                          Último disparo: {webhook.lastTriggered}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.status === 'active'}
                        onCheckedChange={() => toggleWebhookStatus(webhook.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id)}
                        className="text-[var(--danger-bg)] hover:bg-[var(--neutral-subtle)] dark:text-[var(--danger-bg)] dark:hover:bg-[var(--neutral-subtle)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card className="border-[var(--neutral-border)]">
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">API Keys do Sistema</CardTitle>
              <p className="text-sm text-[var(--neutral-text-muted)]">Gerencie as chaves de API para acesso externo ao SegVision</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[var(--neutral-text)]">API Key Principal</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    value="sk_live_••••••••••••••••••••••••••••••••"
                    readOnly
                    className="flex-1 border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                  <Button 
                    variant="outline"
                    className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Regenerar
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-[var(--warning-bg)]/10 border border-[var(--warning-bg)] rounded-md">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-[var(--warning-bg)] flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--neutral-text)]">
                      Mantenha suas API keys seguras. Nunca compartilhe ou exponha suas chaves em repositórios públicos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configure Integration Dialog */}
      <Dialog open={configureDialogOpen} onOpenChange={setConfigureDialogOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--neutral-text)]">
              Configurar {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription className="text-[var(--neutral-text-muted)]">
              Gerencie as credenciais e configurações da integração
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedIntegration?.id === 'int-1' && (
              <>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">API Key</Label>
                  <Input 
                    type="password"
                    defaultValue="sk_live_••••••••••••••••••••"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Endpoint URL</Label>
                  <Input 
                    defaultValue="https://api.facialrecognition.com/v1"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Timeout (segundos)</Label>
                  <Input 
                    type="number"
                    defaultValue="30"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
              </>
            )}
            {selectedIntegration?.id === 'int-2' && (
              <>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">API Key SendGrid</Label>
                  <Input 
                    type="password"
                    defaultValue="SG.••••••••••••••••••••"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Email Remetente</Label>
                  <Input 
                    type="email"
                    defaultValue="noreply@segvision.com.br"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Nome do Remetente</Label>
                  <Input 
                    defaultValue="SegVision - Sistema de Alertas"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
              </>
            )}
            {selectedIntegration?.id === 'int-3' && (
              <>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Publishable Key</Label>
                  <Input 
                    defaultValue="pk_live_••••••••••••••••••••"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Secret Key</Label>
                  <Input 
                    type="password"
                    defaultValue="sk_live_••••••••••••••••••••"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Webhook Secret</Label>
                  <Input 
                    type="password"
                    defaultValue="whsec_••••••••••••••••••••"
                    className="border-[var(--neutral-border)]"
                  />
                </div>
              </>
            )}

            <div className="p-3 bg-[var(--turquoise-alert-50)] dark:bg-[var(--turquoise-alert-400)]/10 border border-[var(--turquoise-alert-400)] rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-[var(--turquoise-alert-400)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--neutral-text)]">
                  Mantenha suas credenciais seguras. Alterações nas chaves de API podem afetar o funcionamento da integração.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfigureDialogOpen(false)}
                className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveIntegrationConfig}
                className="bg-[var(--primary-bg)] text-white hover:opacity-96"
              >
                Salvar Configurações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--neutral-text)]">
              Desconectar {selectedIntegration?.name}?
            </DialogTitle>
            <DialogDescription className="text-[var(--neutral-text-muted)]">
              Esta ação irá interromper a integração e pode afetar o funcionamento do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-[var(--red-alert-50)] dark:bg-[var(--red-alert-300)]/10 border border-[var(--red-alert-300)] rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-[var(--red-alert-300)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[var(--neutral-text)] mb-1">Atenção</h4>
                  <p className="text-sm text-[var(--neutral-text-muted)]">
                    Ao desconectar esta integração, os seguintes recursos serão afetados:
                  </p>
                  <ul className="mt-2 text-sm text-[var(--neutral-text-muted)] list-disc list-inside space-y-1">
                    {selectedIntegration?.id === 'int-1' && (
                      <>
                        <li>Reconhecimento facial não estará disponível</li>
                        <li>Alertas de IA relacionados não serão gerados</li>
                      </>
                    )}
                    {selectedIntegration?.id === 'int-2' && (
                      <>
                        <li>Emails de notificação não serão enviados</li>
                        <li>Escolas não receberão alertas por email</li>
                      </>
                    )}
                    {selectedIntegration?.id === 'int-3' && (
                      <>
                        <li>Processamento de pagamentos será interrompido</li>
                        <li>Faturas não poderão ser geradas</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDisconnectDialogOpen(false)}
                className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDisconnect}
                className="bg-[var(--danger-bg)] text-white hover:opacity-96"
              >
                Sim, Desconectar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configure WhatsApp Dialog */}
      <Dialog open={configureWhatsAppOpen} onOpenChange={setConfigureWhatsAppOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--neutral-text)]">
              Configurar WhatsApp Business API
            </DialogTitle>
            <DialogDescription className="text-[var(--neutral-text-muted)]">
              Gerencie as credenciais e configurações do WhatsApp
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">Token de Acesso da API</Label>
              <Input 
                type="password"
                defaultValue="EAAx••••••••••••••••••••••••••••••••"
                className="border-[var(--neutral-border)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">ID do Número de Telefone</Label>
              <Input 
                defaultValue="103629825483728"
                className="border-[var(--neutral-border)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">Número Remetente</Label>
              <Input 
                type="tel"
                defaultValue="+55 11 98765-4321"
                className="border-[var(--neutral-border)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">ID do Aplicativo Meta</Label>
              <Input 
                defaultValue="1234567890123456"
                className="border-[var(--neutral-border)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">Webhook Secret (Verificação)</Label>
              <Input 
                type="password"
                defaultValue="my_webhook_secret_••••••••"
                className="border-[var(--neutral-border)]"
              />
            </div>

            <div className="p-3 bg-[var(--turquoise-alert-50)] dark:bg-[var(--turquoise-alert-400)]/10 border border-[var(--turquoise-alert-400)] rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-[var(--turquoise-alert-400)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--neutral-text)]">
                  Você pode obter suas credenciais no Facebook for Developers → Seu Aplicativo → WhatsApp → Configurações da API
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfigureWhatsAppOpen(false)}
                className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveWhatsAppConfig}
                className="bg-[var(--primary-bg)] text-white hover:opacity-96"
              >
                Salvar Configurações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect WhatsApp Confirmation Dialog */}
      <Dialog open={disconnectWhatsAppOpen} onOpenChange={setDisconnectWhatsAppOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--neutral-text)]">
              Desconectar WhatsApp Business API?
            </DialogTitle>
            <DialogDescription className="text-[var(--neutral-text-muted)]">
              Esta ação irá interromper o envio de alertas via WhatsApp
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-[var(--red-alert-50)] dark:bg-[var(--red-alert-300)]/10 border border-[var(--red-alert-300)] rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-[var(--red-alert-300)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[var(--neutral-text)] mb-1">Atenção</h4>
                  <p className="text-sm text-[var(--neutral-text-muted)]">
                    Ao desconectar o WhatsApp Business API, os seguintes recursos serão afetados:
                  </p>
                  <ul className="mt-2 text-sm text-[var(--neutral-text-muted)] list-disc list-inside space-y-1">
                    <li>Alertas críticos não serão enviados via WhatsApp</li>
                    <li>Escolas não receberão notificações instantâneas</li>
                    <li>Apenas email e notificações no sistema estarão disponíveis</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDisconnectWhatsAppOpen(false)}
                className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDisconnectWhatsApp}
                className="bg-[var(--danger-bg)] text-white hover:opacity-96"
              >
                Sim, Desconectar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}