/**
 * Hook para buscar métricas de confiabilidade da IA do Supabase
 * Usado na aba "Confiabilidade da IA" do AdminReportsScreen
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface AIReliabilityMetric {
  eventType: string;
  totalDetections: number;
  truePositives: number;
  falsePositives: number;
  accuracyRate: number;
  falsePositiveRate: number;
  avgConfidence: number;
  minConfidence: number;
  maxConfidence: number;
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;
  avgDetectionTimeMs: number;
}

export interface AIPrecisionMonthly {
  month: string;
  monthDate: Date;
  precision: number;
  avgConfidence: number;
  totalDetections: number;
}

export interface ConfidenceDistribution {
  range: string;
  count: number;
  sortOrder: number;
}

export interface AIMetricsData {
  // KPIs gerais
  overallPrecision: number;
  overallFalsePositiveRate: number;
  avgDetectionTime: number;
  highConfidencePercentage: number;

  // Dados para gráficos
  precisionTrend: Array<{ month: string; precision: number }>;
  confidenceDistribution: Array<{ range: string; count: number; color: string }>;
  eventTypeAccuracy: Array<{
    type: string;
    accuracy: number;
    falsePositives: number;
    color: string;
  }>;
}

export interface UseAIMetricsReturn {
  data: AIMetricsData | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

// Mapeia tipos do banco para labels em português
const typeLabels: Record<string, string> = {
  intrusion: 'Intrusão',
  face: 'Reconhecimento Facial',
  crowd: 'Aglomeração',
  camera_offline: 'Câmera Offline',
  object: 'Detecção de Objetos',
};

// Cores para cada tipo de evento
const eventColors: Record<string, string> = {
  intrusion: '#2F5FFF',
  face: '#47D238',
  crowd: '#FDEC85',
  camera_offline: '#F03948',
  object: '#FACD64',
};

// Cores para distribuição de confiança
const confidenceColors: Record<string, string> = {
  '90-100%': '#47D238',
  '80-89%': '#FDEC85',
  '70-79%': '#FACD64',
  '60-69%': '#F59E0B',
  '<60%': '#F03948',
};

export function useAIMetrics(): UseAIMetricsReturn {
  const [data, setData] = useState<AIMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAIMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Buscar métricas de confiabilidade por tipo de evento
      const { data: reliabilityData, error: reliabilityError } = await supabase
        .from('ai_reliability_metrics')
        .select('*');

      if (reliabilityError) throw reliabilityError;

      // 2. Buscar evolução mensal da precisão
      const { data: precisionData, error: precisionError } = await supabase
        .from('ai_precision_monthly')
        .select('*')
        .order('month_date', { ascending: true });

      if (precisionError) throw precisionError;

      // 3. Buscar distribuição de confiança
      const { data: confidenceData, error: confidenceError } = await supabase
        .from('confidence_distribution')
        .select('*')
        .order('sort_order', { ascending: true });

      if (confidenceError) throw confidenceError;

      // Calcular KPIs gerais
      const totalDetections = (reliabilityData || []).reduce(
        (sum, item) => sum + item.total_detections,
        0
      );
      const totalTruePositives = (reliabilityData || []).reduce(
        (sum, item) => sum + item.true_positives,
        0
      );
      const totalFalsePositives = (reliabilityData || []).reduce(
        (sum, item) => sum + item.false_positives,
        0
      );

      const overallPrecision =
        totalDetections > 0
          ? parseFloat(((totalTruePositives / totalDetections) * 100).toFixed(2))
          : 0;

      const overallFalsePositiveRate =
        totalDetections > 0
          ? parseFloat(((totalFalsePositives / totalDetections) * 100).toFixed(2))
          : 0;

      // Tempo médio de detecção
      const avgDetectionTime =
        reliabilityData && reliabilityData.length > 0
          ? Math.round(
              reliabilityData.reduce((sum, item) => sum + (item.avg_detection_time_ms || 0), 0) /
                reliabilityData.length
            )
          : 0;

      // Percentual de alta confiança
      const totalConfidenceCount = (confidenceData || []).reduce(
        (sum, item) => sum + item.count,
        0
      );
      const highConfidenceCount =
        confidenceData?.find((item) => item.confidence_range === '90-100%')?.count || 0;
      const highConfidencePercentage =
        totalConfidenceCount > 0
          ? Math.round((highConfidenceCount / totalConfidenceCount) * 100)
          : 0;

      // Mapear dados para gráficos
      const precisionTrend = (precisionData || []).map((item) => ({
        month: item.month,
        precision: parseFloat(item.precision.toFixed(1)),
      }));

      const confidenceDistribution = (confidenceData || []).map((item) => ({
        range: item.confidence_range,
        count: item.count,
        color: confidenceColors[item.confidence_range] || '#666',
      }));

      const eventTypeAccuracy = (reliabilityData || []).map((item) => ({
        type: typeLabels[item.event_type] || item.event_type,
        accuracy: parseFloat(item.accuracy_rate.toFixed(1)),
        falsePositives: parseFloat(item.false_positive_rate.toFixed(1)),
        color: eventColors[item.event_type] || '#666',
      }));

      setData({
        overallPrecision,
        overallFalsePositiveRate,
        avgDetectionTime,
        highConfidencePercentage,
        precisionTrend,
        confidenceDistribution,
        eventTypeAccuracy,
      });
    } catch (err: any) {
      console.error('Erro ao buscar métricas de IA:', err);
      setError(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAIMetrics();
  }, [fetchAIMetrics]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchAIMetrics,
  };
}
