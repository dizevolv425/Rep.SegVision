-- ========================================
-- Migration: Create Security Settings Table
-- ========================================
-- Tabela para armazenar configurações globais de segurança da plataforma
-- Single-row table: sempre terá apenas 1 linha
-- ========================================

-- Criar tabela
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Configurações de sessão e inatividade
  inactivity_timeout_minutes INTEGER DEFAULT 30 CHECK (inactivity_timeout_minutes > 0),
  session_duration_minutes INTEGER DEFAULT 480 CHECK (session_duration_minutes > 0),

  -- Configurações de autenticação
  max_login_attempts INTEGER DEFAULT 5 CHECK (max_login_attempts > 0),
  password_expiration_days INTEGER DEFAULT 90 CHECK (password_expiration_days > 0),
  two_factor_required BOOLEAN DEFAULT false,

  -- Whitelist de IPs (separados por vírgula)
  ip_whitelist TEXT DEFAULT '',

  -- Requisitos de senha
  password_min_length INTEGER DEFAULT 8 CHECK (password_min_length >= 6),
  password_require_uppercase BOOLEAN DEFAULT true,
  password_require_lowercase BOOLEAN DEFAULT true,
  password_require_numbers BOOLEAN DEFAULT true,
  password_require_special_chars BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE public.security_settings IS 'Configurações globais de segurança da plataforma. Single-row table.';
COMMENT ON COLUMN public.security_settings.inactivity_timeout_minutes IS 'Tempo máximo de inatividade antes de deslogar automaticamente (em minutos)';
COMMENT ON COLUMN public.security_settings.session_duration_minutes IS 'Duração máxima de uma sessão (em minutos)';
COMMENT ON COLUMN public.security_settings.max_login_attempts IS 'Número máximo de tentativas de login antes de bloquear';
COMMENT ON COLUMN public.security_settings.password_expiration_days IS 'Período de expiração de senha (em dias)';
COMMENT ON COLUMN public.security_settings.two_factor_required IS 'Requer autenticação de dois fatores para todos os usuários';
COMMENT ON COLUMN public.security_settings.ip_whitelist IS 'Lista de IPs permitidos (separados por vírgula). Vazio = todos permitidos';
COMMENT ON COLUMN public.security_settings.password_min_length IS 'Tamanho mínimo da senha';
COMMENT ON COLUMN public.security_settings.password_require_uppercase IS 'Senha deve conter letras maiúsculas';
COMMENT ON COLUMN public.security_settings.password_require_lowercase IS 'Senha deve conter letras minúsculas';
COMMENT ON COLUMN public.security_settings.password_require_numbers IS 'Senha deve conter números';
COMMENT ON COLUMN public.security_settings.password_require_special_chars IS 'Senha deve conter caracteres especiais';

-- Insert default row (single row table)
INSERT INTO public.security_settings (
  inactivity_timeout_minutes,
  session_duration_minutes,
  max_login_attempts,
  password_expiration_days,
  two_factor_required,
  ip_whitelist,
  password_min_length
)
VALUES (30, 480, 5, 90, false, '', 8)
ON CONFLICT DO NOTHING;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_security_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER security_settings_updated_at
  BEFORE UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_security_settings_updated_at();

-- Habilitar RLS
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um autenticado pode ler (para validações client-side)
CREATE POLICY "Authenticated users can read security settings"
  ON public.security_settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Apenas admins podem atualizar
CREATE POLICY "Only admins can update security settings"
  ON public.security_settings
  FOR UPDATE
  USING (is_admin());

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_security_settings_updated_at
  ON public.security_settings(updated_at DESC);

-- Function helper para validar senha baseada nas configurações
CREATE OR REPLACE FUNCTION validate_password(p_password TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  v_settings RECORD;
BEGIN
  -- Buscar configurações atuais
  SELECT * INTO v_settings FROM public.security_settings LIMIT 1;

  -- Se não houver configurações, usar defaults
  IF v_settings IS NULL THEN
    v_settings.password_min_length := 8;
    v_settings.password_require_uppercase := true;
    v_settings.password_require_lowercase := true;
    v_settings.password_require_numbers := true;
    v_settings.password_require_special_chars := true;
  END IF;

  -- Validar tamanho mínimo
  IF LENGTH(p_password) < v_settings.password_min_length THEN
    RETURN QUERY SELECT false, FORMAT('Senha deve ter no mínimo %s caracteres', v_settings.password_min_length);
    RETURN;
  END IF;

  -- Validar maiúsculas
  IF v_settings.password_require_uppercase AND p_password !~ '[A-Z]' THEN
    RETURN QUERY SELECT false, 'Senha deve conter pelo menos uma letra maiúscula'::TEXT;
    RETURN;
  END IF;

  -- Validar minúsculas
  IF v_settings.password_require_lowercase AND p_password !~ '[a-z]' THEN
    RETURN QUERY SELECT false, 'Senha deve conter pelo menos uma letra minúscula'::TEXT;
    RETURN;
  END IF;

  -- Validar números
  IF v_settings.password_require_numbers AND p_password !~ '[0-9]' THEN
    RETURN QUERY SELECT false, 'Senha deve conter pelo menos um número'::TEXT;
    RETURN;
  END IF;

  -- Validar caracteres especiais
  IF v_settings.password_require_special_chars AND p_password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RETURN QUERY SELECT false, 'Senha deve conter pelo menos um caractere especial'::TEXT;
    RETURN;
  END IF;

  -- Senha válida
  RETURN QUERY SELECT true, ''::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant para usuários autenticados
GRANT EXECUTE ON FUNCTION validate_password(TEXT) TO authenticated;
