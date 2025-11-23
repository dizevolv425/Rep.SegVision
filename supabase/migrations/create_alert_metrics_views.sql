-- ========================================
-- Migration: Create Alert Metrics Views
-- ========================================
-- Views otimizadas para queries de relatórios e métricas

-- ========================================
-- 1. View: Métricas Diárias de Alertas
-- ========================================
-- Agrupa alertas por escola e dia

CREATE OR REPLACE VIEW alert_metrics_daily AS
SELECT
    a.school_id,
    s.name as school_name,
    DATE(a.created_at) as metric_date,

    -- Contadores gerais
    COUNT(*) as total_alerts,

    -- Por severidade
    COUNT(*) FILTER (WHERE a.severity = 'alta') as high_severity_count,
    COUNT(*) FILTER (WHERE a.severity = 'media') as medium_severity_count,
    COUNT(*) FILTER (WHERE a.severity = 'baixa') as low_severity_count,

    -- Por tipo
    COUNT(*) FILTER (WHERE a.type = 'intrusion') as intrusion_count,
    COUNT(*) FILTER (WHERE a.type = 'face') as face_recognition_count,
    COUNT(*) FILTER (WHERE a.type = 'crowd') as crowd_count,
    COUNT(*) FILTER (WHERE a.type = 'camera_offline') as camera_offline_count,
    COUNT(*) FILTER (WHERE a.type = 'object') as object_detection_count,

    -- Por status
    COUNT(*) FILTER (WHERE a.status = 'novo') as new_count,
    COUNT(*) FILTER (WHERE a.status = 'confirmado') as confirmed_count,
    COUNT(*) FILTER (WHERE a.status = 'resolvido') as resolved_count,
    COUNT(*) FILTER (WHERE a.status = 'falso') as false_positive_count,

    -- Métricas de IA
    AVG(a.confidence_score) as avg_confidence,
    AVG(a.detection_time_ms) as avg_detection_time_ms,

    -- Métricas de SLA
    AVG(a.sla_minutes) FILTER (WHERE a.sla_minutes IS NOT NULL) as avg_sla_minutes,
    COUNT(*) FILTER (WHERE a.sla_minutes IS NOT NULL) as resolved_alerts_count

FROM public.alerts a
INNER JOIN public.schools s ON a.school_id = s.id
GROUP BY a.school_id, s.name, DATE(a.created_at);

COMMENT ON VIEW alert_metrics_daily IS 'Métricas diárias agregadas de alertas por escola';

-- ========================================
-- 2. View: Log Completo de Alertas para Relatórios
-- ========================================
-- Inclui todas as informações necessárias para a tab

a Log de Alertas

CREATE OR REPLACE VIEW alert_log_complete AS
SELECT
    a.id,
    a.created_at,
    a.type,
    a.title,
    a.description,
    a.severity,
    a.status,
    a.confidence_score,
    a.detection_time_ms,
    a.sla_minutes,
    a.first_viewed_at,
    a.analysis_started_at,
    a.resolved_at,

    -- Escola
    s.id as school_id,
    s.name as school_name,
    s.plan as school_plan,

    -- Câmera
    c.id as camera_id,
    c.name as camera_name,
    c.rtsp_url as camera_url,

    -- Localização
    l.id as location_id,
    l.name as location_name,
    e.id as environment_id,
    e.name as environment_name,

    -- Usuários e roles
    u_action.id as action_by_user_id,
    u_action.full_name as action_by_user_name,
    a.analyzed_by_role,
    a.resolved_by_role,

    -- Timeline (primeira e última mudança de status)
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'old_status', ash.old_status,
                'new_status', ash.new_status,
                'changed_at', ash.changed_at,
                'changed_by_role', ash.changed_by_role,
                'notes', ash.notes
            ) ORDER BY ash.changed_at ASC
        )
        FROM public.alert_status_history ash
        WHERE ash.alert_id = a.id
    ) as status_timeline

FROM public.alerts a
INNER JOIN public.schools s ON a.school_id = s.id
LEFT JOIN public.cameras c ON a.camera_id = c.id
LEFT JOIN public.locations l ON c.location_id = l.id
LEFT JOIN public.environments e ON l.environment_id = e.id
LEFT JOIN public.users u_action ON a.action_by_user_id = u_action.id;

COMMENT ON VIEW alert_log_complete IS 'View completa de alertas com todas as informações para relatórios';

-- ========================================
-- 3. View: Métricas de Confiabilidade da IA
-- ========================================
-- Agrupa métricas de IA por tipo de evento

CREATE OR REPLACE VIEW ai_reliability_metrics AS
SELECT
    a.type as event_type,

    -- Contadores
    COUNT(*) as total_detections,
    COUNT(*) FILTER (WHERE a.status = 'resolvido') as true_positives,
    COUNT(*) FILTER (WHERE a.status = 'falso') as false_positives,

    -- Taxas calculadas
    ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'resolvido')::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
        2
    ) as accuracy_rate,

    ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'falso')::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
        2
    ) as false_positive_rate,

    -- Métricas de confiança
    ROUND(AVG(a.confidence_score), 2) as avg_confidence,
    ROUND(MIN(a.confidence_score), 2) as min_confidence,
    ROUND(MAX(a.confidence_score), 2) as max_confidence,

    -- Distribuição de confiança
    COUNT(*) FILTER (WHERE a.confidence_score >= 90) as high_confidence_count,
    COUNT(*) FILTER (WHERE a.confidence_score >= 70 AND a.confidence_score < 90) as medium_confidence_count,
    COUNT(*) FILTER (WHERE a.confidence_score < 70) as low_confidence_count,

    -- Tempo médio de detecção
    ROUND(AVG(a.detection_time_ms)::NUMERIC, 0) as avg_detection_time_ms

FROM public.alerts a
WHERE a.confidence_score IS NOT NULL
GROUP BY a.type;

COMMENT ON VIEW ai_reliability_metrics IS 'Métricas de confiabilidade e performance da IA por tipo de evento';

-- ========================================
-- 4. View: Evolução Mensal da Precisão da IA
-- ========================================
-- Tendência de precisão nos últimos 6 meses

CREATE OR REPLACE VIEW ai_precision_monthly AS
SELECT
    TO_CHAR(DATE_TRUNC('month', a.created_at), 'Mon') as month,
    DATE_TRUNC('month', a.created_at) as month_date,

    -- Precisão geral do mês
    ROUND(
        (COUNT(*) FILTER (WHERE a.status = 'resolvido')::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
        2
    ) as precision,

    -- Confiança média
    ROUND(AVG(a.confidence_score), 2) as avg_confidence,

    -- Total de detecções
    COUNT(*) as total_detections

FROM public.alerts a
WHERE a.created_at >= CURRENT_DATE - INTERVAL '6 months'
  AND a.confidence_score IS NOT NULL
GROUP BY DATE_TRUNC('month', a.created_at)
ORDER BY month_date ASC;

COMMENT ON VIEW ai_precision_monthly IS 'Evolução mensal da precisão da IA nos últimos 6 meses';

-- ========================================
-- 5. View: Distribuição de Confiança
-- ========================================
-- Para o gráfico de barras na aba IA

CREATE OR REPLACE VIEW confidence_distribution AS
SELECT
    CASE
        WHEN confidence_score >= 90 THEN '90-100%'
        WHEN confidence_score >= 80 THEN '80-89%'
        WHEN confidence_score >= 70 THEN '70-79%'
        WHEN confidence_score >= 60 THEN '60-69%'
        ELSE '<60%'
    END as confidence_range,
    COUNT(*) as count,
    CASE
        WHEN confidence_score >= 90 THEN 1
        WHEN confidence_score >= 80 THEN 2
        WHEN confidence_score >= 70 THEN 3
        WHEN confidence_score >= 60 THEN 4
        ELSE 5
    END as sort_order
FROM public.alerts
WHERE confidence_score IS NOT NULL
GROUP BY confidence_range, sort_order
ORDER BY sort_order;

COMMENT ON VIEW confidence_distribution IS 'Distribuição de alertas por faixa de confiança da IA';
