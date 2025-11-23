-- ========================================
-- Migration: Enhance Alerts Table
-- ========================================
-- Adiciona campos para rastreamento de IA, SLA e timeline de alertas

-- Adicionar colunas de metadados de IA
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
ADD COLUMN IF NOT EXISTS detection_time_ms INTEGER CHECK (detection_time_ms >= 0),
ADD COLUMN IF NOT EXISTS model_version TEXT DEFAULT '1.0';

-- Adicionar colunas de timeline e SLA
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS first_viewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS first_viewed_by_user_id UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS analysis_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS analysis_started_by_user_id UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS analyzed_by_role TEXT,
ADD COLUMN IF NOT EXISTS resolved_by_role TEXT;

-- Adicionar coluna de SLA (calculada via trigger)
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS sla_minutes INTEGER;

-- Função para calcular SLA automaticamente
CREATE OR REPLACE FUNCTION calculate_alert_sla()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.resolved_at IS NOT NULL THEN
    NEW.sla_minutes := EXTRACT(EPOCH FROM (NEW.resolved_at - NEW.created_at))::INTEGER / 60;
  ELSE
    NEW.sla_minutes := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar SLA quando alerta for resolvido
DROP TRIGGER IF EXISTS trigger_calculate_alert_sla ON public.alerts;
CREATE TRIGGER trigger_calculate_alert_sla
  BEFORE INSERT OR UPDATE OF resolved_at ON public.alerts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_alert_sla();

-- Comentários nas novas colunas
COMMENT ON COLUMN public.alerts.confidence_score IS 'Nível de confiança da detecção IA (0-100%)';
COMMENT ON COLUMN public.alerts.detection_time_ms IS 'Tempo de detecção do evento em milissegundos';
COMMENT ON COLUMN public.alerts.model_version IS 'Versão do modelo de IA que detectou o evento';
COMMENT ON COLUMN public.alerts.first_viewed_at IS 'Timestamp da primeira visualização do alerta';
COMMENT ON COLUMN public.alerts.first_viewed_by_user_id IS 'Usuário que visualizou o alerta pela primeira vez';
COMMENT ON COLUMN public.alerts.analysis_started_at IS 'Timestamp do início da análise do alerta';
COMMENT ON COLUMN public.alerts.analysis_started_by_user_id IS 'Usuário que iniciou a análise';
COMMENT ON COLUMN public.alerts.analyzed_by_role IS 'Papel do usuário que analisou (Admin/Coordenador/etc)';
COMMENT ON COLUMN public.alerts.resolved_by_role IS 'Papel do usuário que resolveu o alerta';
COMMENT ON COLUMN public.alerts.sla_minutes IS 'Tempo total de resolução em minutos (calculado automaticamente)';

-- Criar índices para performance em queries de relatórios
CREATE INDEX IF NOT EXISTS idx_alerts_created_at_desc ON public.alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_school_created ON public.alerts(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_type_severity ON public.alerts(type, severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status_severity ON public.alerts(status, severity);
CREATE INDEX IF NOT EXISTS idx_alerts_confidence ON public.alerts(confidence_score) WHERE confidence_score IS NOT NULL;

-- Popular dados existentes com valores padrão simulados
-- (Confidence score aleatório entre 85-99% para alertas sem score)
UPDATE public.alerts
SET
  confidence_score = 85 + (RANDOM() * 14)::NUMERIC(5,2),
  detection_time_ms = (50 + (RANDOM() * 450))::INTEGER,
  model_version = '1.0'
WHERE confidence_score IS NULL;

-- Simular first_viewed_at para alertas antigos (alguns minutos após criação)
UPDATE public.alerts
SET first_viewed_at = created_at + (INTERVAL '1 minute' * (1 + RANDOM() * 30))
WHERE first_viewed_at IS NULL AND status != 'novo';

-- Simular analysis_started_at (entre visualização e resolução)
UPDATE public.alerts
SET analysis_started_at = first_viewed_at + (INTERVAL '1 minute' * (1 + RANDOM() * 15))
WHERE analysis_started_at IS NULL
  AND first_viewed_at IS NOT NULL
  AND status IN ('confirmado', 'resolvido', 'falso');

-- Atribuir roles padrão baseado no status
UPDATE public.alerts
SET
  analyzed_by_role = CASE
    WHEN action_by_user_id IS NOT NULL THEN 'Administrador da Escola'
    ELSE NULL
  END,
  resolved_by_role = CASE
    WHEN status IN ('resolvido', 'falso') THEN 'Administrador da Escola'
    ELSE NULL
  END
WHERE analyzed_by_role IS NULL OR resolved_by_role IS NULL;

-- Calcular SLA para alertas já resolvidos
UPDATE public.alerts
SET sla_minutes = EXTRACT(EPOCH FROM (resolved_at - created_at))::INTEGER / 60
WHERE resolved_at IS NOT NULL AND sla_minutes IS NULL;
