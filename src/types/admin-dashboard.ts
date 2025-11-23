/**
 * Types para o Admin Dashboard do SegVision
 * Define as estruturas de dados usadas no dashboard administrativo
 */

import type { LucideIcon } from 'lucide-react';

// ================================================
// DADOS BRUTOS DO BANCO (Database Models)
// ================================================

export interface AdminDashboardStatsRaw {
  // Escolas
  escolas_ativas: number;
  escolas_total: number;
  escolas_novas_mes: number;
  escolas_mes_anterior: number;

  // Receita
  receita_mensal: number;
  receita_mes_anterior: number;
  receita_total_6m: number;

  // Usuários
  usuarios_totais: number;
  usuarios_novos_semana: number;
  usuarios_semana_anterior: number;

  // Sistema
  cameras_totais: number;
  cameras_online: number;
  alertas_processados_hoje: number;

  // Sistema - Monitoramento
  sistema_uptime_24h: number;
  sistema_response_time_avg_24h: number;

  // Meta
  updated_at: string;
}

// ================================================
// DADOS PROCESSADOS PARA UI
// ================================================

/**
 * Estatística individual do admin dashboard (card)
 */
export interface AdminDashboardStat {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  trend?: 'up' | 'down';
}

/**
 * Todas as estatísticas do admin dashboard
 */
export interface AdminDashboardStats {
  escolasAtivas: AdminDashboardStat;
  receitaMensal: AdminDashboardStat;
  usuariosTotais: AdminDashboardStat;
  taxaCrescimento: AdminDashboardStat;
}

/**
 * Ponto do gráfico de receita mensal
 */
export interface RevenueDataPoint {
  month: string;  // Formato: "Jan", "Fev", etc
  revenue: number;
}

/**
 * Ponto do gráfico de crescimento de escolas
 */
export interface SchoolsDataPoint {
  month: string;  // Formato: "Jan", "Fev", etc
  schools: number;
}

/**
 * Item de atividade recente formatado para UI
 */
export interface RecentActivityItem {
  id: string;
  school: string;
  action: string;
  time: string;       // Formato relativo: "Há 2 horas"
  icon: LucideIcon;
  iconBg: string;     // Classe CSS de cor
  created_at: string; // ISO timestamp
}

/**
 * Métrica de saúde do sistema
 */
export interface SystemHealthMetric {
  metric: string;
  value: string;
  status?: 'healthy' | 'warning' | 'critical';
}

/**
 * Dados completos do admin dashboard
 */
export interface AdminDashboardData {
  stats: AdminDashboardStats;
  revenueData: RevenueDataPoint[];
  schoolsData: SchoolsDataPoint[];
  recentActivity: RecentActivityItem[];
  systemHealth: SystemHealthMetric[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

// ================================================
// QUERY PARAMETERS
// ================================================

/**
 * Opções de configuração do hook
 */
export interface UseAdminDashboardDataOptions {
  refreshInterval?: number; // Milissegundos (padrão: 30000 = 30s)
  enabled?: boolean;         // Se deve buscar dados automaticamente
}

// ================================================
// MAPEAMENTOS DE MESES
// ================================================

/**
 * Mapeamento de números de mês para abreviações em português
 */
export const MONTH_NAMES: Record<number, string> = {
  1: 'Jan',
  2: 'Fev',
  3: 'Mar',
  4: 'Abr',
  5: 'Mai',
  6: 'Jun',
  7: 'Jul',
  8: 'Ago',
  9: 'Set',
  10: 'Out',
  11: 'Nov',
  12: 'Dez',
};
