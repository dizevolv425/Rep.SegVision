-- ========================================
-- Migration: Create Platform Settings Table
-- ========================================
-- Tabela para armazenar configurações da plataforma (logo, nome)
-- Single-row table: sempre terá apenas 1 linha
-- ========================================

-- Criar tabela
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL DEFAULT 'SegVision',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE public.platform_settings IS 'Configurações da plataforma (logo, nome). Single-row table.';
COMMENT ON COLUMN public.platform_settings.platform_name IS 'Nome da plataforma exibido na interface';
COMMENT ON COLUMN public.platform_settings.logo_url IS 'URL do logotipo da plataforma no Supabase Storage';

-- Insert default row (single row table)
INSERT INTO public.platform_settings (platform_name)
VALUES ('SegVision')
ON CONFLICT DO NOTHING;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_settings_updated_at();

-- Habilitar RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um pode ler (para exibir logo/nome na UI)
CREATE POLICY "Anyone can read platform settings"
  ON public.platform_settings
  FOR SELECT
  USING (true);

-- Policy: Apenas admins podem atualizar (usa função is_admin() para evitar recursão RLS)
CREATE POLICY "Only admins can update platform settings"
  ON public.platform_settings
  FOR UPDATE
  USING (is_admin());

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_platform_settings_updated_at ON public.platform_settings(updated_at DESC);
