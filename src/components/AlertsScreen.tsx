import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, AlertTriangle, Ban, User, Users, Package, Video, Camera, Clock, MapPin, Download, type LucideIcon } from 'lucide-react';
import { AlertClassifyModal } from './AlertClassifyModal';
import { VideoPreviewModal } from './VideoPreviewModal';
import { useIsMobile } from './ui/use-mobile';
import { EmptyState } from './EmptyState';
import { supabase } from '../lib/supabase';
import { useUserProfile } from './UserProfileContext';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'intrusion' | 'face' | 'crowd' | 'object' | 'camera_offline';
  title: string;
  description: string;
  camera: string;
  location?: string;
  time: string;
  date: string;
  status: 'novo' | 'confirmado' | 'resolvido' | 'falso';
  severity: 'baixa' | 'media' | 'alta';
  icon: LucideIcon;
  streamUrl?: string;
  actionBy?: {
    name: string;
    role: string;
  };
}

interface AlertsScreenProps {
  initialSearchTerm?: string;
  isFirstAccess?: boolean;
}

const getIconForType = (type: Alert['type']): LucideIcon => {
  switch (type) {
    case 'intrusion':
      return Ban;
    case 'face':
      return User;
    case 'crowd':
      return Users;
    case 'object':
      return Package;
    case 'camera_offline':
      return Camera;
    default:
      return AlertTriangle;
  }
};

export function AlertsScreen({ initialSearchTerm = '', isFirstAccess = false }: AlertsScreenProps) {
  const { userProfile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [severityFilter, setSeverityFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [cameraFilter, setCameraFilter] = useState('todas');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [classifyModalOpen, setClassifyModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Load alerts from Supabase
  const loadAlerts = async () => {
    if (!userProfile?.school_id) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch alerts with camera and user information
      const { data: alertsData, error } = await supabase
        .from('alerts')
        .select(`
          *,
          cameras (
            id,
            name,
            locations (
              id,
              name,
              environments (
                id,
                name
              )
            )
          ),
          users!alerts_action_by_user_id_fkey (
            id,
            name,
            role
          )
        `)
        .eq('school_id', userProfile.school_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database alerts to frontend format
      const transformedAlerts: Alert[] = (alertsData || []).map(alert => {
        // Format date and time
        const createdAt = new Date(alert.created_at);
        const date = createdAt.toLocaleDateString('pt-BR');
        const time = createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        // Get camera name and location
        const cameraName = alert.cameras?.name || 'Câmera desconhecida';
        const location = alert.cameras?.locations?.name
          ? `${alert.cameras.locations.environments?.name || ''} → ${alert.cameras.locations.name}`.trim()
          : undefined;

        // Get action by user info
        const actionBy = alert.users ? {
          name: alert.users.name,
          role: alert.users.role || 'Usuário'
        } : undefined;

        return {
          id: alert.id,
          type: alert.type,
          title: alert.title,
          description: alert.description,
          camera: cameraName,
          location,
          time,
          date,
          status: alert.status,
          severity: alert.severity,
          icon: getIconForType(alert.type),
          streamUrl: alert.stream_url || undefined,
          actionBy
        };
      });

      setAlerts(transformedAlerts);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      toast.error('Erro ao carregar alertas');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load alerts when school_id is available
  useEffect(() => {
    if (userProfile?.school_id) {
      loadAlerts();
    }
  }, [userProfile?.school_id]);

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.camera.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'todas' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'todos' || alert.status === statusFilter;
    const matchesType = typeFilter === 'todos' || alert.type === typeFilter;
    const matchesCamera = cameraFilter === 'todas' || alert.camera === cameraFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesType && matchesCamera;
  });

  const handleConfirm = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          status: 'confirmado',
          action_by_user_id: userProfile?.id
        })
        .eq('id', alertId);

      if (error) throw error;

      // Update local state optimistically
      setAlerts(alerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'confirmado',
              actionBy: {
                name: userProfile?.name || 'Usuário',
                role: userProfile?.role || 'Usuário'
              }
            }
          : alert
      ));

      toast.success('Alerta confirmado com sucesso');
    } catch (error) {
      console.error('Erro ao confirmar alerta:', error);
      toast.error('Erro ao confirmar alerta');
    }
  };

  const handleResolve = (alertId: string) => {
    setSelectedAlert(alerts.find(a => a.id === alertId) || null);
    setClassifyModalOpen(true);
  };

  const handleViewVideo = (alertId: string) => {
    setSelectedAlert(alerts.find(a => a.id === alertId) || null);
    setVideoModalOpen(true);
  };

  const handleClassifyConfirm = async (alertId: string, classification: string, notes: string) => {
    try {
      let newStatus: Alert['status'];
      switch (classification) {
        case 'incidente_tratado':
          newStatus = 'resolvido';
          break;
        case 'falso_positivo':
          newStatus = 'falso';
          break;
        case 'ignorado':
          newStatus = 'resolvido';
          break;
        default:
          newStatus = 'resolvido';
      }

      const updateData: any = {
        status: newStatus,
        action_by_user_id: userProfile?.id
      };

      // Add resolved_at timestamp if status is resolvido or falso
      if (newStatus === 'resolvido' || newStatus === 'falso') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('alerts')
        .update(updateData)
        .eq('id', alertId);

      if (error) throw error;

      // Update local state
      setAlerts(alerts.map(alert => {
        if (alert.id === alertId) {
          return {
            ...alert,
            status: newStatus,
            actionBy: {
              name: userProfile?.name || 'Usuário',
              role: userProfile?.role || 'Usuário'
            }
          };
        }
        return alert;
      }));

      toast.success('Alerta classificado com sucesso');
    } catch (error) {
      console.error('Erro ao classificar alerta:', error);
      toast.error('Erro ao classificar alerta');
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'alta':
        return 'var(--red-alert-300)';
      case 'media':
        return 'var(--orange-alert-300)';
      case 'baixa':
        return 'var(--turquoise-alert-400)';
    }
  };

  const getStatusBadge = (status: Alert['status']) => {
    switch (status) {
      case 'novo':
        return <Badge variant="medium" tone="danger" size="m">Novo</Badge>;
      case 'confirmado':
        return <Badge variant="medium" tone="caution" size="m">Confirmado</Badge>;
      case 'resolvido':
        return <Badge variant="medium" tone="success" size="m">Resolvido</Badge>;
      case 'falso':
        return <Badge variant="medium" tone="neutral" size="m">Falso</Badge>;
    }
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'alta':
        return <Badge variant="light" tone="neutral" size="m">Alta</Badge>;
      case 'media':
        return <Badge variant="light" tone="neutral" size="m">Média</Badge>;
      case 'baixa':
        return <Badge variant="light" tone="neutral" size="m">Baixa</Badge>;
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'intrusion':
        return 'Intrusão';
      case 'face':
        return 'Reconhecimento Facial';
      case 'crowd':
        return 'Aglomeração';
      case 'object':
        return 'Objeto Suspeito';
      case 'camera_offline':
        return 'Câmera Offline';
      default:
        return type;
    }
  };

  const isMobile = useIsMobile();

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-4 px-[0px] p-[0px]">
        {/* Report Button Section */}
        <div className="flex items-center justify-end">
          <Button 
            className="bg-[var(--primary-bg)] hover:bg-[var(--primary-bg-hover)] text-[var(--primary-text-on)]"
          >
            <Download className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>

        {/* Search & Filters Toolbar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Section */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--input-placeholder)]" />
                <Input
                  type="text"
                  placeholder="Buscar por palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-[rgb(255,255,255)]"
                />
              </div>

              {/* Filters Section */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Severity Filter */}
                <div className="flex-1 min-w-[220px]">
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as gravidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as gravidades</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="flex-1 min-w-[220px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="falso">Falso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className="flex-1 min-w-[220px]">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="intrusion">Intrusão</SelectItem>
                      <SelectItem value="face">Reconhecimento Facial</SelectItem>
                      <SelectItem value="crowd">Aglomeração</SelectItem>
                      <SelectItem value="object">Objeto Suspeito</SelectItem>
                      <SelectItem value="camera_offline">Câmera Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Camera Filter */}
                <div className="flex-1 min-w-[220px]">
                  <Select value={cameraFilter} onValueChange={setCameraFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as câmeras" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as câmeras</SelectItem>
                      {Array.from(new Set(alerts.map(a => a.camera))).map(camera => (
                        <SelectItem key={camera} value={camera}>{camera}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--neutral-text-muted)]">
            {loading ? 'Carregando...' : `${filteredAlerts.length} ${filteredAlerts.length === 1 ? 'alerta encontrado' : 'alertas encontrados'}`}
          </p>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[var(--neutral-text-muted)]">Carregando alertas...</p>
            </div>
          ) : filteredAlerts.map((alert) => {
            const Icon = alert.icon;
            const canConfirm = alert.status === 'novo';
            const canResolve = alert.status === 'confirmado';

            return (
              <div
                key={alert.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-[var(--neutral-border)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all relative overflow-hidden"
                style={{
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`
                }}
              >
                <div className={`flex ${isMobile ? 'flex-col' : 'items-start'} gap-4 p-4`}>
                  {!isMobile && (
                    /* Icon Column - Desktop only */
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[rgba(246,246,246,0)] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[var(--neutral-icon)]" />
                      </div>
                    </div>
                  )}

                  {/* Content Column */}
                  <div className="flex-1 space-y-2">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isMobile && <Icon className="w-4 h-4 text-[var(--neutral-icon)]" />}
                      <h3 className="text-[var(--neutral-text)]">
                        {alert.title}
                      </h3>
                      {getStatusBadge(alert.status)}
                      {getSeverityBadge(alert.severity)}
                    </div>

                    {/* Description */}
                    <p className="text-[13px] leading-5 text-[var(--neutral-text)]">
                      {alert.description}
                    </p>

                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--neutral-text-muted)]">
                      <div className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>{alert.camera}</span>
                      </div>
                      {alert.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{alert.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.date} às {alert.time}</span>
                      </div>
                      {alert.actionBy && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{alert.actionBy.name} ({alert.actionBy.role})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className={`shrink-0 flex ${isMobile ? 'w-full flex-col' : 'items-center'} gap-2`}>
                    {/* Ver Vídeo - sempre visível com outline */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVideo(alert.id)}
                      className={`h-[36px] rounded-[8px] ${isMobile ? 'w-full' : ''}`}
                    >
                      <Video className="w-4 h-4 mr-1.5" />
                      Ver Vídeo
                    </Button>
                    
                    {/* Confirmar - apenas quando status é 'novo' */}
                    {alert.status === 'novo' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirm(alert.id)}
                        className={`h-[36px] rounded-[8px] text-[14px] ${isMobile ? 'w-full' : ''}`}
                      >
                        Confirmar
                      </Button>
                    )}
                    
                    {/* Resolver - quando status é 'novo' ou 'confirmado' */}
                    {(alert.status === 'novo' || alert.status === 'confirmado') && (
                      <Button
                        size="sm"
                        onClick={() => handleResolve(alert.id)}
                        className={`bg-[rgb(40,151,38)] text-white hover:bg-[var(--green-alert-300)] hover:opacity-96 h-[36px] rounded-[8px] ${isMobile ? 'w-full' : ''}`}
                      >
                        Resolver
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && filteredAlerts.length === 0 && !isFirstAccess && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-[var(--neutral-text-muted)] mx-auto mb-3" />
              <p className="text-[var(--neutral-text)]">Nenhum alerta encontrado</p>
              <p className="text-sm text-[var(--neutral-text-muted)] mt-1">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          )}

          {!loading && isFirstAccess && alerts.length === 0 && (
            <EmptyState
              icon={AlertTriangle}
              title="Nenhum alerta ainda"
              description="Quando o sistema detectar eventos suspeitos ou anomalias nas câmeras, os alertas aparecerão aqui para que você possa analisar e tomar ações."
              actionLabel="Configurar Câmeras"
              onAction={() => {/* navigate to cameras */}}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedAlert && (
        <>
          <AlertClassifyModal
            open={classifyModalOpen}
            onOpenChange={setClassifyModalOpen}
            alertId={selectedAlert.id}
            alertTitle={selectedAlert.title}
            onConfirm={handleClassifyConfirm}
          />
          
          <VideoPreviewModal
            open={videoModalOpen}
            onOpenChange={setVideoModalOpen}
            alertId={selectedAlert.id}
            alertTitle={selectedAlert.title}
            cameraName={selectedAlert.camera}
            capturedAt={`${selectedAlert.date} às ${selectedAlert.time}`}
            status={selectedAlert.status}
            description={selectedAlert.description}
            streamUrl={selectedAlert.streamUrl}
          />
        </>
      )}
    </div>
  );
}