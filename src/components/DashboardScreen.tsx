import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { AlertTriangle, Camera, Clock, TrendingUp, ArrowRight, Ban, User, Users, Package, Plus, MapPin, UserPlus, Sparkles, RefreshCw } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts@2.15.2';
import { useIsMobile } from './ui/use-mobile';
import { useDashboardData } from '../hooks/useDashboardData';
import { ALERT_STATUS_LABELS } from '../types/dashboard';

const chartConfig = {
  alerts: {
    label: 'Alertas',
    color: 'var(--primary-bg)',
  },
};

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
  isFirstAccess?: boolean;
}

export function DashboardScreen({ onNavigate, isFirstAccess = false }: DashboardScreenProps) {
  const isMobile = useIsMobile();

  // Buscar dados reais do dashboard via hook
  const { stats, chartData, recentAlerts, isLoading, error, refresh, lastUpdated } = useDashboardData({
    refreshInterval: 30000, // Refresh a cada 30 segundos
    enabled: !isFirstAccess, // Não buscar dados se for primeiro acesso
  });

  // Empty State for First Access
  if (isFirstAccess) {
    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <Card className="border-[var(--primary-bg)] bg-gradient-to-r from-[var(--primary-bg)]/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-bg)] flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[var(--neutral-text)] mb-2">Bem-vindo ao SegVision!</h3>
                <p className="text-sm text-[var(--neutral-text-muted)] mb-4">
                  Sua assinatura foi ativada com sucesso. Configure seu sistema para começar a monitorar sua escola.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="light" tone="primary" size="s">Passo 1/3</Badge>
                  <span className="text-sm text-[var(--neutral-text-muted)]">
                    Configure seus espaços e câmeras
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1: Connect Camera */}
          <Card className="border-[var(--neutral-border)]">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-bg)] flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <Badge variant="heavy" tone="primary" size="s">Passo 1</Badge>
              </div>
              <CardTitle className="text-[var(--neutral-text)]">Conecte sua primeira câmera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--neutral-text-muted)]">
                Configure os espaços da escola e conecte suas câmeras para começar o monitoramento.
              </p>
              <ul className="space-y-2 text-sm text-[var(--neutral-text-muted)]">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Cadastre os ambientes da escola</span>
                </li>
                <li className="flex items-start gap-2">
                  <Camera className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Adicione câmeras via link RTSP</span>
                </li>
              </ul>
              <Button
                onClick={() => onNavigate?.('environments')}
                className="w-full bg-[var(--primary-bg)] text-white hover:opacity-96"
              >
                <Plus className="h-4 w-4 mr-2" />
                Começar Configuração
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Add Contacts */}
          <Card className="border-[var(--neutral-border)]">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[var(--neutral-border)] flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-[var(--neutral-text-muted)]" />
                </div>
                <Badge variant="light" tone="neutral" size="s">Passo 2</Badge>
              </div>
              <CardTitle className="text-[var(--neutral-text)]">Cadastre contatos de emergência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--neutral-text-muted)]">
                Adicione os contatos que devem ser notificados em caso de incidentes críticos.
              </p>
              <ul className="space-y-2 text-sm text-[var(--neutral-text-muted)]">
                <li>• Segurança da escola</li>
                <li>• Direção e coordenação</li>
                <li>• Polícia e bombeiros</li>
              </ul>
              <Button
                onClick={() => onNavigate?.('contacts')}
                variant="outline"
                className="w-full border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                disabled
              >
                Adicionar Contatos
              </Button>
              <p className="text-xs text-center text-[var(--neutral-text-muted)]">
                Configure as câmeras primeiro
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Explore AI */}
          <Card className="border-[var(--neutral-border)]">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[var(--neutral-border)] flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[var(--neutral-text-muted)]" />
                </div>
                <Badge variant="light" tone="neutral" size="s">Passo 3</Badge>
              </div>
              <CardTitle className="text-[var(--neutral-text)]">Explore os recursos de IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--neutral-text-muted)]">
                Conheça os recursos de inteligência artificial disponíveis no seu plano.
              </p>
              <ul className="space-y-2 text-sm text-[var(--neutral-text-muted)]">
                <li>• Detecção de objetos suspeitos</li>
                <li>• Reconhecimento de ações</li>
                <li>• Análises em tempo real</li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                disabled
              >
                Ver Recursos de IA
              </Button>
              <p className="text-xs text-center text-[var(--neutral-text-muted)]">
                Disponível após configuração
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Empty Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-[var(--neutral-border)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">Câmeras Ativas</p>
                  <p className="text-2xl text-[var(--neutral-text)] mt-1">0</p>
                  <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Aguardando configuração</p>
                </div>
                <Camera className="h-8 w-8 text-[var(--neutral-icon)]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[var(--neutral-border)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">Alertas 24h</p>
                  <p className="text-2xl text-[var(--neutral-text)] mt-1">0</p>
                  <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Nenhum alerta registrado</p>
                </div>
                <Clock className="h-8 w-8 text-[var(--neutral-icon)]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[var(--neutral-border)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">Incidentes Críticos</p>
                  <p className="text-2xl text-[var(--neutral-text)] mt-1">0</p>
                  <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Nenhum incidente</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[var(--neutral-icon)]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[var(--neutral-border)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">Taxa de Detecção</p>
                  <p className="text-2xl text-[var(--neutral-text)] mt-1">--</p>
                  <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Sem dados disponíveis</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[var(--neutral-icon)]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Converter stats object para array para manter compatibilidade com o map
  const statsArray = stats ? [
    stats.camerasAtivas,
    stats.alertas24h,
    stats.incidentesCriticos,
    stats.taxaDeteccao,
  ] : [];

  // Estado de erro
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-[var(--danger-bg)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-[var(--danger-bg)]" />
              <div className="flex-1">
                <h3 className="text-[var(--neutral-text)] mb-1">Erro ao carregar dados</h3>
                <p className="text-sm text-[var(--neutral-text-muted)]">{error.message}</p>
              </div>
              <Button onClick={refresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com última atualização e botão de refresh */}
      {lastUpdated && !isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--neutral-text-muted)]">
            Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
          </p>
          <Button onClick={refresh} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-3 w-3" />
            Atualizar
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border border-[var(--neutral-border)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsArray.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border border-[var(--neutral-border)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--neutral-text-muted)]">{stat.title}</p>
                      <p className="text-2xl text-[var(--neutral-text)] mt-1">{stat.value}</p>
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: stat.changeType === 'positive'
                            ? 'var(--green-alert-400)'
                            : stat.changeType === 'negative'
                              ? 'var(--red-alert-300)'
                              : 'var(--neutral-text-muted)'
                        }}
                      >
                        {stat.change}
                      </p>
                    </div>
                    <Icon className="h-8 w-8 text-[var(--neutral-icon)]" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolution Chart */}
        <Card className="border border-[var(--neutral-border)] flex flex-col">
          <CardContent className="pt-6 px-6 pb-0 flex-1 flex flex-col bg-[var(--card)] rounded-[8px]">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-4">
                <div className="flex items-start justify-between mb-4">
                  <Skeleton className="h-5 w-48" />
                  <div className="text-right space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <>
                {/* Header com título e destaque */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-base text-[var(--neutral-text)]">Evolução dos Alertas (24h)</CardTitle>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--neutral-text-muted)]">Pico Máximo</p>
                    <p className="text-[var(--neutral-text)] mt-0.5">
                      {Math.max(...chartData.map(d => d.alerts))} Alertas
                    </p>
                    <p className="text-xs text-[var(--neutral-text-muted)]">
                      às {chartData.find(d => d.alerts === Math.max(...chartData.map(d => d.alerts)))?.time || '--:--'}
                    </p>
                  </div>
                </div>

                {/* Gráfico posicionado no bottom */}
                <div className="flex-1 w-full min-h-0 -mx-6 px-6 pb-6 mt-auto">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" vertical={false} />
                      <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--neutral-text-muted)', fontSize: 11 }}
                        height={30}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--neutral-text-muted)', fontSize: 11 }}
                        width={30}
                        domain={[0, 'auto']}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ stroke: 'var(--neutral-border)', strokeWidth: 1 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="alerts"
                        stroke="var(--primary-bg)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--primary-bg)', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, fill: 'var(--primary-bg)' }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="border border-[var(--neutral-border)]">
          <CardHeader>
            <CardTitle className="text-[var(--neutral-text)]">Últimos Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-[var(--analytics-list-bg)] rounded-md">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentAlerts.length === 0 ? (
              // Empty state
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-[var(--neutral-icon)] mx-auto mb-3" />
                <p className="text-sm text-[var(--neutral-text-muted)]">Nenhum alerta registrado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((alert) => {
                  const AlertIcon = alert.icon;
                  return (
                    <div key={alert.id} className="flex items-center gap-4 p-3 bg-[var(--analytics-list-bg)] rounded-md">
                      <AlertIcon className="h-5 w-5 text-[var(--neutral-icon)]" />
                      <div className="flex-1">
                        <p className="text-sm text-[var(--neutral-text)]">{alert.event}</p>
                        <p className="text-xs text-[var(--neutral-text-muted)]">{alert.camera}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--neutral-text)]">{alert.time}</p>
                        <Badge
                          variant={alert.status === 'novo' ? 'heavy' : 'medium'}
                          tone={
                            alert.status === 'novo' ? 'danger' :
                            alert.status === 'confirmado' ? 'caution' :
                            alert.status === 'resolvido' ? 'success' :
                            'neutral'
                          }
                          size="s"
                        >
                          {ALERT_STATUS_LABELS[alert.status]}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {onNavigate && !isLoading && (
              <Button
                variant="outline"
                className="w-full mt-4 border-[var(--primary-bg)] text-[var(--primary-bg)] hover:bg-[var(--primary-bg)] hover:text-white transition-colors"
                onClick={() => onNavigate('alerts')}
              >
                Ver Todos os Alertas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2 border-[var(--neutral-border)] dark:border-[var(--white-100)] dark:hover:border-[var(--blue-primary-200)] dark:active:border-[var(--blue-primary-200)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              onClick={() => onNavigate?.('cameras')}
            >
              <Camera className="h-6 w-6" />
              <span>Gerenciar Câmeras</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2 border-[var(--neutral-border)] dark:border-[var(--white-100)] dark:hover:border-[var(--blue-primary-200)] dark:active:border-[var(--blue-primary-200)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              onClick={() => onNavigate?.('alerts')}
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Ver Alertas</span>
            </Button>
            {!isMobile && (
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2 border-[var(--neutral-border)] dark:border-[var(--white-100)] dark:hover:border-[var(--blue-primary-200)] dark:active:border-[var(--blue-primary-200)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] bg-[rgba(255,255,255,0)]"
                onClick={() => onNavigate?.('analytics')}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Análises</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}