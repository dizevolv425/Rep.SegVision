-- ========================================
-- Migration: Create User Notification Preferences
-- ========================================
-- Tabela para armazenar preferências de notificação por usuário
-- Permite que cada usuário configure quais tipos de notificação deseja receber
-- ========================================

-- Criar tabela
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Preferências por categoria
  security_alerts BOOLEAN DEFAULT true,
  new_contracts BOOLEAN DEFAULT true,
  payment_reminders BOOLEAN DEFAULT true,
  school_updates BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT false,

  -- Canais de notificação
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Garantir apenas uma linha por usuário
  UNIQUE(user_id)
);

-- Comentários
COMMENT ON TABLE public.user_notification_preferences IS 'Preferências de notificação configuradas por cada usuário';
COMMENT ON COLUMN public.user_notification_preferences.security_alerts IS 'Receber notificações de alertas de segurança';
COMMENT ON COLUMN public.user_notification_preferences.new_contracts IS 'Receber notificações de novos contratos';
COMMENT ON COLUMN public.user_notification_preferences.payment_reminders IS 'Receber lembretes de vencimento de pagamento';
COMMENT ON COLUMN public.user_notification_preferences.school_updates IS 'Receber atualizações sobre escolas';
COMMENT ON COLUMN public.user_notification_preferences.weekly_reports IS 'Receber relatórios semanais por email';
COMMENT ON COLUMN public.user_notification_preferences.email_enabled IS 'Habilitar notificações por email';
COMMENT ON COLUMN public.user_notification_preferences.push_enabled IS 'Habilitar notificações push';
COMMENT ON COLUMN public.user_notification_preferences.in_app_enabled IS 'Habilitar notificações na aplicação';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_notification_preferences_updated_at
  BEFORE UPDATE ON public.user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_notification_preferences_updated_at();

-- Habilitar RLS
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver suas próprias preferências
CREATE POLICY "Users can view own notification preferences"
  ON public.user_notification_preferences
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Usuários podem criar suas próprias preferências
CREATE POLICY "Users can create own notification preferences"
  ON public.user_notification_preferences
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Usuários podem atualizar suas próprias preferências
CREATE POLICY "Users can update own notification preferences"
  ON public.user_notification_preferences
  FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Admins podem ver todas as preferências
CREATE POLICY "Admins can view all notification preferences"
  ON public.user_notification_preferences
  FOR SELECT
  USING (is_admin());

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id
  ON public.user_notification_preferences(user_id);

-- Function helper para obter preferências com defaults
CREATE OR REPLACE FUNCTION get_user_notification_preferences(p_user_id UUID)
RETURNS TABLE (
  security_alerts BOOLEAN,
  new_contracts BOOLEAN,
  payment_reminders BOOLEAN,
  school_updates BOOLEAN,
  weekly_reports BOOLEAN,
  email_enabled BOOLEAN,
  push_enabled BOOLEAN,
  in_app_enabled BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(unp.security_alerts, true),
    COALESCE(unp.new_contracts, true),
    COALESCE(unp.payment_reminders, true),
    COALESCE(unp.school_updates, true),
    COALESCE(unp.weekly_reports, false),
    COALESCE(unp.email_enabled, true),
    COALESCE(unp.push_enabled, true),
    COALESCE(unp.in_app_enabled, true)
  FROM public.user_notification_preferences unp
  WHERE unp.user_id = p_user_id
  UNION ALL
  SELECT true, true, true, true, false, true, true, true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_notification_preferences
    WHERE user_id = p_user_id
  )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant para usuários autenticados
GRANT EXECUTE ON FUNCTION get_user_notification_preferences(UUID) TO authenticated;
