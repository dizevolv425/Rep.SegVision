-- ========================================
-- Migration: Create Security Logs Table
-- ========================================
-- Tabela para registro de eventos de segurança (audit log)
-- Armazena tentativas de login, mudanças de senha, alterações de configurações, etc.
-- ========================================

-- Criar enum para tipos de eventos de segurança
DO $$ BEGIN
  CREATE TYPE security_event_type AS ENUM (
    'login_success',
    'login_failed',
    'logout',
    'password_changed',
    'password_reset_requested',
    'user_created',
    'user_updated',
    'user_deleted',
    'settings_changed',
    'permissions_changed',
    'two_factor_enabled',
    'two_factor_disabled',
    'session_expired',
    'account_locked'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Criar enum para níveis de severidade
DO $$ BEGIN
  CREATE TYPE security_log_severity AS ENUM (
    'info',
    'warning',
    'critical'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Criar tabela
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informações do evento
  event_type security_event_type NOT NULL,
  severity security_log_severity DEFAULT 'info',

  -- Usuário relacionado
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,

  -- Detalhes do evento
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',

  -- Informações de contexto
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE public.security_logs IS 'Registro de auditoria de eventos de segurança da plataforma';
COMMENT ON COLUMN public.security_logs.event_type IS 'Tipo do evento de segurança';
COMMENT ON COLUMN public.security_logs.severity IS 'Nível de severidade do evento: info, warning, critical';
COMMENT ON COLUMN public.security_logs.user_id IS 'ID do usuário relacionado ao evento (pode ser NULL se usuário foi deletado)';
COMMENT ON COLUMN public.security_logs.user_email IS 'Email do usuário no momento do evento (preservado mesmo se usuário for deletado)';
COMMENT ON COLUMN public.security_logs.user_name IS 'Nome do usuário no momento do evento';
COMMENT ON COLUMN public.security_logs.description IS 'Descrição legível do evento';
COMMENT ON COLUMN public.security_logs.metadata IS 'Dados adicionais do evento em formato JSON';
COMMENT ON COLUMN public.security_logs.ip_address IS 'Endereço IP de origem do evento';
COMMENT ON COLUMN public.security_logs.user_agent IS 'User agent do navegador';
COMMENT ON COLUMN public.security_logs.location IS 'Localização geográfica aproximada (cidade, país)';

-- Habilitar RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas admins podem ler logs de segurança
CREATE POLICY "Only admins can read security logs"
  ON public.security_logs
  FOR SELECT
  USING (is_admin());

-- Policy: Sistema pode inserir logs (SECURITY DEFINER functions)
-- Não criamos policy de INSERT pois será feito via SECURITY DEFINER functions

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at
  ON public.security_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_logs_user_id
  ON public.security_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_security_logs_event_type
  ON public.security_logs(event_type);

CREATE INDEX IF NOT EXISTS idx_security_logs_severity
  ON public.security_logs(severity);

-- Function para registrar evento de segurança
CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type security_event_type,
  p_description TEXT,
  p_severity security_log_severity DEFAULT 'info',
  p_user_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_user_email TEXT;
  v_user_name TEXT;
BEGIN
  -- Buscar informações do usuário se fornecido
  IF p_user_id IS NOT NULL THEN
    SELECT email, name INTO v_user_email, v_user_name
    FROM public.users
    WHERE id = p_user_id;
  END IF;

  -- Inserir log
  INSERT INTO public.security_logs (
    event_type,
    severity,
    user_id,
    user_email,
    user_name,
    description,
    metadata
  )
  VALUES (
    p_event_type,
    p_severity,
    p_user_id,
    v_user_email,
    v_user_name,
    p_description,
    p_metadata
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant para usuários autenticados
GRANT EXECUTE ON FUNCTION log_security_event(security_event_type, TEXT, security_log_severity, UUID, JSONB) TO authenticated;

-- Function para limpar logs antigos (manutenção)
CREATE OR REPLACE FUNCTION cleanup_old_security_logs(p_days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM public.security_logs
  WHERE created_at < NOW() - (p_days_to_keep || ' days')::INTERVAL;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apenas admins podem executar cleanup
REVOKE EXECUTE ON FUNCTION cleanup_old_security_logs(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION cleanup_old_security_logs(INTEGER) TO authenticated;

-- Trigger para registrar mudanças em security_settings
CREATE OR REPLACE FUNCTION audit_security_settings_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_security_event(
    'settings_changed',
    'Configurações de segurança foram alteradas',
    'warning',
    auth.uid(),
    jsonb_build_object(
      'old_values', to_jsonb(OLD),
      'new_values', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER security_settings_audit
  AFTER UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION audit_security_settings_changes();

-- Trigger para registrar criação/atualização/deleção de usuários internos
CREATE OR REPLACE FUNCTION audit_internal_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.user_type = 'admin' THEN
    PERFORM log_security_event(
      'user_created',
      FORMAT('Novo usuário interno criado: %s', NEW.email),
      'info',
      auth.uid(),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' AND NEW.user_type = 'admin' THEN
    PERFORM log_security_event(
      'user_updated',
      FORMAT('Usuário interno atualizado: %s', NEW.email),
      'info',
      auth.uid(),
      jsonb_build_object(
        'old_values', to_jsonb(OLD),
        'new_values', to_jsonb(NEW)
      )
    );
  ELSIF TG_OP = 'DELETE' AND OLD.user_type = 'admin' THEN
    PERFORM log_security_event(
      'user_deleted',
      FORMAT('Usuário interno removido: %s', OLD.email),
      'warning',
      auth.uid(),
      to_jsonb(OLD)
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER users_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION audit_internal_user_changes();
