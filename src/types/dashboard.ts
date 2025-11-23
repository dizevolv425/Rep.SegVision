/**
 * Types para o Dashboard do SegVision
 * Define as estruturas de dados usadas no dashboard principal
 */

import type { LucideIcon } from 'lucide-react';

// ================================================
// ENUMS DO BANCO DE DADOS
// ================================================

export type CameraStatus = 'online' | 'offline' | 'ativa' | 'inativa';
export type CameraSensitivity = 'baixa' | 'media' | 'alta';

export type AlertType =
  | 'intrusion'      // Intrusão/Movimento após horário
  | 'face'           // Pessoa de risco (reconhecimento facial)
  | 'crowd'          // Aglomeração
  | 'object'         // Objeto suspeito
  | 'camera_offline' // Câmera offline
  | 'fall'           // Quedas/Desmaios
  | 'aggression'     // Agressão física/Brigas
  | 'weapon';        // Armas (fogo ou branca)

export type AlertStatus = 'novo' | 'confirmado' | 'resolvido' | 'falso';
export type AlertSeverity = 'baixa' | 'media' | 'alta';

// ================================================
// DADOS BRUTOS DO BANCO (Database Models)
// ================================================

export interface Camera {
  id: string;
  school_id: string;
  location_id: string | null;
  name: string;
  rtsp_url: string;
  status: CameraStatus;
  ai_enabled: boolean;
  facial_recognition: boolean;
  people_count: boolean;
  sensitivity: CameraSensitivity;
  created_at: string;
  updated_at: string;
  // Relações
  location?: Location;
}

export interface Location {
  id: string;
  environment_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Environment {
  id: string;
  school_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  camera_id: string | null;
  school_id: string;
  type: AlertType;
  title: string;
  description: string;
  status: AlertStatus;
  severity: AlertSeverity;
  stream_url?: string | null;
  action_by_user_id?: string | null;
  created_at: string;
  resolved_at?: string | null;
  // Relações
  camera?: Camera;
  location?: Location;
}

// ================================================
// ESTATÍSTICAS DO DASHBOARD (View)
// ================================================

export interface DashboardStatsRaw {
  school_id: string;
  school_name: string;
  ai_accuracy: number;
  cameras_ativas: number;
  cameras_total: number;
  alertas_24h: number;
  alertas_ontem: number;
  incidentes_criticos_24h: number;
  incidentes_criticos_ontem: number;
  updated_at: string;
}

// ================================================
// DADOS PROCESSADOS PARA UI
// ================================================

/**
 * Estatística individual do dashboard (card)
 */
export interface DashboardStat {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

/**
 * Todas as estatísticas do dashboard
 */
export interface DashboardStats {
  camerasAtivas: DashboardStat;
  alertas24h: DashboardStat;
  incidentesCriticos: DashboardStat;
  taxaDeteccao: DashboardStat;
}

/**
 * Ponto do gráfico de evolução de alertas
 */
export interface ChartDataPoint {
  time: string;  // Formato HH:MM
  alerts: number;
}

/**
 * Alerta recente formatado para UI
 */
export interface RecentAlert {
  id: string;
  event: string;
  time: string;       // Formato HH:MM
  camera: string;
  status: AlertStatus;
  severity: AlertSeverity;
  icon: LucideIcon;
  type: AlertType;
  location?: string;
}

/**
 * Dados completos do dashboard
 */
export interface DashboardData {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  recentAlerts: RecentAlert[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

// ================================================
// MAPEAMENTOS E HELPERS
// ================================================

/**
 * Mapeamento de tipos de alerta para labels em português
 */
export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  intrusion: 'Movimento após horário',
  face: 'Pessoa não autorizada',
  crowd: 'Aglomeração detectada',
  object: 'Objeto suspeito',
  camera_offline: 'Câmera offline',
  fall: 'Queda detectada',
  aggression: 'Agressão física',
  weapon: 'Arma detectada',
};

/**
 * Mapeamento de status de alerta para labels em português
 */
export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  novo: 'Novo',
  confirmado: 'Verificado',
  resolvido: 'Resolvido',
  falso: 'Falso Positivo',
};

/**
 * Mapeamento de severidade para labels em português
 */
export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

/**
 * Configuração de badges por status
 */
export const ALERT_STATUS_BADGE_CONFIG: Record<
  AlertStatus,
  { variant: 'heavy' | 'medium' | 'light'; tone: 'danger' | 'caution' | 'success' | 'neutral' }
> = {
  novo: { variant: 'heavy', tone: 'danger' },
  confirmado: { variant: 'medium', tone: 'caution' },
  resolvido: { variant: 'medium', tone: 'success' },
  falso: { variant: 'light', tone: 'neutral' },
};

/**
 * Configuração de cores por severidade
 */
export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, string> = {
  baixa: 'var(--success-bg)',
  media: 'var(--caution-bg)',
  alta: 'var(--danger-bg)',
};

// ================================================
// QUERY PARAMETERS
// ================================================

/**
 * Parâmetros para buscar dados do dashboard
 */
export interface DashboardQueryParams {
  schoolId: string;
  hours?: number; // Padrão: 24h
}

/**
 * Opções de configuração do hook
 */
export interface UseDashboardDataOptions {
  refreshInterval?: number; // Milissegundos (padrão: 30000 = 30s)
  enabled?: boolean;         // Se deve buscar dados automaticamente
}
