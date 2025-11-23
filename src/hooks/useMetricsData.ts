/**
 * Hook para buscar métricas de alertas do Supabase
 * Usado na aba "Métricas" do AdminReportsScreen
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface MetricsFilters {
  periodo: '7d' | '30d' | 'mes' | 'personalizado';
  dataInicio?: Date;
  dataFim?: Date;
  escola?: string; // UUID da escola ou 'all'
  tipo?: string; // 'all' ou tipo específico
  gravidade?: string; // 'all' ou gravidade específica
}

export interface MetricsData {
  // KPI Cards
  totalAlertas: number;
  picoDiario: number;
  porGravidade: {
    alta: number;
    media: number;
    baixa: number;
  };
  mediaPorDia: number;

  // Gráfico de barras: Alertas por Dia
  alertasPorDia: Array<{
    day: string; // 'Seg', 'Ter', etc.
    alerts: number;
  }>;

  // Gráfico de pizza: Distribuição por Gravidade
  distribuicaoGravidade: Array<{
    name: string; // 'Alta', 'Média', 'Baixa'
    value: number;
    color: string;
  }>;
}

export interface UseMetricsDataReturn {
  data: MetricsData | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

const defaultMetrics: MetricsData = {
  totalAlertas: 0,
  picoDiario: 0,
  porGravidade: { alta: 0, media: 0, baixa: 0 },
  mediaPorDia: 0,
  alertasPorDia: [],
  distribuicaoGravidade: [],
};

export function useMetricsData(filters: MetricsFilters): UseMetricsDataReturn {
  const [data, setData] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Calcula datas com base no período
  const getDateRange = useCallback(() => {
    const hoje = new Date();
    let dataInicio: Date;
    let dataFim: Date = hoje;

    switch (filters.periodo) {
      case '7d':
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case '30d':
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 30);
        break;
      case 'mes':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        break;
      case 'personalizado':
        dataInicio = filters.dataInicio || new Date();
        dataFim = filters.dataFim || hoje;
        break;
      default:
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
    }

    return { dataInicio, dataFim };
  }, [filters.periodo, filters.dataInicio, filters.dataFim]);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { dataInicio, dataFim } = getDateRange();

      // Query base
      let query = supabase
        .from('alerts')
        .select('id, created_at, severity, type')
        .gte('created_at', dataInicio.toISOString())
        .lte('created_at', dataFim.toISOString());

      // Aplicar filtros
      if (filters.escola && filters.escola !== 'all') {
        query = query.eq('school_id', filters.escola);
      }

      if (filters.tipo && filters.tipo !== 'all') {
        query = query.eq('type', filters.tipo);
      }

      if (filters.gravidade && filters.gravidade !== 'all') {
        query = query.eq('severity', filters.gravidade);
      }

      const { data: alertsData, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const alerts = alertsData || [];

      // Calcular KPIs
      const totalAlertas = alerts.length;

      // Contadores por gravidade
      const alta = alerts.filter(a => a.severity === 'alta').length;
      const media = alerts.filter(a => a.severity === 'media').length;
      const baixa = alerts.filter(a => a.severity === 'baixa').length;

      // Agrupar por dia para gráfico e pico
      const alertasPorDiaMap = new Map<string, number>();
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

      alerts.forEach(alert => {
        const data = new Date(alert.created_at);
        const diaKey = data.toISOString().split('T')[0]; // YYYY-MM-DD
        alertasPorDiaMap.set(diaKey, (alertasPorDiaMap.get(diaKey) || 0) + 1);
      });

      // Pico diário
      const picoDiario = Math.max(...Array.from(alertasPorDiaMap.values()), 0);

      // Média por dia
      const diasComAlertas = alertasPorDiaMap.size || 1;
      const mediaPorDia = Math.round(totalAlertas / diasComAlertas);

      // Gráfico de barras: últimos 7 dias
      const alertasPorDia: Array<{ day: string; alerts: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const dia = new Date();
        dia.setDate(dia.getDate() - i);
        const diaKey = dia.toISOString().split('T')[0];
        const diaSemana = diasSemana[dia.getDay()];
        const count = alertasPorDiaMap.get(diaKey) || 0;
        alertasPorDia.push({ day: diaSemana, alerts: count });
      }

      // Gráfico de pizza: distribuição por gravidade
      const distribuicaoGravidade = [
        { name: 'Alta', value: alta, color: '#DC2626' },
        { name: 'Média', value: media, color: '#F59E0B' },
        { name: 'Baixa', value: baixa, color: '#10B981' },
      ].filter(item => item.value > 0); // Remover gravidades com 0

      setData({
        totalAlertas,
        picoDiario,
        porGravidade: { alta, media, baixa },
        mediaPorDia,
        alertasPorDia,
        distribuicaoGravidade,
      });
    } catch (err: any) {
      console.error('Erro ao buscar métricas:', err);
      setError(err);
      setData(defaultMetrics);
    } finally {
      setIsLoading(false);
    }
  }, [filters, getDateRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchMetrics,
  };
}
