/**
 * Hook para gerenciar preferências de notificação do usuário
 * Usado na aba "Notificações" do AdminSettingsScreen
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  security_alerts: boolean;
  new_contracts: boolean;
  payment_reminders: boolean;
  school_updates: boolean;
  weekly_reports: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdatePreferencesData {
  security_alerts?: boolean;
  new_contracts?: boolean;
  payment_reminders?: boolean;
  school_updates?: boolean;
  weekly_reports?: boolean;
  email_enabled?: boolean;
  push_enabled?: boolean;
  in_app_enabled?: boolean;
}

export interface UseNotificationPreferencesReturn {
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: Error | null;
  updatePreferences: (data: UpdatePreferencesData) => Promise<void>;
  refresh: () => void;
}

const defaultPreferences: Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  security_alerts: true,
  new_contracts: true,
  payment_reminders: true,
  school_updates: true,
  weekly_reports: false,
  email_enabled: true,
  push_enabled: true,
  in_app_enabled: true,
};

export function useNotificationPreferences(): UseNotificationPreferencesReturn {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obter usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar preferências do usuário
      const { data, error: fetchError } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // Se não existir, criar com valores padrão
        if (fetchError.code === 'PGRST116') {
          const { data: newPrefs, error: createError } = await supabase
            .from('user_notification_preferences')
            .insert([
              {
                user_id: user.id,
                ...defaultPreferences,
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          setPreferences(newPrefs);
        } else {
          throw fetchError;
        }
      } else {
        setPreferences(data);
      }
    } catch (err: any) {
      console.error('Erro ao buscar preferências de notificação:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (data: UpdatePreferencesData) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Atualizar preferências
      const { data: updatedPrefs, error: updateError } = await supabase
        .from('user_notification_preferences')
        .update(data)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPreferences(updatedPrefs);
    } catch (err: any) {
      console.error('Erro ao atualizar preferências:', err);
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchPreferences();

    // Subscrever a mudanças em tempo real
    let subscription: ReturnType<typeof supabase.channel> | null = null;

    supabase.auth.getUser().then((result) => {
      if (result.data.user) {
        subscription = supabase
          .channel('user_notification_preferences_changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'user_notification_preferences',
              filter: `user_id=eq.${result.data.user.id}`,
            },
            (payload) => {
              console.log('Notification preferences changed:', payload);
              if (payload.new) {
                setPreferences(payload.new as NotificationPreferences);
              }
            }
          )
          .subscribe();
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    refresh: fetchPreferences,
  };
}
