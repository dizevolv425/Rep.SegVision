-- ========================================
-- Migration: Create Pricing Plans Table
-- ========================================
-- Tabela para gerenciar planos de preços do sistema
-- Permite configuração detalhada de capacidades, features AI, e preços

-- Criar tabela de planos de preços
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL CHECK (char_length(nome) BETWEEN 5 AND 40),
    subtitulo TEXT NOT NULL CHECK (char_length(subtitulo) BETWEEN 5 AND 60),
    capacidade_rtsp INTEGER CHECK (capacidade_rtsp IS NULL OR capacidade_rtsp > 0),
    capacity_over_16 BOOLEAN NOT NULL DEFAULT false,
    ai_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    suporte TEXT NOT NULL CHECK (suporte IN ('padrao', 'prioritario', 'dedicado')),
    historico_alertas BOOLEAN NOT NULL DEFAULT false,
    preco_mensal NUMERIC(10,2) CHECK (preco_mensal IS NULL OR preco_mensal >= 0),
    price_on_request BOOLEAN NOT NULL DEFAULT false,
    observacoes TEXT,
    exibir_publicamente BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_pricing_plans_exibir ON public.pricing_plans(exibir_publicamente);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_created ON public.pricing_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_nome ON public.pricing_plans(nome);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_pricing_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pricing_plans_updated_at
    BEFORE UPDATE ON public.pricing_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_pricing_plans_updated_at();

-- ========================================
-- RLS Policies
-- ========================================

-- Habilitar RLS
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Admins podem fazer tudo
CREATE POLICY "Admins can manage all pricing plans"
    ON public.pricing_plans
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.user_type = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.user_type = 'admin'
        )
    );

-- Policy: Todos podem visualizar planos públicos
CREATE POLICY "Anyone can view public pricing plans"
    ON public.pricing_plans
    FOR SELECT
    TO authenticated
    USING (exibir_publicamente = true);

-- Policy: Escolas podem visualizar seu plano atribuído (preparação futura)
-- (Por enquanto, permite que escolas vejam todos planos públicos)

-- ========================================
-- Seed: Planos Iniciais
-- ========================================

-- Plano 1: Basic
INSERT INTO public.pricing_plans (
    nome,
    subtitulo,
    capacidade_rtsp,
    capacity_over_16,
    ai_features,
    suporte,
    historico_alertas,
    preco_mensal,
    price_on_request,
    observacoes,
    exibir_publicamente
) VALUES (
    'Standard',
    'Ideal para escolas de pequeno porte',
    10,
    false,
    '[
        {
            "id": "detecaoObjetos",
            "nome": "Detecção de Objetos/Ações",
            "descricao": "Identificação de armas, agressões e quedas em tempo real",
            "enabled": true,
            "consumo": "moderado"
        },
        {
            "id": "reconhecimentoFacial",
            "nome": "Reconhecimento Facial",
            "descricao": "Comparação de rostos detectados com base de riscos",
            "enabled": false,
            "consumo": "alto"
        }
    ]'::jsonb,
    'padrao',
    false,
    299.00,
    false,
    'Plano básico com detecção de objetos e ações. Limite de 10 câmeras RTSP.',
    true
) ON CONFLICT DO NOTHING;

-- Plano 2: Premium (Pro)
INSERT INTO public.pricing_plans (
    nome,
    subtitulo,
    capacidade_rtsp,
    capacity_over_16,
    ai_features,
    suporte,
    historico_alertas,
    preco_mensal,
    price_on_request,
    observacoes,
    exibir_publicamente
) VALUES (
    'Premium',
    'Monitoramento avançado para escolas médias',
    30,
    false,
    '[
        {
            "id": "detecaoObjetos",
            "nome": "Detecção de Objetos/Ações",
            "descricao": "Identificação de armas, agressões e quedas em tempo real",
            "enabled": true,
            "consumo": "moderado"
        },
        {
            "id": "reconhecimentoFacial",
            "nome": "Reconhecimento Facial",
            "descricao": "Comparação de rostos detectados com base de riscos",
            "enabled": true,
            "consumo": "alto"
        }
    ]'::jsonb,
    'prioritario',
    true,
    599.00,
    false,
    'Plano recomendado para a maioria das escolas. Inclui todas as features de IA e suporte prioritário.',
    true
) ON CONFLICT DO NOTHING;

-- Plano 3: Enterprise
INSERT INTO public.pricing_plans (
    nome,
    subtitulo,
    capacidade_rtsp,
    capacity_over_16,
    ai_features,
    suporte,
    historico_alertas,
    preco_mensal,
    price_on_request,
    observacoes,
    exibir_publicamente
) VALUES (
    'Enterprise',
    'Solução completa para grandes instituições',
    NULL,
    true,
    '[
        {
            "id": "detecaoObjetos",
            "nome": "Detecção de Objetos/Ações",
            "descricao": "Identificação de armas, agressões e quedas em tempo real",
            "enabled": true,
            "consumo": "moderado"
        },
        {
            "id": "reconhecimentoFacial",
            "nome": "Reconhecimento Facial",
            "descricao": "Comparação de rostos detectados com base de riscos",
            "enabled": true,
            "consumo": "alto"
        }
    ]'::jsonb,
    'dedicado',
    true,
    1499.00,
    false,
    'Plano empresarial com capacidade ilimitada de câmeras e suporte dedicado.',
    true
) ON CONFLICT DO NOTHING;

-- ========================================
-- Comentários da tabela
-- ========================================

COMMENT ON TABLE public.pricing_plans IS 'Planos de preços do SegVision com configurações detalhadas de features e capacidades';
COMMENT ON COLUMN public.pricing_plans.nome IS 'Nome do plano (5-40 caracteres)';
COMMENT ON COLUMN public.pricing_plans.subtitulo IS 'Descrição curta do plano (5-60 caracteres)';
COMMENT ON COLUMN public.pricing_plans.capacidade_rtsp IS 'Limite de câmeras RTSP (NULL = ilimitado)';
COMMENT ON COLUMN public.pricing_plans.capacity_over_16 IS 'Flag indicando capacidade ilimitada (>16 câmeras)';
COMMENT ON COLUMN public.pricing_plans.ai_features IS 'Array JSON de features de IA disponíveis no plano';
COMMENT ON COLUMN public.pricing_plans.suporte IS 'Nível de suporte: padrao, prioritario, dedicado';
COMMENT ON COLUMN public.pricing_plans.historico_alertas IS 'Acesso completo ao histórico de alertas';
COMMENT ON COLUMN public.pricing_plans.preco_mensal IS 'Preço mensal em reais (NULL = sob consulta)';
COMMENT ON COLUMN public.pricing_plans.price_on_request IS 'Flag indicando se preço é sob consulta';
COMMENT ON COLUMN public.pricing_plans.observacoes IS 'Notas internas sobre o plano';
COMMENT ON COLUMN public.pricing_plans.exibir_publicamente IS 'Se plano deve ser exibido na página pública de preços';
