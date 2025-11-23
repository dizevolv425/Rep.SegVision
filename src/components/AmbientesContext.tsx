import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useUserProfile } from './UserProfileContext';

interface Local {
  id: string;
  name: string;
  description?: string;
  espacoId: string;
}

interface Espaco {
  id: string;
  name: string;
  description?: string;
  locais: Local[];
}

interface AmbientesContextType {
  espacos: Espaco[];
  setEspacos: (espacos: Espaco[]) => void;
  getAllLocais: () => { id: string; name: string; fullName: string }[];
  loadAmbientes: () => Promise<void>;
  addEspaco: (name: string, description?: string) => Promise<void>;
  updateEspaco: (id: string, name: string, description?: string) => Promise<void>;
  deleteEspaco: (id: string) => Promise<void>;
  addLocal: (espacoId: string, name: string, description?: string) => Promise<void>;
  updateLocal: (id: string, name: string, description?: string) => Promise<void>;
  deleteLocal: (id: string) => Promise<void>;
  loading: boolean;
}

const AmbientesContext = createContext<AmbientesContextType | undefined>(undefined);

export function AmbientesProvider({ children }: { children: ReactNode }) {
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useUserProfile();

  const loadAmbientes = async () => {
    if (!profile?.school_id) {
      setEspacos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Buscar environments (espaços)
      const { data: environmentsData, error: envError } = await supabase
        .from('environments')
        .select('*')
        .eq('school_id', profile.school_id)
        .order('created_at', { ascending: true });

      if (envError) throw envError;

      // Buscar locations (locais)
      const { data: locationsData, error: locError } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: true });

      if (locError) throw locError;

      // Combinar environments e locations
      const espacosComLocais: Espaco[] = (environmentsData || []).map(env => ({
        id: env.id,
        name: env.name,
        description: env.description || undefined,
        locais: (locationsData || [])
          .filter(loc => loc.environment_id === env.id)
          .map(loc => ({
            id: loc.id,
            name: loc.name,
            description: loc.description || undefined,
            espacoId: loc.environment_id
          }))
      }));

      setEspacos(espacosComLocais);
    } catch (error) {
      console.error('Erro ao carregar ambientes:', error);
      setEspacos([]);
    } finally {
      setLoading(false);
    }
  };

  const addEspaco = async (name: string, description?: string) => {
    if (!profile?.school_id) throw new Error('School ID not found');

    const { data, error } = await supabase
      .from('environments')
      .insert({
        school_id: profile.school_id,
        name,
        description
      })
      .select()
      .single();

    if (error) throw error;

    await loadAmbientes();
  };

  const updateEspaco = async (id: string, name: string, description?: string) => {
    const { error } = await supabase
      .from('environments')
      .update({ name, description })
      .eq('id', id);

    if (error) throw error;

    await loadAmbientes();
  };

  const deleteEspaco = async (id: string) => {
    const { error } = await supabase
      .from('environments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await loadAmbientes();
  };

  const addLocal = async (espacoId: string, name: string, description?: string) => {
    const { data, error } = await supabase
      .from('locations')
      .insert({
        environment_id: espacoId,
        name,
        description
      })
      .select()
      .single();

    if (error) throw error;

    await loadAmbientes();
  };

  const updateLocal = async (id: string, name: string, description?: string) => {
    const { error } = await supabase
      .from('locations')
      .update({ name, description })
      .eq('id', id);

    if (error) throw error;

    await loadAmbientes();
  };

  const deleteLocal = async (id: string) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await loadAmbientes();
  };

  const getAllLocais = () => {
    const locais: { id: string; name: string; fullName: string }[] = [];
    espacos.forEach(espaco => {
      espaco.locais.forEach(local => {
        locais.push({
          id: local.id,
          name: local.name,
          fullName: `${espaco.name} → ${local.name}`
        });
      });
    });
    return locais;
  };

  // Carregar ambientes quando o school_id estiver disponível
  useEffect(() => {
    if (profile?.school_id) {
      loadAmbientes();
    }
  }, [profile?.school_id]);

  return (
    <AmbientesContext.Provider value={{
      espacos,
      setEspacos,
      getAllLocais,
      loadAmbientes,
      addEspaco,
      updateEspaco,
      deleteEspaco,
      addLocal,
      updateLocal,
      deleteLocal,
      loading
    }}>
      {children}
    </AmbientesContext.Provider>
  );
}

export function useAmbientes() {
  const context = useContext(AmbientesContext);
  if (context === undefined) {
    throw new Error('useAmbientes must be used within an AmbientesProvider');
  }
  return context;
}

export type { Espaco, Local };
