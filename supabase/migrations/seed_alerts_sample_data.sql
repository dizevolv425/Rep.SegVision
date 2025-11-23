-- ========================================
-- Migration: Seed Intelligent Sample Data for Reports & Audit
-- ========================================
-- Populates alerts table with realistic data covering:
-- - 6 months of historical data for AI precision trends
-- - All alert types, severities, and statuses
-- - Realistic AI metrics (confidence scores, detection times)
-- - Timeline progression (created → viewed → analyzed → resolved)
-- - Multiple schools and cameras
-- ========================================

-- Note: This assumes you have schools and cameras in your database
-- If not, you'll need to create some first

DO $$
DECLARE
    v_school_ids UUID[];
    v_camera_ids UUID[];
    v_user_ids UUID[];
    v_start_date TIMESTAMP;
    v_current_date TIMESTAMP;
    v_alert_id UUID;
    v_school_id UUID;
    v_camera_id UUID;
    v_user_id UUID;
    v_alert_type TEXT;
    v_severity TEXT;
    v_status TEXT;
    v_confidence DECIMAL;
    v_detection_time INTEGER;
    v_created_at TIMESTAMP;
    v_first_viewed_at TIMESTAMP;
    v_analysis_started_at TIMESTAMP;
    v_resolved_at TIMESTAMP;
    i INTEGER;
BEGIN
    -- Get existing school IDs
    SELECT ARRAY_AGG(id) INTO v_school_ids FROM schools LIMIT 5;

    -- Get existing camera IDs
    SELECT ARRAY_AGG(id) INTO v_camera_ids FROM cameras LIMIT 10;

    -- Get existing user IDs (for action_by_user_id)
    SELECT ARRAY_AGG(id) INTO v_user_ids FROM users WHERE user_type IN ('admin', 'school') LIMIT 5;

    -- If no data exists, exit gracefully
    IF v_school_ids IS NULL OR array_length(v_school_ids, 1) = 0 THEN
        RAISE NOTICE 'No schools found. Please create schools before running this seed.';
        RETURN;
    END IF;

    IF v_camera_ids IS NULL OR array_length(v_camera_ids, 1) = 0 THEN
        RAISE NOTICE 'No cameras found. Please create cameras before running this seed.';
        RETURN;
    END IF;

    -- Start from 6 months ago
    v_start_date := CURRENT_TIMESTAMP - INTERVAL '6 months';

    RAISE NOTICE 'Starting seed process...';
    RAISE NOTICE 'Schools available: %', array_length(v_school_ids, 1);
    RAISE NOTICE 'Cameras available: %', array_length(v_camera_ids, 1);

    -- Generate ~500 alerts over 6 months (roughly 3 per day)
    FOR i IN 1..500 LOOP
        -- Random timestamp within the 6-month period
        v_created_at := v_start_date + (random() * INTERVAL '6 months');

        -- Random school and camera
        v_school_id := v_school_ids[1 + floor(random() * array_length(v_school_ids, 1))::int];
        v_camera_id := v_camera_ids[1 + floor(random() * array_length(v_camera_ids, 1))::int];

        -- Random user (if available)
        IF v_user_ids IS NOT NULL AND array_length(v_user_ids, 1) > 0 THEN
            v_user_id := v_user_ids[1 + floor(random() * array_length(v_user_ids, 1))::int];
        ELSE
            v_user_id := NULL;
        END IF;

        -- Distribute alert types realistically
        -- intrusion: 40%, face: 25%, crowd: 15%, camera_offline: 10%, object: 10%
        CASE
            WHEN random() < 0.40 THEN v_alert_type := 'intrusion';
            WHEN random() < 0.65 THEN v_alert_type := 'face';
            WHEN random() < 0.80 THEN v_alert_type := 'crowd';
            WHEN random() < 0.90 THEN v_alert_type := 'camera_offline';
            ELSE v_alert_type := 'object';
        END CASE;

        -- Distribute severities: alta: 30%, media: 50%, baixa: 20%
        CASE
            WHEN random() < 0.30 THEN v_severity := 'alta';
            WHEN random() < 0.80 THEN v_severity := 'media';
            ELSE v_severity := 'baixa';
        END CASE;

        -- Distribute statuses: novo: 10%, confirmado: 15%, resolvido: 65%, falso: 10%
        CASE
            WHEN random() < 0.10 THEN v_status := 'novo';
            WHEN random() < 0.25 THEN v_status := 'confirmado';
            WHEN random() < 0.90 THEN v_status := 'resolvido';
            ELSE v_status := 'falso';
        END CASE;

        -- Confidence scores: higher for resolved, lower for false positives
        IF v_status = 'falso' THEN
            v_confidence := 60 + (random() * 15)::DECIMAL; -- 60-75%
        ELSIF v_status = 'resolvido' THEN
            v_confidence := 85 + (random() * 14)::DECIMAL; -- 85-99%
        ELSE
            v_confidence := 70 + (random() * 25)::DECIMAL; -- 70-95%
        END IF;

        -- Detection time varies by type (in milliseconds)
        CASE v_alert_type
            WHEN 'intrusion' THEN v_detection_time := 100 + floor(random() * 200)::int; -- 100-300ms
            WHEN 'face' THEN v_detection_time := 150 + floor(random() * 250)::int; -- 150-400ms
            WHEN 'crowd' THEN v_detection_time := 200 + floor(random() * 300)::int; -- 200-500ms
            WHEN 'camera_offline' THEN v_detection_time := 50 + floor(random() * 100)::int; -- 50-150ms
            WHEN 'object' THEN v_detection_time := 120 + floor(random() * 180)::int; -- 120-300ms
        END CASE;

        -- Timeline progression
        -- First viewed: 1-30 minutes after creation
        v_first_viewed_at := v_created_at + (1 + random() * 29)::int * INTERVAL '1 minute';

        -- Analysis started: only for confirmado, resolvido, falso
        IF v_status IN ('confirmado', 'resolvido', 'falso') THEN
            v_analysis_started_at := v_first_viewed_at + (1 + random() * 10)::int * INTERVAL '1 minute';
        ELSE
            v_analysis_started_at := NULL;
        END IF;

        -- Resolved: only for resolvido and falso
        IF v_status IN ('resolvido', 'falso') THEN
            -- Resolved within 2-120 minutes after analysis started
            v_resolved_at := v_analysis_started_at + (2 + random() * 118)::int * INTERVAL '1 minute';
        ELSE
            v_resolved_at := NULL;
        END IF;

        -- Insert the alert
        INSERT INTO alerts (
            school_id,
            camera_id,
            action_by_user_id,
            type,
            title,
            description,
            severity,
            status,
            confidence_score,
            detection_time_ms,
            model_version,
            created_at,
            first_viewed_at,
            analysis_started_at,
            resolved_at,
            analyzed_by_role,
            resolved_by_role
        ) VALUES (
            v_school_id,
            v_camera_id,
            v_user_id,
            v_alert_type::alert_type,
            -- Generate contextual title
            CASE v_alert_type
                WHEN 'intrusion' THEN 'Intrusão Detectada'
                WHEN 'face' THEN 'Pessoa Não Autorizada'
                WHEN 'crowd' THEN 'Aglomeração Detectada'
                WHEN 'camera_offline' THEN 'Câmera Offline'
                WHEN 'object' THEN 'Objeto Suspeito Detectado'
            END,
            -- Generate contextual description
            CASE v_alert_type
                WHEN 'intrusion' THEN 'Movimento detectado em área restrita às ' || TO_CHAR(v_created_at, 'HH24:MI')
                WHEN 'face' THEN 'Face não reconhecida detectada no sistema'
                WHEN 'crowd' THEN 'Número de pessoas acima do limite permitido'
                WHEN 'camera_offline' THEN 'Câmera perdeu conexão com o servidor'
                WHEN 'object' THEN 'Objeto suspeito detectado na área monitorada'
            END,
            v_severity::alert_severity,
            v_status::alert_status,
            v_confidence,
            v_detection_time,
            '1.0', -- model_version
            v_created_at,
            v_first_viewed_at,
            v_analysis_started_at,
            v_resolved_at,
            CASE WHEN v_analysis_started_at IS NOT NULL THEN 'monitor' ELSE NULL END,
            CASE WHEN v_resolved_at IS NOT NULL THEN
                CASE WHEN random() < 0.7 THEN 'monitor' ELSE 'admin' END
            ELSE NULL END
        );

        -- The SLA will be auto-calculated by the trigger
        -- The status history will be auto-logged by the trigger when we update status

    END LOOP;

    RAISE NOTICE 'Seed completed: 500 alerts created over 6 months';

    -- Now update alerts to trigger status history logging
    -- We'll update each alert's status to itself to trigger the audit log
    FOR v_alert_id IN (SELECT id FROM alerts WHERE created_at >= v_start_date) LOOP
        UPDATE alerts SET status = status WHERE id = v_alert_id;
    END LOOP;

    RAISE NOTICE 'Status history audit logs created';

END $$;

-- Verify the seed data
DO $$
DECLARE
    v_total_count INTEGER;
    v_last_6_months_count INTEGER;
    v_last_7_days_count INTEGER;
    rec RECORD;
BEGIN
    SELECT COUNT(*) INTO v_total_count FROM alerts;
    SELECT COUNT(*) INTO v_last_6_months_count FROM alerts WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '6 months';
    SELECT COUNT(*) INTO v_last_7_days_count FROM alerts WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'Seed Verification Report';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total alerts in database: %', v_total_count;
    RAISE NOTICE 'Alerts in last 6 months: %', v_last_6_months_count;
    RAISE NOTICE 'Alerts in last 7 days: %', v_last_7_days_count;
    RAISE NOTICE '========================================';

    -- Distribution by type
    RAISE NOTICE 'Distribution by Type:';
    FOR rec IN (
        SELECT type, COUNT(*) as count
        FROM alerts
        WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '6 months'
        GROUP BY type
        ORDER BY count DESC
    ) LOOP
        RAISE NOTICE '  %: %', rec.type, rec.count;
    END LOOP;

    -- Distribution by severity
    RAISE NOTICE 'Distribution by Severity:';
    FOR rec IN (
        SELECT severity, COUNT(*) as count
        FROM alerts
        WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '6 months'
        GROUP BY severity
        ORDER BY count DESC
    ) LOOP
        RAISE NOTICE '  %: %', rec.severity, rec.count;
    END LOOP;

    -- Distribution by status
    RAISE NOTICE 'Distribution by Status:';
    FOR rec IN (
        SELECT status, COUNT(*) as count
        FROM alerts
        WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '6 months'
        GROUP BY status
        ORDER BY count DESC
    ) LOOP
        RAISE NOTICE '  %: %', rec.status, rec.count;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;

-- Refresh materialized views if any exist
-- (none currently, but good practice)

COMMENT ON SCHEMA public IS 'Alerts sample data seeded for Reports & Audit module';
