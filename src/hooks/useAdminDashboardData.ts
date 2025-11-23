/**
 * Hook customizado para buscar dados do Admin Dashboard do Supabase
 * Substitui dados mock por dados reais do banco de dados
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import type {
  AdminDashboardData,
  AdminDashboardStats,
  AdminDashboardStatsRaw,
  RevenueDataPoint,
  SchoolsDataPoint,
  RecentActivityItem,
  SystemHealthMetric,
  UseAdminDashboardDataOptions,
  MONTH_NAMES,
} from '../types/admin-dashboard';

// Importar mapeamento de meses
const MONTH_MAP: Record<number, string> = {
  1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr',
  5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago',
  9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez',
};

/**
 * Hook para buscar e gerenciar dados do admin dashboard
 */
export function useAdminDashboardData(options: UseAdminDashboardDataOptions = {}) {
  const { refreshInterval = 30000, enabled = true } = options;

  const [data, setData] = useState<AdminDashboardData>({
    stats: {
      escolasAtivas: {
        title: 'Escolas Ativas',
        value: '0',
        icon: Building2,
        change: '--',
        changeType: 'neutral',
        trend: 'up',
      },
      receitaMensal: {
        title: 'Receita Mensal',
        value: 'R$ 0',
        icon: DollarSign,
        change: '--',
        changeType: 'neutral',
        trend: 'up',
      },
      usuariosTotais: {
        title: 'Usuários Totais',
        value: '0',
        icon: Users,
        change: '--',
        changeType: 'neutral',
        trend: 'up',
      },
      taxaCrescimento: {
        title: 'Taxa de Crescimento',
        value: '0%',
        icon: TrendingUp,
        change: 'Últimos 6 meses',
        changeType: 'neutral',
        trend: 'up',
      },
    },
    revenueData: [],
    schoolsData: [],
    recentActivity: [],
    systemHealth: [],
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  /**
   * Busca estatísticas do dashboard usando a view
   */
  const fetchStats = useCallback(async (): Promise<AdminDashboardStats> => {
    const { data: statsData, error } = await supabase
      .from('admin_dashboard_stats')
      .select('*')
      .single();

    if (error) throw error;

    const stats = statsData as AdminDashboardStatsRaw;

    // Calcular mudanças
    const escolasChange = stats.escolas_novas_mes > 0
      ? `+${stats.escolas_novas_mes} este mês`
      : 'Sem novas escolas';

    const receitaDiff = stats.receita_mensal - stats.receita_mes_anterior;
    const receitaPercent = stats.receita_mes_anterior > 0
      ? ((receitaDiff / stats.receita_mes_anterior) * 100).toFixed(0)
      : '0';
    const receitaChange = receitaDiff > 0
      ? `+${receitaPercent}% vs. mês anterior`
      : `${receitaPercent}% vs. mês anterior`;

    const usuariosChange = stats.usuarios_novos_semana > 0
      ? `+${stats.usuarios_novos_semana} esta semana`
      : 'Sem novos usuários';

    // Taxa de crescimento: escolas novas nos últimos 6 meses / total
    const taxaCrescimento = stats.escolas_total > 0
      ? ((stats.escolas_novas_mes / stats.escolas_total) * 100 * 6).toFixed(0) // Aproximação
      : '0';

    return {
      escolasAtivas: {
        title: 'Escolas Ativas',
        value: String(stats.escolas_ativas),
        icon: Building2,
        change: escolasChange,
        changeType: stats.escolas_novas_mes > 0 ? 'positive' : 'neutral',
        trend: 'up',
      },
      receitaMensal: {
        title: 'Receita Mensal',
        value: `R$ ${(stats.receita_mensal / 1000).toFixed(0)}k`,
        icon: DollarSign,
        change: receitaChange,
        changeType: receitaDiff > 0 ? 'positive' : receitaDiff < 0 ? 'negative' : 'neutral',
        trend: receitaDiff >= 0 ? 'up' : 'down',
      },
      usuariosTotais: {
        title: 'Usuários Totais',
        value: String(stats.usuarios_totais),
        icon: Users,
        change: usuariosChange,
        changeType: stats.usuarios_novos_semana > 0 ? 'positive' : 'neutral',
        trend: 'up',
      },
      taxaCrescimento: {
        title: 'Taxa de Crescimento',
        value: `${taxaCrescimento}%`,
        icon: TrendingUp,
        change: 'Últimos 6 meses',
        changeType: Number(taxaCrescimento) > 10 ? 'positive' : 'neutral',
        trend: 'up',
      },
    };
  }, []);

  /**
   * Busca dados do gráfico de receita (últimos 6 meses)
   */
  const fetchRevenueData = useCallback(async (): Promise<RevenueDataPoint[]> => {
    const { data: invoicesData, error } = await supabase
      .from('invoices')
      .select('paid_date, amount')
      .eq('status', 'paid')
      .gte('paid_date', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('paid_date', { ascending: true });

    if (error) throw error;

    // Agrupar por mês
    const monthlyRevenue = new Map<string, number>();

    // Inicializar últimos 6 meses com 0
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = MONTH_MAP[date.getMonth() + 1];
      monthlyRevenue.set(monthKey, 0);
    }

    // Somar receita por mês
    invoicesData?.forEach((invoice) => {
      const date = new Date(invoice.paid_date);
      const monthKey = MONTH_MAP[date.getMonth() + 1];
      monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + invoice.amount);
    });

    return Array.from(monthlyRevenue.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, []);

  /**
   * Busca dados do gráfico de escolas (últimos 6 meses)
   */
  const fetchSchoolsData = useCallback(async (): Promise<SchoolsDataPoint[]> => {
    const { data: schoolsData, error } = await supabase
      .from('schools')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Agrupar por mês (acumulativo)
    const monthlySchools = new Map<string, number>();

    // Inicializar últimos 6 meses com 0
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = MONTH_MAP[date.getMonth() + 1];
      monthlySchools.set(monthKey, 0);
    }

    // Contar escolas por mês
    schoolsData?.forEach((school) => {
      const date = new Date(school.created_at);
      const monthKey = MONTH_MAP[date.getMonth() + 1];
      monthlySchools.set(monthKey, (monthlySchools.get(monthKey) || 0) + 1);
    });

    return Array.from(monthlySchools.entries()).map(([month, schools]) => ({
      month,
      schools,
    }));
  }, []);

  /**
   * Busca atividades recentes (últimas 24h)
   */
  const fetchRecentActivity = useCallback(async (): Promise<RecentActivityItem[]> => {
    // Buscar eventos combinados: novas escolas, pagamentos, notificações
    const activities: RecentActivityItem[] = [];

    // 1. Novas escolas
    const { data: newSchools } = await supabase
      .from('schools')
      .select('id, name, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(2);

    newSchools?.forEach((school) => {
      const hoursAgo = Math.floor((Date.now() - new Date(school.created_at).getTime()) / (1000 * 60 * 60));
      activities.push({
        id: school.id,
        school: school.name,
        action: 'Nova escola cadastrada',
        time: hoursAgo > 0 ? `Há ${hoursAgo} horas` : 'Há poucos minutos',
        icon: Building2,
        iconBg: 'bg-[var(--info-bg)]',
        created_at: school.created_at,
      });
    });

    // 2. Pagamentos recebidos
    const { data: paidInvoices } = await supabase
      .from('invoices')
      .select('id, amount, paid_date, school:schools(name)')
      .eq('status', 'paid')
      .gte('paid_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('paid_date', { ascending: false })
      .limit(2);

    paidInvoices?.forEach((invoice: any) => {
      const hoursAgo = Math.floor((Date.now() - new Date(invoice.paid_date).getTime()) / (1000 * 60 * 60));
      activities.push({
        id: invoice.id,
        school: invoice.school?.name || 'Escola',
        action: `Pagamento recebido - R$ ${(invoice.amount / 1000).toFixed(1)}k`,
        time: hoursAgo > 0 ? `Há ${hoursAgo} horas` : 'Há poucos minutos',
        icon: DollarSign,
        iconBg: 'bg-[var(--success-bg)]',
        created_at: invoice.paid_date,
      });
    });

    // 3. Alertas críticos
    const { data: criticalAlerts } = await supabase
      .from('alerts')
      .select('id, title, created_at, school:schools(name)')
      .eq('severity', 'alta')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    criticalAlerts?.forEach((alert: any) => {
      const hoursAgo = Math.floor((Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60));
      activities.push({
        id: alert.id,
        school: alert.school?.name || 'Escola',
        action: alert.title,
        time: hoursAgo > 0 ? `Há ${hoursAgo} horas` : 'Há poucos minutos',
        icon: AlertCircle,
        iconBg: 'bg-[var(--warning-bg)]',
        created_at: alert.created_at,
      });
    });

    // Ordenar por data e pegar apenas 3
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  }, []);

  /**
   * Busca métricas de saúde do sistema
   */
  const fetchSystemHealth = useCallback(async (): Promise<SystemHealthMetric[]> => {
    const { data: statsData } = await supabase
      .from('admin_dashboard_stats')
      .select('*')
      .single();

    const stats = statsData as AdminDashboardStatsRaw;

    // Calcular uptime e response time a partir dos dados reais
    const uptime = stats?.sistema_uptime_24h || 0;
    const responseTime = stats?.sistema_response_time_avg_24h || 0;

    // Determinar status do uptime
    const uptimeStatus = uptime >= 99.5 ? 'healthy' : uptime >= 95 ? 'warning' : 'critical';

    // Determinar status do response time
    const responseTimeStatus = responseTime <= 150 ? 'healthy' : responseTime <= 300 ? 'warning' : 'critical';

    return [
      {
        metric: 'Uptime do Sistema',
        value: `${uptime.toFixed(1)}%`,
        status: uptimeStatus,
      },
      {
        metric: 'Tempo de Resposta Médio',
        value: `${Math.round(responseTime)}ms`,
        status: responseTimeStatus,
      },
      {
        metric: 'Alertas Processados Hoje',
        value: String(stats?.alertas_processados_hoje || 0),
        status: 'healthy',
      },
      {
        metric: 'Câmeras Online',
        value: `${stats?.cameras_online || 0}/${stats?.cameras_totais || 0}`,
        status: stats?.cameras_online === stats?.cameras_totais ? 'healthy' : 'warning',
      },
    ];
  }, []);

  /**
   * Busca todos os dados do admin dashboard
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      // Buscar dados em paralelo
      const [stats, revenueData, schoolsData, recentActivity, systemHealth] = await Promise.all([
        fetchStats(),
        fetchRevenueData(),
        fetchSchoolsData(),
        fetchRecentActivity(),
        fetchSystemHealth(),
      ]);

      setData({
        stats,
        revenueData,
        schoolsData,
        recentActivity,
        systemHealth,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Erro ao buscar dados do admin dashboard:', error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [fetchStats, fetchRevenueData, fetchSchoolsData, fetchRecentActivity, fetchSystemHealth]);

  /**
   * Refresh manual dos dados
   */
  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetch inicial
  useEffect(() => {
    if (enabled) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Auto-refresh
  useEffect(() => {
    if (!enabled || !refreshInterval) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, refreshInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, refreshInterval]);

  return {
    ...data,
    refresh,
  };
}
