/**
 * Hook para gerenciar branding da plataforma (nome e logo)
 * Usado na aba "Plataforma" do AdminSettingsScreen
 */

import { useCallback } from 'react';
import { usePlatformBrandingContext } from '../contexts/PlatformBrandingContext';
import { supabase } from '../lib/supabase';

export interface UpdateBrandingData {
  platform_name?: string;
  logo_url?: string;
}

export interface UsePlatformBrandingReturn {
  platformName: string;
  logoUrl: string | null;
  isLoading: boolean;
  error: Error | null;
  updateBranding: (data: UpdateBrandingData) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
  refresh: () => void;
}

export function usePlatformBranding(): UsePlatformBrandingReturn {
  const { branding, isLoading, error, updateBranding, refresh } = usePlatformBrandingContext();

  const uploadLogo = useCallback(async (file: File): Promise<string> => {
    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('platform-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('platform-assets')
        .getPublicUrl(filePath);

      // Atualizar branding com nova URL
      await updateBranding({ logo_url: publicUrl });

      return publicUrl;
    } catch (err: any) {
      console.error('Erro ao fazer upload de logo:', err);
      throw err;
    }
  }, [updateBranding]);

  return {
    platformName: branding?.platform_name || 'SegVision',
    logoUrl: branding?.logo_url || null,
    isLoading,
    error,
    updateBranding,
    uploadLogo,
    refresh,
  };
}
