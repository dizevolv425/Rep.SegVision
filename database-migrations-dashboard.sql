-- ================================================
-- SegVision - Dashboard Data Migration
-- Migration: Ajustes para substituir dados mock por dados reais
-- ================================================

-- ================================================
-- 1. ATUALIZAR ENUM camera_status
-- ================================================
-- Adicionar novos status para câmeras: ativa, inativa
-- Nota: PostgreSQL não permite adicionar valores a enums de forma condicional diretamente
-- Verificamos se os valores já existem antes de adicionar

DO $$
BEGIN
    -- Adicionar 'ativa' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'ativa'
        AND enumtypid = 'camera_status'::regtype
    ) THEN
        ALTER TYPE camera_status ADD VALUE 'ativa';
    END IF;

    -- Adicionar 'inativa' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'inativa'
        AND enumtypid = 'camera_status'::regtype
    ) THEN
        ALTER TYPE camera_status ADD VALUE 'inativa';
    END IF;
END $$;

-- ================================================
-- 2. ADICIONAR TIPOS DE ALERTA CONFORME PRD
-- ================================================
-- Adicionar tipos de alerta mencionados no PRD:
-- - fall (quedas/desmaios)
-- - aggression (agressão física/brigas)
-- - weapon (armas - específico)

DO $$
BEGIN
    -- Adicionar 'fall' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'fall'
        AND enumtypid = 'alert_type'::regtype
    ) THEN
        ALTER TYPE alert_type ADD VALUE 'fall';
    END IF;

    -- Adicionar 'aggression' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'aggression'
        AND enumtypid = 'alert_type'::regtype
    ) THEN
        ALTER TYPE alert_type ADD VALUE 'aggression';
    END IF;

    -- Adicionar 'weapon' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'weapon'
        AND enumtypid = 'alert_type'::regtype
    ) THEN
        ALTER TYPE alert_type ADD VALUE 'weapon';
    END IF;
END $$;

-- ================================================
-- 3. ADICIONAR CAMPO DE TAXA DE DETECÇÃO
-- ================================================
-- Adicionar campo ai_accuracy na tabela schools
-- Este campo armazena a taxa de detecção da IA em porcentagem (0-100)

ALTER TABLE public.schools
ADD COLUMN IF NOT EXISTS ai_accuracy DECIMAL(5,2) DEFAULT 94.00;

COMMENT ON COLUMN public.schools.ai_accuracy IS
'Taxa de detecção da IA em porcentagem (0-100). Representa a acurácia do sistema em identificar eventos corretamente.';

-- ================================================
-- 4. CRIAR ÍNDICES PARA OTIMIZAR QUERIES DO DASHBOARD
-- ================================================
-- Índices para melhorar performance das queries de dashboard

-- Índice composto para buscar alertas recentes por escola
CREATE INDEX IF NOT EXISTS idx_alerts_school_created
ON public.alerts(school_id, created_at DESC);

-- Índice para filtrar alertas críticos (alta severidade)
CREATE INDEX IF NOT EXISTS idx_alerts_severity_created
ON public.alerts(severity, created_at DESC)
WHERE severity = 'alta';

-- Índice para contar câmeras ativas por escola
CREATE INDEX IF NOT EXISTS idx_cameras_school_status
ON public.cameras(school_id, status);

-- Índice para agrupar alertas por hora (usado no gráfico)
CREATE INDEX IF NOT EXISTS idx_alerts_created_hour
ON public.alerts(school_id, DATE_TRUNC('hour', created_at));

-- ================================================
-- 5. CRIAR VIEW PARA ESTATÍSTICAS DO DASHBOARD
-- ================================================
-- View materializada para otimizar queries de estatísticas
-- Atualizar a cada 5 minutos via pg_cron ou trigger

CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    s.id as school_id,
    s.name as school_name,
    s.ai_accuracy,

    -- Câmeras ativas (online ou ativa)
    (SELECT COUNT(*)
     FROM cameras c
     WHERE c.school_id = s.id
     AND c.status IN ('online', 'ativa')) as cameras_ativas,

    -- Total de câmeras
    (SELECT COUNT(*)
     FROM cameras c
     WHERE c.school_id = s.id) as cameras_total,

    -- Alertas nas últimas 24h
    (SELECT COUNT(*)
     FROM alerts a
     WHERE a.school_id = s.id
     AND a.created_at >= NOW() - INTERVAL '24 hours') as alertas_24h,

    -- Alertas ontem (para comparação)
    (SELECT COUNT(*)
     FROM alerts a
     WHERE a.school_id = s.id
     AND a.created_at >= NOW() - INTERVAL '48 hours'
     AND a.created_at < NOW() - INTERVAL '24 hours') as alertas_ontem,

    -- Incidentes críticos (últimas 24h)
    (SELECT COUNT(*)
     FROM alerts a
     WHERE a.school_id = s.id
     AND a.severity = 'alta'
     AND a.created_at >= NOW() - INTERVAL '24 hours') as incidentes_criticos_24h,

    -- Incidentes críticos ontem
    (SELECT COUNT(*)
     FROM alerts a
     WHERE a.school_id = s.id
     AND a.severity = 'alta'
     AND a.created_at >= NOW() - INTERVAL '48 hours'
     AND a.created_at < NOW() - INTERVAL '24 hours') as incidentes_criticos_ontem,

    NOW() as updated_at
FROM schools s;

COMMENT ON VIEW dashboard_stats IS
'View com estatísticas agregadas para o dashboard. Inclui contadores de câmeras, alertas e incidentes.';

-- ================================================
-- 6. ATUALIZAR POLÍTICAS RLS PARA DASHBOARD
-- ================================================
-- Garantir que as políticas RLS permitam acesso aos dados do dashboard

-- Política para view dashboard_stats (escolas veem próprios dados)
-- Nota: Views herdam RLS das tabelas base, mas vamos documentar

-- Verificar se alertas tem política de SELECT para escolas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'alerts'
        AND policyname = 'Schools can view own alerts'
    ) THEN
        CREATE POLICY "Schools can view own alerts"
        ON public.alerts FOR SELECT
        USING (
            school_id IN (
                SELECT school_id FROM public.users WHERE id = auth.uid()
            )
        );
    END IF;
END $$;

-- Verificar se alertas tem política de SELECT para admins
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'alerts'
        AND policyname = 'Admins can view all alerts'
    ) THEN
        CREATE POLICY "Admins can view all alerts"
        ON public.alerts FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.users
                WHERE id = auth.uid() AND user_type = 'admin'
            )
        );
    END IF;
END $$;

-- Verificar se cameras tem política de SELECT para escolas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'cameras'
        AND policyname = 'Schools can view own cameras'
    ) THEN
        CREATE POLICY "Schools can view own cameras"
        ON public.cameras FOR SELECT
        USING (
            school_id IN (
                SELECT school_id FROM public.users WHERE id = auth.uid()
            )
        );
    END IF;
END $$;

-- Verificar se cameras tem política de SELECT para admins
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'cameras'
        AND policyname = 'Admins can view all cameras'
    ) THEN
        CREATE POLICY "Admins can view all cameras"
        ON public.cameras FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.users
                WHERE id = auth.uid() AND user_type = 'admin'
            )
        );
    END IF;
END $$;

-- ================================================
-- 7. FUNÇÃO HELPER PARA CALCULAR VARIAÇÃO
-- ================================================
-- Função para calcular variação percentual e formatar texto de mudança

CREATE OR REPLACE FUNCTION calculate_change_text(
    current_value INTEGER,
    previous_value INTEGER,
    period_text TEXT DEFAULT 'desde ontem'
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    difference INTEGER;
    change_text TEXT;
BEGIN
    difference := current_value - previous_value;

    IF difference > 0 THEN
        change_text := '+' || difference || ' ' || period_text;
    ELSIF difference < 0 THEN
        change_text := difference || ' ' || period_text;
    ELSE
        change_text := 'Sem alteração';
    END IF;

    RETURN change_text;
END;
$$;

COMMENT ON FUNCTION calculate_change_text IS
'Calcula o texto de variação entre dois valores (ex: "+3 desde ontem", "-1 desde ontem")';

-- ================================================
-- FIM DA MIGRATION
-- ================================================

-- Verificação final
DO $$
BEGIN
    RAISE NOTICE '✅ Migration concluída com sucesso!';
    RAISE NOTICE '📊 Enums atualizados: camera_status, alert_type';
    RAISE NOTICE '📈 Campo adicionado: schools.ai_accuracy';
    RAISE NOTICE '🔍 Índices criados para otimização';
    RAISE NOTICE '👁️ View dashboard_stats disponível';
    RAISE NOTICE '🔐 Políticas RLS verificadas';
END $$;
