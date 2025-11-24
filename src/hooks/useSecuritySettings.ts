/**
 * Hook para gerenciar configurações de segurança global e logs de auditoria
 * Usado na aba "Segurança Global" do AdminSettingsScreen
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface SecuritySettings {
  id: string;
  inactivity_timeout_minutes: number;
  session_duration_minutes: number;
  max_login_attempts: number;
  password_expiration_days: number;
  two_factor_required: boolean;
  ip_whitelist: string;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_special_chars: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateSecuritySettingsData {
  inactivity_timeout_minutes?: number;
  session_duration_minutes?: number;
  max_login_attempts?: number;
  password_expiration_days?: number;
  two_factor_required?: boolean;
  ip_whitelist?: string;
  password_min_length?: number;
  password_require_uppercase?: boolean;
  password_require_lowercase?: boolean;
  password_require_numbers?: boolean;
  password_require_special_chars?: boolean;
}

export interface SecurityLog {
  id: string;
  event_type: string;
  severity: 'info' | 'warning' | 'critical';
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
  description: string;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
  created_at: string;
}

export interface UseSecuritySettingsReturn {
  settings: SecuritySettings | null;
  logs: SecurityLog[];
  isLoading: boolean;
  isLoadingLogs: boolean;
  error: Error | null;
  updateSettings: (data: UpdateSecuritySettingsData) => Promise<void>;
  fetchLogs: (limit?: number, offset?: number) => Promise<void>;
  refresh: () => void;
}

export function useSecuritySettings(): UseSecuritySettingsReturn {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar configurações de segurança (single-row table)
      const { data, error: fetchError } = await supabase
        .from('security_settings')
        .select('*')
        .single();

      if (fetchError) throw fetchError;

      setSettings(data);
    } catch (err: any) {
      console.error('Erro ao buscar configurações de segurança:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async (limit: number = 50, offset: number = 0) => {
    try {
      setIsLoadingLogs(true);
      setError(null);

      // Buscar logs de segurança mais recentes
      const { data, error: fetchError } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fetchError) throw fetchError;

      setLogs(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar logs de segurança:', err);
      setError(err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: UpdateSecuritySettingsData) => {
    try {
      setError(null);

      if (!settings?.id) {
        throw new Error('Configurações não carregadas');
      }

      // Atualizar configurações (single-row table, sempre atualiza a primeira linha)
      const { data: updatedSettings, error: updateError } = await supabase
        .from('security_settings')
        .update(data)
        .eq('id', settings.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setSettings(updatedSettings);

      // O trigger automaticamente vai criar um log de auditoria
    } catch (err: any) {
      console.error('Erro ao atualizar configurações de segurança:', err);
      setError(err);
      throw err;
    }
  }, [settings]);

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, [fetchSettings, fetchLogs]);

  return {
    settings,
    logs,
    isLoading,
    isLoadingLogs,
    error,
    updateSettings,
    fetchLogs,
    refresh: () => {
      fetchSettings();
      fetchLogs();
    },
  };
}
