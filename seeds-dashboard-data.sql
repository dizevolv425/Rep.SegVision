-- ================================================
-- SegVision - Dashboard Data Seeds
-- Dados de exemplo para testar o dashboard com dados reais
-- ================================================

-- IMPORTANTE: Este arquivo contém seeds para desenvolvimento/testes.
-- Substitua os UUIDs abaixo pelos IDs reais da sua escola.

-- ================================================
-- VARIÁVEIS (Ajuste conforme necessário)
-- ================================================
-- Execute este bloco primeiro para obter o school_id correto

SELECT id as school_id, name FROM schools LIMIT 1;

-- Após obter o school_id, substitua 'YOUR_SCHOOL_ID_HERE' abaixo

-- ================================================
-- 1. CRIAR ENVIRONMENTS (Espaços/Ambientes)
-- ================================================

-- Inserir environments de exemplo
INSERT INTO public.environments (school_id, name, description)
VALUES
    ('YOUR_SCHOOL_ID_HERE', 'Pátio', 'Área externa de convivência'),
    ('YOUR_SCHOOL_ID_HERE', 'Corredor Principal', 'Corredor de acesso às salas de aula'),
    ('YOUR_SCHOOL_ID_HERE', 'Biblioteca', 'Biblioteca escolar'),
    ('YOUR_SCHOOL_ID_HERE', 'Entrada Principal', 'Portaria e recepção')
ON CONFLICT DO NOTHING;

-- ================================================
-- 2. CRIAR LOCATIONS (Locais)
-- ================================================

-- Pegar IDs dos environments criados
DO $$
DECLARE
    env_patio_id UUID;
    env_corredor_id UUID;
    env_biblioteca_id UUID;
    env_entrada_id UUID;
    school_id_var UUID := 'YOUR_SCHOOL_ID_HERE';
BEGIN
    -- Buscar IDs dos environments
    SELECT id INTO env_patio_id FROM environments WHERE name = 'Pátio' AND school_id = school_id_var;
    SELECT id INTO env_corredor_id FROM environments WHERE name = 'Corredor Principal' AND school_id = school_id_var;
    SELECT id INTO env_biblioteca_id FROM environments WHERE name = 'Biblioteca' AND school_id = school_id_var;
    SELECT id INTO env_entrada_id FROM environments WHERE name = 'Entrada Principal' AND school_id = school_id_var;

    -- Inserir locations
    INSERT INTO public.locations (environment_id, name, description) VALUES
        (env_patio_id, 'Área Central', 'Pátio central descoberto'),
        (env_patio_id, 'Quadra', 'Quadra de esportes'),
        (env_corredor_id, 'Corredor A', 'Ala A - Ensino fundamental I'),
        (env_corredor_id, 'Corredor B', 'Ala B - Ensino fundamental II'),
        (env_biblioteca_id, 'Sala de Leitura', 'Área principal da biblioteca'),
        (env_entrada_id, 'Portaria', 'Entrada principal da escola')
    ON CONFLICT DO NOTHING;
END $$;

-- ================================================
-- 3. CRIAR CÂMERAS
-- ================================================

DO $$
DECLARE
    school_id_var UUID := 'YOUR_SCHOOL_ID_HERE';
    loc_area_central UUID;
    loc_quadra UUID;
    loc_corredor_a UUID;
    loc_corredor_b UUID;
    loc_biblioteca UUID;
    loc_portaria UUID;
BEGIN
    -- Buscar IDs dos locations
    SELECT l.id INTO loc_area_central FROM locations l
    JOIN environments e ON l.environment_id = e.id
    WHERE l.name = 'Área Central' AND e.school_id = school_id_var;

    SELECT l.id INTO loc_quadra FROM locations l
    JOIN environments e ON l.environment_id = e.id
    WHERE l.name = 'Quadra' AND e.school_id = school_id_var;

    SELECT l.id INTO loc_corredor_a FROM locations l
    JOIN environments e ON l.environment_id = e.id
    WHERE l.name = 'Corredor A' AND e.school_id = school_id_var;

    SELECT l.id INTO loc_corredor_b FROM locations l
    JOIN environments e ON l.environment_id = e.id
    WHERE l.name = 'Corredor B' AND e.school_id = school_id_var;

    SELECT l.id INTO loc_biblioteca FROM locations l
    JOIN environments e ON l.environment_id = e.id
    WHERE l.name = 'Sala de Leitura' AND e.school_id = school_id_var;

    SELECT l.id INTO loc_portaria FROM locations l
    JOIN environments e ON l.environment_id = e.id
    WHERE l.name = 'Portaria' AND e.school_id = school_id_var;

    -- Inserir câmeras
    INSERT INTO public.cameras (school_id, location_id, name, rtsp_url, status, ai_enabled, facial_recognition, people_count, sensitivity) VALUES
        (school_id_var, loc_area_central, 'Câmera Pátio 01', 'rtsp://192.168.1.101/stream', 'online', true, true, true, 'media'),
        (school_id_var, loc_quadra, 'Câmera Quadra 01', 'rtsp://192.168.1.102/stream', 'online', true, false, true, 'media'),
        (school_id_var, loc_corredor_a, 'Câmera Corredor A', 'rtsp://192.168.1.103/stream', 'ativa', true, true, true, 'alta'),
        (school_id_var, loc_corredor_b, 'Câmera Corredor B', 'rtsp://192.168.1.104/stream', 'ativa', true, true, true, 'alta'),
        (school_id_var, loc_biblioteca, 'Câmera Biblioteca', 'rtsp://192.168.1.105/stream', 'online', true, false, false, 'baixa'),
        (school_id_var, loc_portaria, 'Câmera Entrada Principal', 'rtsp://192.168.1.106/stream', 'online', true, true, true, 'alta'),
        (school_id_var, NULL, 'Câmera Offline Teste', 'rtsp://192.168.1.107/stream', 'offline', false, false, false, 'media'),
        (school_id_var, NULL, 'Câmera Inativa Teste', 'rtsp://192.168.1.108/stream', 'inativa', false, false, false, 'media')
    ON CONFLICT DO NOTHING;
END $$;

-- ================================================
-- 4. CRIAR ALERTAS (últimas 24h)
-- ================================================

DO $$
DECLARE
    school_id_var UUID := 'YOUR_SCHOOL_ID_HERE';
    cam_patio UUID;
    cam_entrada UUID;
    cam_corredor_b UUID;
    cam_biblioteca UUID;
    cam_quadra UUID;
BEGIN
    -- Buscar IDs das câmeras
    SELECT id INTO cam_patio FROM cameras WHERE name = 'Câmera Pátio 01' AND school_id = school_id_var;
    SELECT id INTO cam_entrada FROM cameras WHERE name = 'Câmera Entrada Principal' AND school_id = school_id_var;
    SELECT id INTO cam_corredor_b FROM cameras WHERE name = 'Câmera Corredor B' AND school_id = school_id_var;
    SELECT id INTO cam_biblioteca FROM cameras WHERE name = 'Câmera Biblioteca' AND school_id = school_id_var;
    SELECT id INTO cam_quadra FROM cameras WHERE name = 'Câmera Quadra 01' AND school_id = school_id_var;

    -- Inserir alertas distribuídos nas últimas 24h
    INSERT INTO public.alerts (school_id, camera_id, type, title, description, status, severity, created_at) VALUES
        -- Alertas de hoje
        (school_id_var, cam_patio, 'intrusion', 'Movimento após horário', 'Detecção de movimento no pátio fora do horário de aula', 'novo', 'alta', NOW() - INTERVAL '45 minutes'),
        (school_id_var, cam_entrada, 'face', 'Pessoa não autorizada', 'Reconhecimento facial identificou pessoa não cadastrada', 'novo', 'alta', NOW() - INTERVAL '1 hour 15 minutes'),
        (school_id_var, cam_corredor_b, 'crowd', 'Aglomeração detectada', 'Concentração de pessoas acima do normal no corredor', 'confirmado', 'media', NOW() - INTERVAL '2 hours'),
        (school_id_var, cam_biblioteca, 'object', 'Objeto suspeito', 'Objeto não identificado deixado na biblioteca', 'novo', 'media', NOW() - INTERVAL '2 hours 45 minutes'),

        -- Alertas do início da tarde
        (school_id_var, cam_quadra, 'aggression', 'Possível briga', 'Comportamento agressivo detectado na quadra', 'resolvido', 'alta', NOW() - INTERVAL '4 hours'),
        (school_id_var, cam_patio, 'fall', 'Queda detectada', 'Pessoa em queda no pátio', 'resolvido', 'alta', NOW() - INTERVAL '5 hours'),
        (school_id_var, cam_entrada, 'intrusion', 'Acesso não autorizado', 'Tentativa de entrada fora do horário', 'confirmado', 'media', NOW() - INTERVAL '6 hours'),

        -- Alertas do período da manhã
        (school_id_var, cam_corredor_b, 'crowd', 'Aglomeração no intervalo', 'Muitos alunos concentrados no corredor', 'resolvido', 'baixa', NOW() - INTERVAL '8 hours'),
        (school_id_var, cam_biblioteca, 'intrusion', 'Movimento em área restrita', 'Movimento detectado em horário de fechamento', 'falso', 'baixa', NOW() - INTERVAL '10 hours'),
        (school_id_var, cam_quadra, 'object', 'Mochila abandonada', 'Objeto esquecido na quadra', 'resolvido', 'baixa', NOW() - INTERVAL '12 hours'),

        -- Alertas da madrugada/ontem
        (school_id_var, cam_entrada, 'intrusion', 'Movimento noturno', 'Detecção de movimento na entrada durante a noite', 'confirmado', 'alta', NOW() - INTERVAL '15 hours'),
        (school_id_var, cam_patio, 'face', 'Pessoa desconhecida', 'Reconhecimento facial sem correspondência', 'resolvido', 'media', NOW() - INTERVAL '18 hours'),
        (school_id_var, cam_corredor_b, 'crowd', 'Aglomeração final do dia', 'Concentração de pessoas na saída', 'resolvido', 'baixa', NOW() - INTERVAL '20 hours'),
        (school_id_var, cam_biblioteca, 'object', 'Objeto esquecido', 'Item deixado na biblioteca', 'resolvido', 'baixa', NOW() - INTERVAL '22 hours')
    ON CONFLICT DO NOTHING;
END $$;

-- ================================================
-- 5. ATUALIZAR AI_ACCURACY NA ESCOLA
-- ================================================

UPDATE public.schools
SET ai_accuracy = 94.00
WHERE id = 'YOUR_SCHOOL_ID_HERE';

-- ================================================
-- 6. CRIAR CONTATOS DE EMERGÊNCIA (Opcional)
-- ================================================

INSERT INTO public.contacts (school_id, name, role, phone, email, receive_whatsapp) VALUES
    ('YOUR_SCHOOL_ID_HERE', 'Segurança Escolar', 'Coordenador de Segurança', '(11) 98765-4321', 'seguranca@escola.com.br', true),
    ('YOUR_SCHOOL_ID_HERE', 'Direção', 'Diretor(a)', '(11) 98765-4322', 'direcao@escola.com.br', true),
    ('YOUR_SCHOOL_ID_HERE', 'Polícia Militar', 'Ronda Escolar', '190', 'pm@escola.com.br', false)
ON CONFLICT DO NOTHING;

-- ================================================
-- 7. VERIFICAÇÃO DOS DADOS INSERIDOS
-- ================================================

DO $$
DECLARE
    school_id_var UUID := 'YOUR_SCHOOL_ID_HERE';
    env_count INT;
    loc_count INT;
    cam_count INT;
    alert_count INT;
BEGIN
    SELECT COUNT(*) INTO env_count FROM environments WHERE school_id = school_id_var;
    SELECT COUNT(*) INTO loc_count FROM locations l
        JOIN environments e ON l.environment_id = e.id
        WHERE e.school_id = school_id_var;
    SELECT COUNT(*) INTO cam_count FROM cameras WHERE school_id = school_id_var;
    SELECT COUNT(*) INTO alert_count FROM alerts WHERE school_id = school_id_var;

    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ Seeds executados com sucesso!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Dados inseridos:';
    RAISE NOTICE '  📍 Environments (Espaços): %', env_count;
    RAISE NOTICE '  📌 Locations (Locais): %', loc_count;
    RAISE NOTICE '  📹 Câmeras: %', cam_count;
    RAISE NOTICE '  🚨 Alertas: %', alert_count;
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Dashboard está pronto para uso!';
    RAISE NOTICE '==============================================';
END $$;

-- ================================================
-- INSTRUÇÕES DE USO
-- ================================================

/*
COMO EXECUTAR ESTE ARQUIVO:

1. Obtenha o school_id correto:
   SELECT id, name FROM schools LIMIT 1;

2. Substitua TODAS as ocorrências de 'YOUR_SCHOOL_ID_HERE' pelo ID real.

3. Execute o arquivo SQL no Supabase SQL Editor:
   - Dashboard > SQL Editor > New Query
   - Cole o conteúdo do arquivo (já com os IDs substituídos)
   - Clique em "Run"

4. Verifique os dados inseridos:
   SELECT * FROM environments WHERE school_id = 'SEU_ID_AQUI';
   SELECT * FROM cameras WHERE school_id = 'SEU_ID_AQUI';
   SELECT * FROM alerts WHERE school_id = 'SEU_ID_AQUI' ORDER BY created_at DESC;

5. Acesse o dashboard e veja os dados reais!

NOTA: Os alertas são criados com timestamps nas últimas 24 horas,
então você verá gráficos e estatísticas realistas.
*/
