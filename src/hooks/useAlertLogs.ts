/**
 * Hook para buscar logs de alertas do Supabase
 * Usado na aba "Log de Alertas" do AdminReportsScreen
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface AlertLogFilters {
  escola?: string; // UUID da escola ou 'all'
  tipo?: string; // 'all' ou tipo específico
  gravidade?: string; // 'all' ou gravidade específica
  status?: string; // 'all' ou status específico
}

export interface AlertLogTimeline {
  detected: Date;
  analyzing?: { date: Date; role: string };
  resolved?: { date: Date; role: string };
}

export interface AlertLog {
  id: string;
  timestamp: Date;
  school: string;
  type: string; // 'Intrusão', 'Reconhecimento Facial', etc.
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'analyzing' | 'resolved';
  slaMinutes?: number;
  camera: string;
  observations?: string;
  timeline: AlertLogTimeline;
}

export interface UseAlertLogsReturn {
  data: AlertLog[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  total: number;
}

// Mapeia tipos do banco para labels em português
const typeLabels: Record<string, string> = {
  intrusion: 'Intrusão',
  face: 'Reconhecimento Facial',
  crowd: 'Aglomeração',
  camera_offline: 'Câmera Offline',
  object: 'Detecção de Objetos',
};

// Mapeia status do banco para formato do frontend
const statusMap: Record<string, 'active' | 'analyzing' | 'resolved'> = {
  novo: 'active',
  confirmado: 'analyzing',
  resolvido: 'resolved',
  falso: 'resolved',
};

// Mapeia severidade do banco para formato do frontend
const severityMap: Record<string, 'high' | 'medium' | 'low'> = {
  alta: 'high',
  media: 'medium',
  baixa: 'low',
};

export function useAlertLogs(filters: AlertLogFilters): UseAlertLogsReturn {
  const [data, setData] = useState<AlertLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAlertLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Query usando a view alert_log_complete
      let query = supabase
        .from('alert_log_complete')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100); // Limitar a 100 para performance

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

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data: logsData, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setTotal(count || 0);

      // Mapear dados do banco para formato do frontend
      const mappedLogs: AlertLog[] = (logsData || []).map((log: any) => {
        // Construir timeline a partir do status_timeline JSONB
        const statusTimeline = log.status_timeline || [];

        const detectedEntry = statusTimeline.find((t: any) => t.new_status === 'novo');
        const analyzingEntry = statusTimeline.find((t: any) => t.new_status === 'confirmado');
        const resolvedEntry = statusTimeline.find((t: any) => t.new_status === 'resolvido' || t.new_status === 'falso');

        const timeline: AlertLogTimeline = {
          detected: new Date(log.created_at),
          analyzing: analyzingEntry
            ? {
                date: new Date(analyzingEntry.changed_at),
                role: analyzingEntry.changed_by_role || 'Sistema',
              }
            : undefined,
          resolved: resolvedEntry
            ? {
                date: new Date(resolvedEntry.changed_at),
                role: resolvedEntry.changed_by_role || 'Sistema',
              }
            : undefined,
        };

        return {
          id: log.id,
          timestamp: new Date(log.created_at),
          school: log.school_name || 'Escola',
          type: typeLabels[log.type] || log.type,
          severity: severityMap[log.severity] || 'medium',
          status: statusMap[log.status] || 'active',
          slaMinutes: log.sla_minutes,
          camera: log.camera_name || log.location_name || 'Câmera desconhecida',
          observations: log.description || undefined,
          timeline,
        };
      });

      setData(mappedLogs);
    } catch (err: any) {
      console.error('Erro ao buscar logs de alertas:', err);
      setError(err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAlertLogs();
  }, [fetchAlertLogs]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchAlertLogs,
    total,
  };
}
