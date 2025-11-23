-- ========================================
-- Migration: Create Alert Audit Tables
-- ========================================
-- Tabelas para rastreamento completo do ciclo de vida dos alertas

-- ========================================
-- 1. Alert Status History
-- ========================================
-- Rastreia todas as mudanças de status de um alerta

CREATE TABLE IF NOT EXISTS public.alert_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES public.alerts(id) ON DELETE CASCADE,
    old_status alert_status,
    new_status alert_status NOT NULL,
    changed_by_user_id UUID REFERENCES public.users(id),
    changed_by_role TEXT,
    notes TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para queries de timeline
CREATE INDEX IF NOT EXISTS idx_alert_status_history_alert ON public.alert_status_history(alert_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_status_history_user ON public.alert_status_history(changed_by_user_id);

-- RLS Policies
ALTER TABLE public.alert_status_history ENABLE ROW LEVEL SECURITY;

-- Admins podem ver todo histórico
CREATE POLICY "Admins can view all status history"
    ON public.alert_status_history
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.user_type = 'admin'
        )
    );

-- Escolas podem ver histórico de seus alertas
CREATE POLICY "Schools can view their alert history"
    ON public.alert_status_history
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.alerts a
            INNER JOIN public.users u ON u.id = auth.uid()
            WHERE a.id = alert_status_history.alert_id
            AND a.school_id = u.school_id
            AND u.user_type = 'school'
        )
    );

-- Comentários
COMMENT ON TABLE public.alert_status_history IS 'Histórico completo de mudanças de status dos alertas';
COMMENT ON COLUMN public.alert_status_history.old_status IS 'Status anterior (NULL para criação inicial)';
COMMENT ON COLUMN public.alert_status_history.new_status IS 'Novo status aplicado';
COMMENT ON COLUMN public.alert_status_history.changed_by_role IS 'Papel do usuário que fez a mudança';
COMMENT ON COLUMN public.alert_status_history.notes IS 'Observações sobre a mudança de status';

-- ========================================
-- 2. Trigger para Registrar Mudanças Automaticamente
-- ========================================

-- Função que registra mudanças de status automaticamente
CREATE OR REPLACE FUNCTION log_alert_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Somente registra se o status mudou
    IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.alert_status_history (
            alert_id,
            old_status,
            new_status,
            changed_by_user_id,
            changed_by_role
        ) VALUES (
            NEW.id,
            CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
            NEW.status,
            NEW.action_by_user_id,
            CASE
                WHEN NEW.status IN ('resolvido', 'falso') THEN NEW.resolved_by_role
                WHEN NEW.status = 'confirmado' THEN NEW.analyzed_by_role
                ELSE NULL
            END
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger no INSERT e UPDATE de alertas
DROP TRIGGER IF EXISTS trigger_log_alert_status_change ON public.alerts;
CREATE TRIGGER trigger_log_alert_status_change
    AFTER INSERT OR UPDATE OF status ON public.alerts
    FOR EACH ROW
    EXECUTE FUNCTION log_alert_status_change();

-- ========================================
-- 3. Popular Histórico de Alertas Existentes
-- ========================================

-- Criar entrada inicial para alertas já existentes (simulado)
INSERT INTO public.alert_status_history (alert_id, old_status, new_status, changed_at, changed_by_user_id, changed_by_role)
SELECT
    id as alert_id,
    NULL as old_status,
    'novo' as new_status,
    created_at as changed_at,
    NULL as changed_by_user_id,
    NULL as changed_by_role
FROM public.alerts
WHERE NOT EXISTS (
    SELECT 1 FROM public.alert_status_history WHERE alert_id = alerts.id
);

-- Criar entrada de confirmação para alertas confirmados
INSERT INTO public.alert_status_history (alert_id, old_status, new_status, changed_at, changed_by_user_id, changed_by_role)
SELECT
    id as alert_id,
    'novo' as old_status,
    'confirmado' as new_status,
    analysis_started_at as changed_at,
    analysis_started_by_user_id as changed_by_user_id,
    analyzed_by_role as changed_by_role
FROM public.alerts
WHERE status IN ('confirmado', 'resolvido', 'falso')
  AND analysis_started_at IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM public.alert_status_history
      WHERE alert_id = alerts.id AND new_status = 'confirmado'
  );

-- Criar entrada de resolução para alertas resolvidos/falsos
INSERT INTO public.alert_status_history (alert_id, old_status, new_status, changed_at, changed_by_user_id, changed_by_role)
SELECT
    id as alert_id,
    'confirmado' as old_status,
    status as new_status,
    resolved_at as changed_at,
    action_by_user_id as changed_by_user_id,
    resolved_by_role as changed_by_role
FROM public.alerts
WHERE status IN ('resolvido', 'falso')
  AND resolved_at IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM public.alert_status_history
      WHERE alert_id = alerts.id AND new_status IN ('resolvido', 'falso')
  );
