-- ================================================
-- SegVision - Admin Dashboard Data Migration
-- Migration: Criar view e índices para dashboard administrativo
-- ================================================

-- ================================================
-- 1. CRIAR VIEW PARA ESTATÍSTICAS DO ADMIN DASHBOARD
-- ================================================

CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    -- Escolas
    (SELECT COUNT(*) FROM schools WHERE status = 'active') as escolas_ativas,
    (SELECT COUNT(*) FROM schools) as escolas_total,
    (SELECT COUNT(*) FROM schools
     WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as escolas_novas_mes,
    (SELECT COUNT(*) FROM schools
     WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')) as escolas_mes_anterior,

    -- Receita
    (SELECT COALESCE(SUM(amount), 0) FROM invoices
     WHERE status = 'paid'
     AND DATE_TRUNC('month', paid_date) = DATE_TRUNC('month', CURRENT_DATE)) as receita_mensal,
    (SELECT COALESCE(SUM(amount), 0) FROM invoices
     WHERE status = 'paid'
     AND DATE_TRUNC('month', paid_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')) as receita_mes_anterior,
    (SELECT COALESCE(SUM(amount), 0) FROM invoices
     WHERE status = 'paid'
     AND paid_date >= CURRENT_DATE - INTERVAL '6 months') as receita_total_6m,

    -- Usuários
    (SELECT COUNT(*) FROM users) as usuarios_totais,
    (SELECT COUNT(*) FROM users
     WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as usuarios_novos_semana,
    (SELECT COUNT(*) FROM users
     WHERE created_at >= CURRENT_DATE - INTERVAL '14 days'
     AND created_at < CURRENT_DATE - INTERVAL '7 days') as usuarios_semana_anterior,

    -- Sistema
    (SELECT COUNT(*) FROM cameras) as cameras_totais,
    (SELECT COUNT(*) FROM cameras
     WHERE status IN ('online', 'ativa')) as cameras_online,
    (SELECT COUNT(*) FROM alerts
     WHERE DATE(created_at) = CURRENT_DATE) as alertas_processados_hoje,

    -- Meta
    NOW() as updated_at;

COMMENT ON VIEW admin_dashboard_stats IS
'View com estatísticas agregadas para o dashboard administrativo. Inclui métricas de escolas, receita, usuários e sistema.';

-- ================================================
-- 2. CRIAR ÍNDICES PARA OTIMIZAR QUERIES DO ADMIN DASHBOARD
-- ================================================

-- Índice para receita mensal por data de pagamento
CREATE INDEX IF NOT EXISTS idx_invoices_paid_date
ON public.invoices(paid_date DESC)
WHERE status = 'paid';

-- Índice para escolas por status e data de criação
CREATE INDEX IF NOT EXISTS idx_schools_status_created
ON public.schools(status, created_at DESC);

-- Índice para usuários por data de criação
CREATE INDEX IF NOT EXISTS idx_users_created_at
ON public.users(created_at DESC);

-- ================================================
-- 3. VERIFICAR/CRIAR POLÍTICAS RLS PARA ADMIN
-- ================================================

-- Garantir que admin pode ver todas as escolas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'schools'
        AND policyname = 'Admins can view all schools'
    ) THEN
        CREATE POLICY "Admins can view all schools"
        ON public.schools FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.users
                WHERE id = auth.uid() AND user_type = 'admin'
            )
        );
    END IF;
END $$;

-- Garantir que admin pode ver todas as invoices
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'invoices'
        AND policyname = 'Admins can view all invoices'
    ) THEN
        CREATE POLICY "Admins can view all invoices"
        ON public.invoices FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.users
                WHERE id = auth.uid() AND user_type = 'admin'
            )
        );
    END IF;
END $$;

-- Garantir que admin pode ver todos os usuários
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'users'
        AND policyname = 'Admins can view all users'
    ) THEN
        CREATE POLICY "Admins can view all users"
        ON public.users FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = auth.uid() AND u.user_type = 'admin'
            )
        );
    END IF;
END $$;

-- ================================================
-- FIM DA MIGRATION
-- ================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration Admin Dashboard concluída com sucesso!';
    RAISE NOTICE '📊 View admin_dashboard_stats disponível';
    RAISE NOTICE '🔍 Índices criados para otimização';
    RAISE NOTICE '🔐 Políticas RLS verificadas para admin';
END $$;
