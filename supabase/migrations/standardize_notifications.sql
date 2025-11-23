-- ========================================
-- Migration: Standardize Notification Types
-- ========================================
-- Padroniza os tipos de notificação em todo o sistema
-- Tipos unificados: 'alert' | 'school' | 'contract' | 'payment' | 'system'
-- ========================================

-- Apenas adicionar comentário e índice (não forçar migração de tipos)
-- Isso permite que a aplicação use os tipos corretos sem quebrar dados existentes

DO $$
BEGIN
  -- Verificar se a tabela notifications existe
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'notifications'
  ) THEN
    -- Adicionar comentário na coluna type (se existir)
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'notifications'
      AND column_name = 'type'
    ) THEN
      EXECUTE 'COMMENT ON COLUMN public.notifications.type IS ''Tipo da notificação: alert (alertas de segurança), school (escolas), contract (contratos), payment (pagamentos), system (sistema)''';
    END IF;

    -- Criar índice para melhor performance
    CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
  END IF;
END $$;
