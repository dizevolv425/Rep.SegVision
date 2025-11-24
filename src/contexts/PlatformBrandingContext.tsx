/**
 * Context para gerenciar branding da plataforma (nome e logo)
 * Busca dados da tabela platform_settings no Supabase
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface PlatformBranding {
  id: string;
  platform_name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface PlatformBrandingContextType {
  branding: PlatformBranding | null;
  isLoading: boolean;
  error: Error | null;
  updateBranding: (data: Partial<Pick<PlatformBranding, 'platform_name' | 'logo_url'>>) => Promise<void>;
  refresh: () => void;
}

const PlatformBrandingContext = createContext<PlatformBrandingContextType | undefined>(undefined);

export const PlatformBrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<PlatformBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBranding = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('platform_settings')
        .select('*')
        .single();

      if (fetchError) throw fetchError;

      setBranding(data);
    } catch (err: any) {
      console.error('Erro ao buscar branding da plataforma:', err);
      setError(err);
      // Fallback para dados padrão
      setBranding({
        id: '',
        platform_name: 'SegVision',
        logo_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBranding = useCallback(async (data: Partial<Pick<PlatformBranding, 'platform_name' | 'logo_url'>>) => {
    try {
      setError(null);

      // Como é single-row table, sempre atualizamos a primeira (e única) linha
      const { data: updatedData, error: updateError } = await supabase
        .from('platform_settings')
        .update(data)
        .single()
        .select();

      if (updateError) throw updateError;

      if (updatedData) {
        setBranding(updatedData);
      }
    } catch (err: any) {
      console.error('Erro ao atualizar branding:', err);
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const value: PlatformBrandingContextType = {
    branding,
    isLoading,
    error,
    updateBranding,
    refresh: fetchBranding,
  };

  return (
    <PlatformBrandingContext.Provider value={value}>
      {children}
    </PlatformBrandingContext.Provider>
  );
};

export const usePlatformBrandingContext = () => {
  const context = useContext(PlatformBrandingContext);
  if (context === undefined) {
    throw new Error('usePlatformBrandingContext must be used within a PlatformBrandingProvider');
  }
  return context;
};
