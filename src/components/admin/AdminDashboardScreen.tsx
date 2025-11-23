import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building2, DollarSign, Users, TrendingUp, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts@2.15.2';
import { useIsMobile } from '../ui/use-mobile';
import { EmptyState } from '../EmptyState';
import { useAdminDashboardData } from '../../hooks/useAdminDashboardData';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

const chartConfig = {
  revenue: { label: 'Receita', color: 'var(--primary-bg)' },
  schools: { label: 'Escolas', color: 'var(--primary-bg)' },
};

interface AdminDashboardScreenProps {
  isFirstAccess?: boolean;
}

export function AdminDashboardScreen({ isFirstAccess = false }: AdminDashboardScreenProps) {
  const {
    stats,
    revenueData,
    schoolsData,
    recentActivity,
    systemHealth,
    isLoading,
    error,
    refresh,
    lastUpdated
  } = useAdminDashboardData({
    refreshInterval: 30000,
    enabled: !isFirstAccess,
  });

  const isMobile = useIsMobile();

  // Converter stats para array para compatibilidade com o código existente
  const statsArray = stats ? [
    stats.escolasAtivas,
    stats.receitaMensal,
    stats.usuariosTotais,
    stats.taxaCrescimento,
  ] : [];

  // Show empty state for first access
  if (isFirstAccess) {
    return (
      <EmptyState
        icon={Building2}
        title="Bem-vindo ao Painel de Administração"
        description="Quando houver escolas cadastradas, você verá aqui estatísticas completas sobre receita, crescimento e saúde do sistema."
      />
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-[var(--danger-border)] bg-[var(--danger-bg)]">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-[var(--danger-text)]" />
            <div>
              <h3 className="font-semibold text-[var(--danger-text)] mb-1">Erro ao carregar dados</h3>
              <p className="text-sm text-[var(--danger-text-muted)]">{error.message}</p>
            </div>
            <Button onClick={refresh} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com última atualização e refresh */}
      <div className="flex items-center justify-between">
        <div>
          {lastUpdated && (
            <p className="text-xs text-[var(--neutral-text-muted)]">
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-[var(--neutral-border)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          statsArray.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-[var(--neutral-border)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-[var(--neutral-text-muted)]">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-[var(--neutral-icon)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-[var(--neutral-text)]">{stat.value}</div>
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
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* Receita */}
        <Card className="border-[var(--neutral-border)]">
          <CardHeader>
            <CardTitle className="text-[var(--neutral-text)]">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : isMobile ? (
              // Mobile: Lista compacta com indicadores de crescimento
              <div className="w-full space-y-3">
                {revenueData.map((item, index) => {
                  const previousRevenue = index > 0 ? revenueData[index - 1].revenue : item.revenue;
                  const growth = ((item.revenue - previousRevenue) / previousRevenue) * 100;
                  const isGrowth = item.revenue > previousRevenue;
                  const isHighest = item.revenue === Math.max(...revenueData.map(d => d.revenue));
                  
                  return (
                    <div 
                      key={item.month} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isHighest 
                          ? 'bg-[var(--primary-bg)] bg-opacity-10 border border-[var(--primary-bg)]' 
                          : 'bg-[var(--neutral-subtle)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isHighest 
                            ? 'bg-[var(--primary-bg)] text-white' 
                            : 'bg-[var(--analytics-list-bg)] text-[var(--neutral-text)]'
                        }`}>
                          <span className="text-sm">{item.month}</span>
                        </div>
                        <div>
                          <p className={`text-sm ${isHighest ? 'text-[var(--neutral-text)]' : 'text-[var(--neutral-text)]'}`}>
                            R$ {(item.revenue / 1000).toFixed(0)}k
                          </p>
                          {index > 0 && (
                            <p className={`text-xs mt-0.5 ${
                              isGrowth 
                                ? 'text-[var(--green-alert-300)]' 
                                : 'text-[var(--red-alert-300)]'
                            }`}>
                              {isGrowth ? '+' : ''}{growth.toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <TrendingUp 
                            className={`h-4 w-4 ${
                              isGrowth 
                                ? 'text-[var(--green-alert-400)]' 
                                : 'text-[var(--red-alert-300)] rotate-180'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Resumo visual dos dados */}
                <div className="mt-4 pt-4 border-t border-[var(--neutral-border)] grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-[var(--neutral-text-muted)]">Menor</p>
                    <p className="text-sm text-[var(--neutral-text)] mt-1">R$ 45k</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--neutral-text-muted)]">Média</p>
                    <p className="text-sm text-[var(--neutral-text)] mt-1">R$ 55k</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--neutral-text-muted)]">Maior</p>
                    <p className="text-sm text-[var(--green-alert-400)] mt-1">R$ 67k</p>
                  </div>
                </div>
              </div>
            ) : (
              // Desktop: Line Chart original
              <div className="w-full h-full min-h-[300px]">
                <ChartContainer config={chartConfig} className="w-full h-[300px] md:h-[350px] xl:h-[400px]">
                  <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }} width="100%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="var(--neutral-text-muted)" 
                      style={{ fontSize: '13px' }}
                      tick={{ fontSize: 13 }}
                    />
                    <YAxis 
                      stroke="var(--neutral-text-muted)"
                      style={{ fontSize: '13px' }}
                      tick={{ fontSize: 13 }}
                      width={70}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--primary-bg)" 
                      strokeWidth={3}
                      dot={{ fill: 'var(--primary-bg)', r: 5 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crescimento de Escolas */}
        <Card className="border-[var(--neutral-border)]">
          <CardHeader>
            <CardTitle className="text-[var(--neutral-text)]">Crescimento de Escolas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : isMobile ? (
              // Mobile: Visualização em lista com barras horizontais
              <div className="w-full space-y-3">
                {schoolsData.map((item, index) => {
                  const percentage = (item.schools / 28) * 100; // 28 é o valor máximo
                  const isLast = index === schoolsData.length - 1;
                  return (
                    <div key={item.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--neutral-text)]">{item.month}</span>
                        <span className={`text-sm ${isLast ? 'text-[var(--primary-bg)]' : 'text-[var(--neutral-text)]'}`}>
                          {item.schools} escolas
                        </span>
                      </div>
                      <div className="w-full bg-[rgb(11,17,67)] rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isLast ? 'bg-[var(--primary-bg)]' : 'bg-[var(--gray-200)]'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-[var(--neutral-border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--neutral-text-muted)]">Crescimento total</span>
                  <span className="text-sm text-[var(--green-alert-400)]">+133% (6 meses)</span>
                </div>
              </div>
            ) : (
              // Desktop: Bar Chart original
              <div className="w-full h-full min-h-[300px]">
                <ChartContainer config={chartConfig} className="w-full h-[300px] md:h-[350px] xl:h-[400px]">
                  <BarChart data={schoolsData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }} width="100%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="var(--neutral-text-muted)"
                      style={{ fontSize: '13px' }}
                      tick={{ fontSize: 13 }}
                    />
                    <YAxis 
                      stroke="var(--neutral-text-muted)"
                      style={{ fontSize: '13px' }}
                      tick={{ fontSize: 13 }}
                      width={60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="schools" 
                      fill="var(--primary-bg)" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={80}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* Atividade Recente */}
        <Card className="border-[var(--neutral-border)]">
          <CardHeader>
            <CardTitle className="text-[var(--neutral-text)]">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--neutral-text-muted)] text-center py-4">
                Nenhuma atividade recente
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                        <Icon className="h-4 w-4 text-[var(--neutral-text)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--neutral-text)]">{activity.school}</p>
                        <p className="text-sm text-[var(--neutral-text-muted)] mt-0.5">{activity.action}</p>
                        <p className="text-xs text-[var(--neutral-text-muted)] mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saúde do Sistema */}
        <Card className="border-[var(--neutral-border)]">
          <CardHeader>
            <CardTitle className="text-[var(--neutral-text)]">Saúde do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between pb-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {systemHealth.map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-[var(--neutral-border)] last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--success-bg)]" />
                    <span className="text-sm text-[var(--neutral-text)]">{item.metric}</span>
                  </div>
                  <span className="text-sm text-[var(--neutral-text)]">{item.value}</span>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}