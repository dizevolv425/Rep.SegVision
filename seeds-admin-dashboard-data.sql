-- ================================================
-- SegVision - Admin Dashboard Seeds
-- Dados de exemplo para testar o admin dashboard com dados reais
-- ================================================

-- IMPORTANTE: Este arquivo cria dados históricos de invoices
-- e escolas para popular os gráficos e métricas do admin dashboard

-- ================================================
-- 1. CRIAR INVOICES DOS ÚLTIMOS 6 MESES
-- ================================================

DO $$
DECLARE
    school_id_var UUID := '4d2f150e-b51e-4ecf-9a7b-56d7eadc8d5b'; -- Escola de teste
    mes INT;
    valor_base NUMERIC;
BEGIN
    -- Inserir invoices dos últimos 6 meses com valores crescentes
    FOR mes IN 0..5 LOOP
        -- Valor base crescente (simular crescimento)
        valor_base := 45000 + (mes * 4000) + (RANDOM() * 5000);

        INSERT INTO public.invoices (
            school_id,
            amount,
            status,
            due_date,
            paid_date,
            reference_month,
            created_at
        ) VALUES (
            school_id_var,
            valor_base,
            'paid',
            (CURRENT_DATE - INTERVAL '1 month' * mes) + INTERVAL '5 days',
            (CURRENT_DATE - INTERVAL '1 month' * mes) + INTERVAL '3 days',
            TO_CHAR(CURRENT_DATE - INTERVAL '1 month' * mes, 'YYYY-MM'),
            CURRENT_DATE - INTERVAL '1 month' * mes
        )
        ON CONFLICT DO NOTHING;
    END LOOP;

    RAISE NOTICE '✅ Criadas 6 invoices de exemplo (últimos 6 meses)';
END $$;

-- ================================================
-- 2. CRIAR HISTÓRICO DE ESCOLAS (últimos 6 meses)
-- ================================================

DO $$
DECLARE
    mes INT;
    escolas_criar INT;
    i INT;
BEGIN
    -- Criar escolas distribuídas nos últimos 6 meses
    FOR mes IN 0..5 LOOP
        -- Quantidade de escolas por mês (crescente)
        escolas_criar := 2 + (mes * 1);

        FOR i IN 1..escolas_criar LOOP
            INSERT INTO public.schools (
                name,
                cnpj,
                plan,
                status,
                contact_name,
                contact_email,
                created_at
            ) VALUES (
                'Escola Exemplo ' || TO_CHAR(CURRENT_DATE - INTERVAL '1 month' * mes, 'Mon/YYYY') || ' #' || i,
                LPAD((14000000000000::BIGINT + (mes * 1000000) + i)::TEXT, 14, '0'),
                (ARRAY['basic', 'pro', 'enterprise'])[1 + FLOOR(RANDOM() * 3)],
                (ARRAY['active', 'pending'])[1 + FLOOR(RANDOM() * 2)],
                'Responsável ' || i,
                'escola' || mes || '_' || i || '@exemplo.com',
                CURRENT_DATE - INTERVAL '1 month' * mes - INTERVAL '1 day' * (i - 1)
            )
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

    RAISE NOTICE '✅ Criadas escolas de exemplo distribuídas nos últimos 6 meses';
END $$;

-- ================================================
-- 3. CRIAR USUÁRIOS DE EXEMPLO
-- ================================================

-- Nota: Usuários precisam existir em auth.users primeiro
-- Este seed apenas garante que temos alguns usuários de teste

-- Verificar quantos usuários temos
DO $$
DECLARE
    total_usuarios INT;
BEGIN
    SELECT COUNT(*) INTO total_usuarios FROM users;
    RAISE NOTICE '📊 Total de usuários no sistema: %', total_usuarios;
END $$;

-- ================================================
-- 4. VERIFICAR DADOS CRIADOS
-- ================================================

DO $$
DECLARE
    total_invoices INT;
    total_schools INT;
    total_users INT;
    total_cameras INT;
    total_alerts_today INT;
BEGIN
    -- Contar dados
    SELECT COUNT(*) INTO total_invoices FROM invoices WHERE status = 'paid';
    SELECT COUNT(*) INTO total_schools FROM schools;
    SELECT COUNT(*) INTO total_users FROM users;
    SELECT COUNT(*) INTO total_cameras FROM cameras;
    SELECT COUNT(*) INTO total_alerts_today FROM alerts WHERE DATE(created_at) = CURRENT_DATE;

    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ Seeds Admin Dashboard executados!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Dados inseridos:';
    RAISE NOTICE '  💰 Invoices pagas: %', total_invoices;
    RAISE NOTICE '  🏫 Escolas: %', total_schools;
    RAISE NOTICE '  👥 Usuários: %', total_users;
    RAISE NOTICE '  📹 Câmeras: %', total_cameras;
    RAISE NOTICE '  🚨 Alertas hoje: %', total_alerts_today;
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Admin Dashboard está pronto para uso!';
    RAISE NOTICE '============================================';
END $$;

-- ================================================
-- 5. TESTAR VIEW admin_dashboard_stats
-- ================================================

SELECT * FROM admin_dashboard_stats;

-- ================================================
-- INSTRUÇÕES DE USO
-- ================================================

/*
COMO EXECUTAR ESTE ARQUIVO:

1. Execute a migration primeiro (database-migrations-admin-dashboard.sql)

2. Execute este arquivo de seeds no SQL Editor:
   - Dashboard > SQL Editor > New Query
   - Cole o conteúdo do arquivo
   - Clique em "Run"

3. Verifique os dados criados:
   SELECT * FROM admin_dashboard_stats;
   SELECT * FROM invoices ORDER BY created_at DESC LIMIT 10;
   SELECT * FROM schools ORDER BY created_at DESC LIMIT 10;

4. Acesse o admin dashboard e veja os dados reais!

NOTA: Os dados são criados com timestamps distribuídos nos últimos 6 meses
para simular um histórico realista.
*/
