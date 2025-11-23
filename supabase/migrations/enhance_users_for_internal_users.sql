-- ========================================
-- Migration: Enhance Users Table for Internal Users
-- ========================================
-- Adiciona campos necessários para gerenciar usuários internos
-- (admins e operadores da plataforma)
-- ========================================

-- Adicionar campos se não existirem
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS last_access TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Comentários
COMMENT ON COLUMN public.users.last_access IS 'Último acesso do usuário à plataforma';
COMMENT ON COLUMN public.users.status IS 'Status do usuário: active, inactive';
COMMENT ON COLUMN public.users.phone IS 'Telefone do usuário';
COMMENT ON COLUMN public.users.role IS 'Cargo/função do usuário (ex: Administrador do Sistema, Operador)';
COMMENT ON COLUMN public.users.avatar_url IS 'URL do avatar do usuário no Supabase Storage';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_access ON public.users(last_access DESC);

-- Criar função helper SECURITY DEFINER para evitar recursão infinita em RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND user_type = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy para admins verem outros admins (usando SECURITY DEFINER para evitar recursão)
CREATE POLICY "Admins can view internal users"
  ON public.users
  FOR SELECT
  USING (
    is_admin() AND user_type = 'admin'
  );

-- Policy para admins atualizarem outros usuários internos
CREATE POLICY "Admins can update internal users"
  ON public.users
  FOR UPDATE
  USING (
    is_admin() AND user_type = 'admin'
  );

-- Policy para admins criarem novos usuários internos
CREATE POLICY "Admins can create internal users"
  ON public.users
  FOR INSERT
  WITH CHECK (
    is_admin() AND user_type = 'admin'
  );

-- Policy para admins removerem usuários internos
CREATE POLICY "Admins can delete internal users"
  ON public.users
  FOR DELETE
  USING (
    is_admin() AND user_type = 'admin'
  );

-- Function para atualizar last_access automaticamente
CREATE OR REPLACE FUNCTION update_user_last_access()
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET last_access = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant para usuários autenticados
GRANT EXECUTE ON FUNCTION update_user_last_access() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
