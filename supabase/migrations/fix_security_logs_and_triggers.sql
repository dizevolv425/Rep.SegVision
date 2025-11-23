-- ========================================
-- Migration: Fix Security Logs and Triggers
-- ========================================
-- Corrige função log_security_event para usar full_name
-- Adiciona trigger de updated_at para security_settings
-- Adiciona policy de INSERT para security_logs
-- ========================================

-- 1. Corrigir função log_security_event
DROP FUNCTION IF EXISTS log_security_event(TEXT, TEXT, TEXT, UUID, JSONB);

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
    SELECT email, full_name INTO v_user_email, v_user_name
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

GRANT EXECUTE ON FUNCTION log_security_event(security_event_type, TEXT, security_log_severity, UUID, JSONB) TO authenticated;

-- 2. Criar trigger para atualizar updated_at em security_settings
CREATE OR REPLACE FUNCTION update_security_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS security_settings_updated_at ON public.security_settings;
CREATE TRIGGER security_settings_updated_at
  BEFORE UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_security_settings_updated_at();

-- 3. Adicionar policy de INSERT para security_logs (permite SECURITY DEFINER functions)
DROP POLICY IF EXISTS "Service role can insert security logs" ON public.security_logs;
CREATE POLICY "Service role can insert security logs"
  ON public.security_logs
  FOR INSERT
  WITH CHECK (true);

-- 4. Verificar se trigger de auditoria existe
DROP TRIGGER IF EXISTS security_settings_audit ON public.security_settings;
CREATE TRIGGER security_settings_audit
  AFTER UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION audit_security_settings_changes();

DROP TRIGGER IF EXISTS users_audit ON public.users;
CREATE TRIGGER users_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION audit_internal_user_changes();

-- Comentários
COMMENT ON FUNCTION log_security_event IS 'Função SECURITY DEFINER para registrar eventos de segurança com informações do usuário';
COMMENT ON TRIGGER security_settings_updated_at ON public.security_settings IS 'Atualiza automaticamente o campo updated_at';
COMMENT ON POLICY "Service role can insert security logs" ON public.security_logs IS 'Permite inserção via funções SECURITY DEFINER';
