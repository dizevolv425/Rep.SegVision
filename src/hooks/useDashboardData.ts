/**
 * Hook customizado para buscar dados do Dashboard do Supabase
 * Substitui dados mock por dados reais do banco de dados
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  Camera,
  TrendingUp,
  Clock,
  AlertTriangle,
  Ban,
  User,
  Users,
  Package,
  Flame,
  Shield,
  UserX,
} from 'lucide-react';
import type {
  DashboardData,
  DashboardStats,
  DashboardStat,
  ChartDataPoint,
  RecentAlert,
  Alert,
  DashboardStatsRaw,
  AlertType,
  UseDashboardDataOptions,
} from '../types/dashboard';
import { ALERT_TYPE_LABELS } from '../types/dashboard';

/**
 * Mapeamento de tipos de alerta para ícones Lucide
 */
const ALERT_TYPE_ICONS: Record<AlertType, typeof Ban> = {
  intrusion: Ban,
  face: UserX,
  crowd: Users,
  object: Package,
  camera_offline: Camera,
  fall: AlertTriangle,
  aggression: Shield,
  weapon: Flame,
};

/**
 * Hook para buscar e gerenciar dados do dashboard
 */
export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const { refreshInterval = 30000, enabled = true } = options;

  const [data, setData] = useState<DashboardData>({
    stats: {
      camerasAtivas: {
        title: 'Câmeras Ativas',
        value: '0',
        icon: Camera,
        change: '--',
        changeType: 'neutral',
      },
      alertas24h: {
        title: 'Alertas 24h',
        value: '0',
        icon: Clock,
        change: '--',
        changeType: 'neutral',
      },
      incidentesCriticos: {
        title: 'Incidentes Críticos',
        value: '0',
        icon: AlertTriangle,
        change: '--',
        changeType: 'neutral',
      },
      taxaDeteccao: {
        title: 'Taxa de Detecção',
        value: '--',
        icon: TrendingUp,
        change: '--',
        changeType: 'neutral',
      },
    },
    chartData: [],
    recentAlerts: [],
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  /**
   * Busca estatísticas do dashboard usando a view
   */
  const fetchStats = useCallback(async (schoolId: string): Promise<DashboardStats> => {
    const { data: statsData, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('school_id', schoolId)
      .single();

    if (error) throw error;

    const stats = statsData as DashboardStatsRaw;

    // Calcular mudanças
    const camerasChange = ''; // Não temos histórico de câmeras ainda
    const alertasChange = calculateChange(stats.alertas_24h, stats.alertas_ontem, 'vs. ontem');
    const incidentesChange = calculateChange(
      stats.incidentes_criticos_24h,
      stats.incidentes_criticos_ontem,
      'desde ontem'
    );

    return {
      camerasAtivas: {
        title: 'Câmeras Ativas',
        value: String(stats.cameras_ativas),
        icon: Camera,
        change: camerasChange || `${stats.cameras_ativas}/${stats.cameras_total} câmeras`,
        changeType: 'neutral',
      },
      alertas24h: {
        title: 'Alertas 24h',
        value: String(stats.alertas_24h),
        icon: Clock,
        change: alertasChange.text,
        changeType: alertasChange.type,
      },
      incidentesCriticos: {
        title: 'Incidentes Críticos',
        value: String(stats.incidentes_criticos_24h),
        icon: AlertTriangle,
        change: incidentesChange.text,
        changeType: incidentesChange.type,
      },
      taxaDeteccao: {
        title: 'Taxa de Detecção',
        value: `${stats.ai_accuracy.toFixed(0)}%`,
        icon: TrendingUp,
        change: 'Acurácia da IA',
        changeType: stats.ai_accuracy >= 90 ? 'positive' : stats.ai_accuracy >= 70 ? 'neutral' : 'negative',
      },
    };
  }, []);

  /**
   * Busca dados do gráfico de evolução de alertas (últimas 24h)
   */
  const fetchChartData = useCallback(async (schoolId: string): Promise<ChartDataPoint[]> => {
    const { data: alertsData, error } = await supabase
      .from('alerts')
      .select('created_at')
      .eq('school_id', schoolId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Agrupar por hora
    const hourlyData = new Map<string, number>();

    // Inicializar todas as horas das últimas 24h com 0
    for (let i = 23; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i, 0, 0, 0);
      const hourKey = date.getHours().toString().padStart(2, '0') + ':00';
      hourlyData.set(hourKey, 0);
    }

    // Contar alertas por hora
    alertsData?.forEach((alert) => {
      const date = new Date(alert.created_at);
      const hourKey = date.getHours().toString().padStart(2, '0') + ':00';
      hourlyData.set(hourKey, (hourlyData.get(hourKey) || 0) + 1);
    });

    // Converter para array e pegar amostragem de 6 pontos
    const allPoints = Array.from(hourlyData.entries())
      .map(([time, alerts]) => ({ time, alerts }))
      .sort((a, b) => a.time.localeCompare(b.time));

    // Pegar 6 pontos distribuídos ao longo das 24h
    const step = Math.floor(allPoints.length / 6);
    const chartData: ChartDataPoint[] = [];
    for (let i = 0; i < 6; i++) {
      const index = i * step;
      if (index < allPoints.length) {
        chartData.push(allPoints[index]);
      }
    }

    return chartData;
  }, []);

  /**
   * Busca últimos 4 alertas
   */
  const fetchRecentAlerts = useCallback(async (schoolId: string): Promise<RecentAlert[]> => {
    const { data: alertsData, error } = await supabase
      .from('alerts')
      .select(
        `
        id,
        type,
        title,
        description,
        status,
        severity,
        created_at,
        camera:cameras(
          name,
          location:locations(name)
        )
      `
      )
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) throw error;

    return (alertsData || []).map((alert: any) => {
      const date = new Date(alert.created_at);
      const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      return {
        id: alert.id,
        event: ALERT_TYPE_LABELS[alert.type as AlertType] || alert.title,
        time,
        camera: alert.camera?.name || 'Câmera desconhecida',
        location: alert.camera?.location?.name,
        status: alert.status,
        severity: alert.severity,
        type: alert.type,
        icon: ALERT_TYPE_ICONS[alert.type as AlertType] || Ban,
      };
    });
  }, []);

  /**
   * Busca todos os dados do dashboard
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      // Buscar school_id do usuário autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar perfil do usuário para pegar school_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('school_id')
        .eq('id', user.id)
        .single();

      if (userError || !userData?.school_id) {
        throw new Error('School ID não encontrado');
      }

      const schoolId = userData.school_id;

      // Buscar dados em paralelo
      const [stats, chartData, recentAlerts] = await Promise.all([
        fetchStats(schoolId),
        fetchChartData(schoolId),
        fetchRecentAlerts(schoolId),
      ]);

      setData({
        stats,
        chartData,
        recentAlerts,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [fetchStats, fetchChartData, fetchRecentAlerts]);

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
  }, [enabled, fetchDashboardData]);

  // Auto-refresh
  useEffect(() => {
    if (!enabled || !refreshInterval) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, refreshInterval, fetchDashboardData]);

  return {
    ...data,
    refresh,
  };
}

/**
 * Helper para calcular mudança e determinar tipo
 */
function calculateChange(
  current: number,
  previous: number,
  suffix: string
): { text: string; type: 'positive' | 'negative' | 'neutral' } {
  const diff = current - previous;

  if (diff === 0) {
    return { text: 'Sem alteração', type: 'neutral' };
  }

  const sign = diff > 0 ? '+' : '';
  const text = `${sign}${diff} ${suffix}`;

  // Para alertas, aumento é negativo (mais alertas = pior)
  const type = diff > 0 ? 'negative' : diff < 0 ? 'positive' : 'neutral';

  return { text, type };
}
