import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  BarChart3,
  Download,
  MoreVertical,
  Lock,
  Search,
  FileText,
  TrendingUp,
  Building2,
  Calendar,
  Filter,
  X
} from 'lucide-react';
import { Activity, AlertTriangle, Clock, CheckCircle, Target, Zap, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '../ui/use-mobile';
import { EmptyState } from '../EmptyState';
import { useMetricsData, type MetricsFilters } from '../../hooks/useMetricsData';
import { useAlertLogs, type AlertLogFilters, type AlertLog } from '../../hooks/useAlertLogs';
import { useAIMetrics } from '../../hooks/useAIMetrics';
import { supabase } from '../../lib/supabase';

// AlertLog interface e types agora vêm do hook useAlertLogs
// AI Metrics vêm do hook useAIMetrics

interface AdminReportsScreenProps {
  isFirstAccess?: boolean;
}

export function AdminReportsScreen({ isFirstAccess = false }: AdminReportsScreenProps) {
  const [period, setPeriod] = useState('7days');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<AlertLog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('metrics');

  // Mapear period para formato do hook
  const metricsPeriodo = useMemo<MetricsFilters['periodo']>(() => {
    switch (period) {
      case '7days': return '7d';
      case '30days': return '30d';
      case 'month': return 'mes';
      case 'custom': return 'personalizado';
      default: return '7d';
    }
  }, [period]);

  // Filtros para métricas
  const metricsFilters: MetricsFilters = useMemo(() => ({
    periodo: metricsPeriodo,
    dataInicio: metricsPeriodo === 'personalizado' ? customStartDate : undefined,
    dataFim: metricsPeriodo === 'personalizado' ? customEndDate : undefined,
    escola: schoolFilter,
    tipo: typeFilter,
    gravidade: severityFilter,
  }), [metricsPeriodo, customStartDate, customEndDate, schoolFilter, typeFilter, severityFilter]);

  // Filtros para log de alertas
  const alertLogFilters: AlertLogFilters = useMemo(() => ({
    escola: schoolFilter,
    tipo: typeFilter,
    gravidade: severityFilter,
    status: statusFilter,
  }), [schoolFilter, typeFilter, severityFilter, statusFilter]);

  // Carrega escolas reais para popular o filtro
  useEffect(() => {
    const loadSchools = async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Erro ao carregar escolas:', error);
        return;
      }

      setSchools(data || []);
    };

    loadSchools();
  }, []);

  // Buscar dados via hooks
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useMetricsData(metricsFilters);
  const { data: alertLogs, isLoading: alertLogsLoading, error: alertLogsError, total: alertLogsTotal } = useAlertLogs(alertLogFilters);
  const { data: aiMetrics, isLoading: aiMetricsLoading, error: aiMetricsError } = useAIMetrics();

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    const config = {
      high: { variant: 'medium' as const, tone: 'danger' as const, label: 'Alta' },
      medium: { variant: 'medium' as const, tone: 'warning' as const, label: 'Média' },
      low: { variant: 'medium' as const, tone: 'info' as const, label: 'Baixa' }
    };
    const { variant, tone, label } = config[severity];
    return <Badge variant={variant} tone={tone} size="s">{label}</Badge>;
  };

  const getStatusBadge = (status: 'active' | 'analyzing' | 'resolved') => {
    const config = {
      active: { variant: 'medium' as const, tone: 'info' as const, label: 'Ativo' },
      analyzing: { variant: 'medium' as const, tone: 'caution' as const, label: 'Em análise' },
      resolved: { variant: 'medium' as const, tone: 'success' as const, label: 'Resolvido' }
    };
    const { variant, tone, label } = config[status];
    return <Badge variant={variant} tone={tone} size="s">{label}</Badge>;
  };

  // Função auxiliar para criar e baixar CSV
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = (tabName: string) => {
    try {
      let csvContent = '';
      const timestamp = new Date().toISOString().split('T')[0];

      if (tabName === 'Métricas' && metricsData) {
        // Export métricas - alertas por dia
        csvContent = 'Dia,Alertas\n';
        metricsData.alertasPorDia.forEach(item => {
          csvContent += `${item.day},${item.alerts}\n`;
        });
        csvContent += '\n';

        // Adicionar distribuição por gravidade
        csvContent += 'Gravidade,Quantidade\n';
        csvContent += `Alta,${metricsData.porGravidade.alta}\n`;
        csvContent += `Média,${metricsData.porGravidade.media}\n`;
        csvContent += `Baixa,${metricsData.porGravidade.baixa}\n`;
        csvContent += '\n';

        // Adicionar KPIs
        csvContent += 'KPI,Valor\n';
        csvContent += `Total de Alertas,${metricsData.totalAlertas}\n`;
        csvContent += `Pico Diário,${metricsData.picoDiario}\n`;
        csvContent += `Média por Dia,${metricsData.mediaPorDia}\n`;

        downloadCSV(csvContent, `metricas-alertas-${timestamp}.csv`);
        toast.success('CSV de métricas exportado com sucesso!');
      } else if (tabName === 'Log de Alertas' && filteredAlerts.length > 0) {
        // Export log de alertas
        csvContent = 'Data/Hora,Escola,Tipo,Gravidade,Status,SLA (min),Câmera,Observações\n';
        filteredAlerts.forEach(alert => {
          const timestamp = alert.timestamp.toLocaleString('pt-BR');
          const severity = alert.severity === 'high' ? 'Alta' : alert.severity === 'medium' ? 'Média' : 'Baixa';
          const status = alert.status === 'active' ? 'Ativo' : alert.status === 'analyzing' ? 'Em análise' : 'Resolvido';
          const sla = alert.slaMinutes || 'N/A';
          const obs = (alert.observations || '').replace(/"/g, '""'); // Escape quotes
          csvContent += `"${timestamp}","${alert.school}","${alert.type}","${severity}","${status}","${sla}","${alert.camera}","${obs}"\n`;
        });

        downloadCSV(csvContent, `log-alertas-${timestamp}.csv`);
        toast.success(`${filteredAlerts.length} alertas exportados com sucesso!`);
      } else if (tabName === 'Confiabilidade da IA') {
        // Para IA, ainda é mock - mas mantém funcionalidade
        toast.info('Exportação de dados de IA em desenvolvimento.');
      } else {
        toast.error('Nenhum dado disponível para exportar.');
      }
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar CSV. Tente novamente.');
    }
  };

  const handleAlertClick = (alert: AlertLog) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  // Dados já vêm filtrados dos hooks
  const filteredAlerts = alertLogs || [];

  // KPIs calculados a partir dos dados reais
  const totalAlerts = metricsData?.totalAlertas || 0;
  const peakDay = metricsData?.picoDiario || 0;
  const highPercent = metricsData?.porGravidade.alta || 0;
  const mediumPercent = metricsData?.porGravidade.media || 0;
  const lowPercent = metricsData?.porGravidade.baixa || 0;
  const avgPerDay = metricsData?.mediaPorDia || 0;

  // Show empty state for first access
  if (isFirstAccess) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={BarChart3}
          title="Nenhum relatório disponível"
          description="Relatórios e auditorias serão gerados automaticamente quando as escolas começarem a usar o sistema e gerar alertas."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs - Desktop Only */}
      {!isMobile && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-[var(--neutral-subtle)] border-[var(--neutral-border)]">
              <TabsTrigger value="metrics" className="data-[state=active]:bg-[var(--neutral-bg)]">
                Métricas
              </TabsTrigger>
              <TabsTrigger value="log" className="data-[state=active]:bg-[var(--neutral-bg)]">
                Log de Alertas
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-[var(--neutral-bg)]">
                Confiabilidade da IA
              </TabsTrigger>
            </TabsList>
          </div>

        {/* Tab: Métricas */}
        <TabsContent value="metrics" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="7days">Últimos 7 dias</SelectItem>
                      <SelectItem value="30days">Últimos 30 dias</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {period === 'custom' && (
                  <>
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[var(--neutral-text-muted)] text-xs mb-1 block">
                        Data Início
                      </label>
                      <Input
                        type="date"
                        placeholder="Data Início"
                        className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                        value={customStartDate ? customStartDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setCustomStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[var(--neutral-text-muted)] text-xs mb-1 block">
                        Data Fim
                      </label>
                      <Input
                        type="date"
                        placeholder="Data Fim"
                        className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                        value={customEndDate ? customEndDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setCustomEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </div>
                  </>
                )}

                <div className="flex-1 min-w-[200px]">
                  <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Escola" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todas as escolas</SelectItem>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="intrusion">Intrusão</SelectItem>
                      <SelectItem value="face">Reconhecimento Facial</SelectItem>
                      <SelectItem value="crowd">Aglomeração</SelectItem>
                      <SelectItem value="camera_offline">Câmera Offline</SelectItem>
                      <SelectItem value="object">Objetos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Gravidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="gap-2 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                  onClick={() => handleExportCSV('Métricas')}
                >
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--primary-bg)] bg-opacity-10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-[var(--primary-bg)]" />
                  </div>
                  <div>
                    <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Total de Alertas</p>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '24px', fontWeight: 600 }}>{totalAlerts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--warning-bg)] bg-opacity-10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-[var(--warning-bg)]" />
                  </div>
                  <div>
                    <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Pico Diário</p>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '24px', fontWeight: 600 }}>{peakDay}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-[var(--neutral-text-muted)] mb-2" style={{ fontSize: '12px' }}>Por Gravidade</p>
                  <div className="flex gap-3">
                    <div>
                      <p className="text-[var(--danger-bg)]" style={{ fontSize: '16px', fontWeight: 600 }}>{highPercent}%</p>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '11px' }}>Alta</p>
                    </div>
                    <div>
                      <p className="text-[var(--warning-bg)]" style={{ fontSize: '16px', fontWeight: 600 }}>{mediumPercent}%</p>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '11px' }}>Média</p>
                    </div>
                    <div>
                      <p className="text-[var(--info-bg)]" style={{ fontSize: '16px', fontWeight: 600 }}>{lowPercent}%</p>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '11px' }}>Baixa</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--success-bg)] bg-opacity-10 rounded-lg">
                    <Activity className="h-5 w-5 text-[var(--success-bg)]" />
                  </div>
                  <div>
                    <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Média por Dia</p>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '24px', fontWeight: 600 }}>
                      {avgPerDay}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alertas por Dia</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[300px]">
                  {metricsLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-[var(--neutral-text-muted)]">Carregando...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                      <BarChart data={metricsData?.alertasPorDia || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
                        <XAxis
                          dataKey="day"
                          stroke="var(--neutral-text-muted)"
                          style={{ fontSize: isMobile ? '10px' : '12px' }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis
                          stroke="var(--neutral-text-muted)"
                          style={{ fontSize: isMobile ? '10px' : '12px' }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--neutral-border)',
                            borderRadius: '8px',
                            fontSize: isMobile ? '12px' : '14px'
                          }}
                        />
                        <Bar dataKey="alerts" fill="var(--primary-bg)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gravidade</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[280px]">
                  {metricsLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-[var(--neutral-text-muted)]">Carregando...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                      <PieChart>
                        <Pie
                          data={metricsData?.distribuicaoGravidade || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={isMobile ? 70 : 80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(metricsData?.distribuicaoGravidade || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--neutral-border)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            fontSize: isMobile ? '12px' : '14px'
                          }}
                          itemStyle={{
                            color: 'var(--neutral-text)'
                          }}
                        />
                        {isMobile && (
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ fontSize: '11px' }}
                          />
                        )}
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Log de Alertas */}
        <TabsContent value="log" className="space-y-6">
          {/* Banner LGPD */}
          <Alert className="border-[var(--info-bg)] bg-[var(--info-bg)] bg-opacity-10">
            <Lock className="h-4 w-4 text-[var(--info-bg)]" />
            <AlertDescription className="text-[var(--neutral-text)]">
              Admin vê apenas metadados. Provas (vídeo/imagem) são vedadas por LGPD.
            </AlertDescription>
          </Alert>

          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[180px]">
                  <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Escola" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todas as escolas</SelectItem>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="intrusion">Intrusão</SelectItem>
                      <SelectItem value="face">Reconhecimento Facial</SelectItem>
                      <SelectItem value="crowd">Aglomeração</SelectItem>
                      <SelectItem value="camera_offline">Câmera Offline</SelectItem>
                      <SelectItem value="object">Objetos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Gravidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="novo">Ativo</SelectItem>
                      <SelectItem value="confirmado">Em análise</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="falso">Falso Positivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="gap-2 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] w-full sm:w-auto"
                  onClick={() => handleExportCSV('Log de Alertas')}
                >
                  <Download className="h-4 w-4" />
                  {isMobile ? 'Exportar' : 'Exportar CSV'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Log - Desktop */}
          {!isMobile && (
            <Card>
              <CardHeader>
                <CardTitle>Log de Alertas ({alertLogsTotal})</CardTitle>
              </CardHeader>
              <CardContent>
                {alertLogsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-[var(--neutral-text-muted)]">Carregando alertas...</p>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-[var(--neutral-text-muted)]">Nenhum alerta encontrado com os filtros selecionados.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--neutral-border)]">
                          <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Data/Hora</th>
                          <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Escola</th>
                          <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Tipo de Evento</th>
                          <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Gravidade</th>
                          <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Status</th>
                          <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">SLA (min)</th>
                          <th className="text-right py-3 px-4 text-[var(--neutral-text-muted)]">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAlerts.map((alert) => (
                        <tr
                          key={alert.id}
                          className="border-b border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)] cursor-pointer"
                          onClick={() => handleAlertClick(alert)}
                        >
                          <td className="py-3 px-4 text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>
                            {formatDistanceToNow(alert.timestamp, { locale: ptBR, addSuffix: true })}
                          </td>
                          <td className="py-3 px-4 text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>
                            {alert.school}
                          </td>
                          <td className="py-3 px-4 text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>
                            {alert.type}
                          </td>
                          <td className="py-3 px-4">
                            {getSeverityBadge(alert.severity)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(alert.status)}
                          </td>
                          <td className="py-3 px-4 text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>
                            {alert.slaMinutes ? `${alert.slaMinutes} min` : '—'}
                          </td>
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-[var(--neutral-icon)] hover:bg-[var(--neutral-subtle)]">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[var(--card)] border-[var(--neutral-border)]">
                                <DropdownMenuItem 
                                  className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                  onClick={() => handleAlertClick(alert)}
                                >
                                  Ver Detalhes
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
          )}

          {/* Cards de Log - Mobile */}
          {isMobile && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[var(--neutral-text)]">Log de Alertas ({alertLogsTotal})</h4>
              </div>

              {alertLogsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-[var(--neutral-text-muted)]">Carregando alertas...</p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-[var(--neutral-text-muted)]">Nenhum alerta encontrado.</p>
                </div>
              ) : (
                <>
                  {filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className="cursor-pointer hover:border-[var(--primary-bg)] transition-colors"
                  onClick={() => handleAlertClick(alert)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-3">
                      {/* Header com Escola e Data */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-[var(--neutral-text)]" style={{ fontSize: '15px', fontWeight: 600 }}>
                            {alert.school}
                          </p>
                          <p className="text-[var(--neutral-text-muted)] mt-0.5" style={{ fontSize: '12px' }}>
                            {formatDistanceToNow(alert.timestamp, { locale: ptBR, addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {getSeverityBadge(alert.severity)}
                        </div>
                      </div>

                      {/* Tipo e Câmera */}
                      <div>
                        <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px', fontWeight: 600 }}>
                          {alert.type}
                        </p>
                        <p className="text-[var(--neutral-text-muted)] mt-0.5" style={{ fontSize: '13px' }}>
                          {alert.camera}
                        </p>
                      </div>

                      {/* Footer com Status e SLA */}
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--neutral-border)]">
                        <div>
                          {getStatusBadge(alert.status)}
                        </div>
                        {alert.slaMinutes && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[var(--neutral-icon)]" />
                            <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>
                              {alert.slaMinutes} min
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </TabsContent>

        {/* Tab: Confiabilidade da IA */}
        <TabsContent value="ai" className="space-y-6">
          {/* Botão Exportar */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="gap-2 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              onClick={() => handleExportCSV('Confiabilidade da IA')}
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          {/* KPIs de Performance da IA */}
          {aiMetricsLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[var(--neutral-text-muted)]">Carregando métricas de IA...</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--success-bg)] bg-opacity-10 rounded-lg">
                      <Target className="h-5 w-5 text-[var(--success-bg)]" />
                    </div>
                    <div>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Precisão Geral</p>
                      <p className="text-[var(--neutral-text)]" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {aiMetrics?.overallPrecision.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--warning-bg)] bg-opacity-10 rounded-lg">
                      <ThumbsDown className="h-5 w-5 text-[var(--warning-bg)]" />
                    </div>
                    <div>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Falsos Positivos</p>
                      <p className="text-[var(--neutral-text)]" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {aiMetrics?.overallFalsePositiveRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--info-bg)] bg-opacity-10 rounded-lg">
                      <Clock className="h-5 w-5 text-[var(--info-bg)]" />
                    </div>
                    <div>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Tempo Médio</p>
                      <p className="text-[var(--neutral-text)]" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {((aiMetrics?.avgDetectionTime || 0) / 1000).toFixed(1)}s
                      </p>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '11px' }}>Detecção</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--primary-bg)] bg-opacity-10 rounded-lg">
                      <ThumbsUp className="h-5 w-5 text-[var(--primary-bg)]" />
                    </div>
                    <div>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Confiança Alta</p>
                      <p className="text-[var(--neutral-text)]" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {aiMetrics?.highConfidencePercentage}%
                      </p>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '11px' }}>{'>'} 90% confiança</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Gráficos de Performance */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Precisão</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[300px]">
                  {aiMetricsLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-[var(--neutral-text-muted)]">Carregando...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                      <LineChart data={aiMetrics?.precisionTrend || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
                        <XAxis
                          dataKey="month"
                          stroke="var(--neutral-text-muted)"
                          style={{ fontSize: isMobile ? '10px' : '12px' }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis
                          stroke="var(--neutral-text-muted)"
                          style={{ fontSize: isMobile ? '10px' : '12px' }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          domain={[85, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--neutral-border)',
                            borderRadius: '8px',
                            fontSize: isMobile ? '12px' : '14px'
                          }}
                          formatter={(value: any) => [`${value}%`, 'Precisão']}
                        />
                        <Line
                          type="monotone"
                          dataKey="precision"
                          stroke="var(--success-bg)"
                          strokeWidth={isMobile ? 2 : 2}
                          dot={{ fill: 'var(--success-bg)', r: isMobile ? 3 : 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Confiança</CardTitle>
                <CardDescription>Nível de confiança por detecção</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[300px]">
                  {aiMetricsLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-[var(--neutral-text-muted)]">Carregando...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                      <BarChart data={aiMetrics?.confidenceDistribution || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
                        <XAxis
                          dataKey="range"
                          stroke="var(--neutral-text-muted)"
                          style={{ fontSize: isMobile ? '10px' : '12px' }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis
                          stroke="var(--neutral-text-muted)"
                          style={{ fontSize: isMobile ? '10px' : '12px' }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--neutral-border)',
                            borderRadius: '8px',
                            fontSize: isMobile ? '12px' : '14px'
                          }}
                          formatter={(value: any) => [value, 'Detecções']}
                        />
                        <Bar dataKey="count" fill="var(--primary-bg)" radius={[4, 4, 0, 0]}>
                          {(aiMetrics?.confidenceDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Precisão por Tipo de Evento */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Tipo de Evento</CardTitle>
              <CardDescription>Métricas detalhadas de cada tipo de detecção</CardDescription>
            </CardHeader>
            <CardContent>
              {aiMetricsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-[var(--neutral-text-muted)]">Carregando...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(aiMetrics?.eventTypeAccuracy || []).map((event, index) => (
                    <div key={index} className="p-4 border border-[var(--neutral-border)] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                          <h4 className="text-[var(--neutral-text)]">{event.type}</h4>
                        </div>
                        <Badge variant="medium" tone="success" size="s">
                          {event.accuracy}% precisão
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Taxa de Acerto</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-[var(--neutral-border)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#289726]"
                                style={{ width: `${event.accuracy}%` }}
                              />
                            </div>
                            <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px', fontWeight: 600 }}>
                              {event.accuracy}%
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Falsos Positivos</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-[var(--neutral-border)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--warning-bg)]"
                                style={{ width: `${event.falsePositives}%` }}
                              />
                            </div>
                            <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px', fontWeight: 600 }}>
                              {event.falsePositives}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recomendações e Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights e Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[var(--success-bg)] bg-opacity-10 rounded-lg border border-[var(--success-bg)]">
                  <ThumbsUp className="h-5 w-5 text-[var(--success-bg)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px', fontWeight: 600 }}>
                      Performance Excelente em Intrusão
                    </p>
                    <p className="text-[var(--neutral-text-muted)] mt-1" style={{ fontSize: '13px' }}>
                      O modelo de detecção de intrusão atingiu 97.5% de precisão, superando a meta de 95%.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--warning-bg)] bg-opacity-10 rounded-lg border border-[var(--warning-bg)]">
                  <AlertTriangle className="h-5 w-5 text-[var(--warning-bg)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px', fontWeight: 600 }}>
                      Oportunidade de Melhoria em Aglomeração
                    </p>
                    <p className="text-[var(--neutral-text-muted)] mt-1" style={{ fontSize: '13px' }}>
                      Detecção de aglomeração apresenta 7.7% de falsos positivos. Recomenda-se retreinamento com mais dados.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--info-bg)] bg-opacity-10 rounded-lg border border-[var(--info-bg)]">
                  <Zap className="h-5 w-5 text-[var(--info-bg)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px', fontWeight: 600 }}>
                      Melhoria Contínua
                    </p>
                    <p className="text-[var(--neutral-text-muted)] mt-1" style={{ fontSize: '13px' }}>
                      A precisão geral aumentou 0.9% no último mês graças ao feedback dos operadores das escolas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}

      {/* Mobile - Apenas Log de Alertas */}
      {isMobile && (
        <div className="space-y-6">
          {/* Banner LGPD */}
          <Alert className="border-[var(--info-bg)] bg-[var(--info-bg)] bg-opacity-10">
            <Lock className="h-4 w-4 text-[var(--info-bg)]" />
            <AlertDescription className="text-[var(--neutral-text)]">
              Admin vê apenas metadados. Provas (vídeo/imagem) são vedadas por LGPD.
            </AlertDescription>
          </Alert>

          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[180px]">
                  <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Escola" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todas as escolas</SelectItem>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="intrusion">Intrusão</SelectItem>
                      <SelectItem value="face">Reconhecimento Facial</SelectItem>
                      <SelectItem value="crowd">Aglomeração</SelectItem>
                      <SelectItem value="camera_offline">Câmera Offline</SelectItem>
                      <SelectItem value="object">Objetos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Gravidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="analyzing">Em análise</SelectItem>
                      <SelectItem value="resolved">Resolvido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="gap-2 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] w-full sm:w-auto"
                  onClick={() => handleExportCSV('Log de Alertas')}
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards de Log */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[var(--neutral-text)]">Log de Alertas ({alertLogsTotal})</h4>
            </div>

            {alertLogsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-[var(--neutral-text-muted)]">Carregando alertas...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-[var(--neutral-text-muted)]">Nenhum alerta encontrado.</p>
              </div>
            ) : (
              <>
                {filteredAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={isMobile ? "border-[var(--neutral-border)]" : "cursor-pointer hover:border-[var(--primary-bg)] transition-colors"}
                    onClick={!isMobile ? () => handleAlertClick(alert) : undefined}
                  >
                <CardContent className="pt-4 pb-4">
                  <div className="space-y-3">
                    {/* Header com Escola e Data */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-[var(--neutral-text)]" style={{ fontSize: '15px', fontWeight: 600 }}>
                          {alert.school}
                        </p>
                        <p className="text-[var(--neutral-text-muted)] mt-0.5" style={{ fontSize: '12px' }}>
                          {formatDistanceToNow(alert.timestamp, { locale: ptBR, addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getSeverityBadge(alert.severity)}
                      </div>
                    </div>

                    {/* Tipo e Câmera */}
                    <div>
                      <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px', fontWeight: 600 }}>
                        {alert.type}
                      </p>
                      <p className="text-[var(--neutral-text-muted)] mt-0.5" style={{ fontSize: '13px' }}>
                        {alert.camera}
                      </p>
                    </div>

                    {/* Footer com Status e SLA */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--neutral-border)]">
                      <div>
                        {getStatusBadge(alert.status)}
                      </div>
                      {alert.slaMinutes && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[var(--neutral-icon)]" />
                          <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>
                            {alert.slaMinutes} min
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botão Ver Detalhes - Mobile Only */}
                    {isMobile && (
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAlertClick(alert);
                          }}
                          className="w-full border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Dialog para Detalhes do Alerta (Somente Leitura - LGPD) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[var(--neutral-text)]">
              {selectedAlert?.type} — {selectedAlert?.school}
            </DialogTitle>
            <DialogDescription className="text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>
              {selectedAlert && formatDistanceToNow(selectedAlert.timestamp, { locale: ptBR, addSuffix: true })} • 
              Gravidade: {selectedAlert?.severity === 'high' ? 'Alta' : selectedAlert?.severity === 'medium' ? 'Média' : 'Baixa'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Metadados */}
            <div>
              <h4 className="text-[var(--neutral-text)] mb-3">Metadados</h4>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Tipo de Evento</p>
                  <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>{selectedAlert?.type}</p>
                </div>
                <div>
                  <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Escola</p>
                  <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>{selectedAlert?.school}</p>
                </div>
                <div>
                  <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Câmera</p>
                  <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>{selectedAlert?.camera}</p>
                </div>
                <div>
                  <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Gravidade</p>
                  <div className="mt-1">
                    {selectedAlert && getSeverityBadge(selectedAlert.severity)}
                  </div>
                </div>
                <div>
                  <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>Status</p>
                  <div className="mt-1">
                    {selectedAlert && getStatusBadge(selectedAlert.status)}
                  </div>
                </div>
                {selectedAlert?.slaMinutes && (
                  <div>
                    <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>SLA</p>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>{selectedAlert.slaMinutes} minutos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Linha do Tempo */}
            <div>
              <h4 className="text-[var(--neutral-text)] mb-3">Linha do Tempo</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[var(--danger-bg)] bg-opacity-10 rounded-full mt-0.5">
                    <AlertTriangle className="h-3 w-3 text-[var(--danger-bg)]" />
                  </div>
                  <div>
                    <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>Detectado</p>
                    <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>
                      {selectedAlert && formatDistanceToNow(selectedAlert.timeline.detected, { locale: ptBR, addSuffix: true })}
                    </p>
                  </div>
                </div>

                {selectedAlert?.timeline.analyzing && (
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-[var(--caution-bg)] bg-opacity-10 rounded-full mt-0.5">
                      <Clock className="h-3 w-3 text-[var(--caution-bg)]" />
                    </div>
                    <div>
                      <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>Em análise</p>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>
                        {formatDistanceToNow(selectedAlert.timeline.analyzing.date, { locale: ptBR, addSuffix: true })} • 
                        {selectedAlert.timeline.analyzing.role}
                      </p>
                    </div>
                  </div>
                )}

                {selectedAlert?.timeline.resolved && (
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-[var(--success-bg)] bg-opacity-10 rounded-full mt-0.5">
                      <CheckCircle className="h-3 w-3 text-[var(--success-bg)]" />
                    </div>
                    <div>
                      <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>Resolvido</p>
                      <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '12px' }}>
                        {formatDistanceToNow(selectedAlert.timeline.resolved.date, { locale: ptBR, addSuffix: true })} • 
                        {selectedAlert.timeline.resolved.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Observações */}
            {selectedAlert?.observations && (
              <div>
                <h4 className="text-[var(--neutral-text)] mb-3">Observações</h4>
                <div className="p-4 bg-[var(--neutral-subtle)] rounded-lg border border-[var(--neutral-border)]">
                  <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>
                    {selectedAlert.observations}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--neutral-border)] flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
