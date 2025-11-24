/**
 * Hook para gerenciar usuários internos (admins)
 * Usado na aba "Usuários" do AdminSettingsScreen
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface InternalUser {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string | null;
  avatar_url: string | null;
  status: string;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  full_name: string;
  email: string;
  phone?: string;
  role?: string;
  password: string;
}

export interface UpdateUserData {
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
}

export interface UseInternalUsersReturn {
  users: InternalUser[];
  isLoading: boolean;
  error: Error | null;
  createUser: (data: CreateUserData) => Promise<InternalUser>;
  updateUser: (userId: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  refresh: () => void;
}

export function useInternalUsers(): UseInternalUsersReturn {
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar apenas usuários do tipo 'admin'
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'admin')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setUsers(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar usuários internos:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserData): Promise<InternalUser> => {
    try {
      setError(null);

      // Chamar Edge Function para criar usuário (usa auth.admin.createUser nativo)
      const { data: result, error: functionError } = await supabase.functions.invoke(
        'create-internal-user',
        {
          body: {
            email: data.email,
            password: data.password,
            full_name: data.full_name,
            phone: data.phone || null,
            role: data.role || null,
          },
        }
      );

      if (functionError) throw functionError;
      if (result?.error) throw new Error(result.error);
      if (!result?.data) throw new Error('Falha ao criar usuário');

      const newUser = result.data;

      // Atualizar lista local
      setUsers((prev) => [newUser, ...prev]);

      return newUser;
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err);
      setError(err);
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (userId: string, data: UpdateUserData) => {
    try {
      setError(null);

      // Chamar Edge Function para atualizar usuário
      const { data: result, error: functionError } = await supabase.functions.invoke(
        'update-internal-user',
        {
          body: {
            userId,
            ...data,
          },
        }
      );

      if (functionError) throw functionError;
      if (result?.error) throw new Error(result.error);
      if (!result?.data) throw new Error('Falha ao atualizar usuário');

      const updatedUser = result.data;

      // Atualizar lista local
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      );
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      setError(err);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setError(null);

      // Chamar Edge Function para deletar usuário
      const { data: result, error: functionError } = await supabase.functions.invoke(
        'delete-internal-user',
        {
          body: { userId },
        }
      );

      if (functionError) throw functionError;
      if (result?.error) throw new Error(result.error);

      // Atualizar lista local
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err: any) {
      console.error('Erro ao deletar usuário:', err);
      setError(err);
      throw err;
    }
  }, []);

  const toggleUserStatus = useCallback(async (userId: string) => {
    try {
      setError(null);

      // Buscar status atual
      const user = users.find((u) => u.id === userId);
      if (!user) throw new Error('Usuário não encontrado');

      const newStatus = user.status === 'active' ? 'inactive' : 'active';

      // Atualizar status
      await updateUser(userId, { status: newStatus });
    } catch (err: any) {
      console.error('Erro ao alternar status do usuário:', err);
      setError(err);
      throw err;
    }
  }, [users, updateUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refresh: fetchUsers,
  };
}
