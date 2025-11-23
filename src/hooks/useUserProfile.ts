/**
 * Hook para gerenciar perfil do usuário logado
 * Usado na aba "Meu Perfil" do AdminSettingsScreen
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string | null;
  avatar_url: string | null;
  user_type: 'admin' | 'school';
  status: string;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  role?: string;
  avatar_url?: string;
}

export interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  refresh: () => void;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obter usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar dados do perfil
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      // Atualizar last_access automaticamente
      await supabase.rpc('update_user_last_access');
    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: updatedProfile, error: updateError } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(updatedProfile);
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err);
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);

      // Verificar senha atual (tentando fazer login)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('Usuário não autenticado');

      // Tentar login com senha atual para validar
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Senha atual incorreta');
      }

      // Validar nova senha usando função do banco
      const { data: validation, error: validationError } = await supabase
        .rpc('validate_password', { p_password: newPassword });

      if (validationError) throw validationError;

      // O resultado vem como array com um objeto
      const validationResult = validation?.[0];
      if (!validationResult?.is_valid) {
        throw new Error(validationResult?.error_message || 'Senha inválida');
      }

      // Atualizar senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // Registrar log de segurança
      await supabase.rpc('log_security_event', {
        p_event_type: 'password_changed',
        p_description: 'Senha alterada pelo usuário',
        p_severity: 'info',
        p_user_id: user.id,
      });
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      setError(err);
      throw err;
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload para o Storage (bucket avatars)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar perfil com nova URL
      await updateProfile({ avatar_url: publicUrl });

      return publicUrl;
    } catch (err: any) {
      console.error('Erro ao fazer upload de avatar:', err);
      setError(err);
      throw err;
    }
  }, [updateProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    changePassword,
    uploadAvatar,
    refresh: fetchProfile,
  };
}
