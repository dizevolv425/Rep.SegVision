-- ========================================
-- Migration: Create Storage Buckets and Policies
-- ========================================
-- Cria buckets para avatars e platform-assets
-- Configura RLS policies para uploads
-- ========================================

-- 1. Criar bucket para avatars (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 2. Criar bucket para platform-assets (logos, branding)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'platform-assets',
  'platform-assets',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas para bucket avatars
DROP POLICY IF EXISTS "avatars_select" ON storage.objects;
CREATE POLICY "avatars_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_insert" ON storage.objects;
CREATE POLICY "avatars_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_update" ON storage.objects;
CREATE POLICY "avatars_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_delete" ON storage.objects;
CREATE POLICY "avatars_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');

-- 4. Políticas para bucket platform-assets
DROP POLICY IF EXISTS "platform_assets_select" ON storage.objects;
CREATE POLICY "platform_assets_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'platform-assets');

DROP POLICY IF EXISTS "platform_assets_insert" ON storage.objects;
CREATE POLICY "platform_assets_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'platform-assets');

DROP POLICY IF EXISTS "platform_assets_update" ON storage.objects;
CREATE POLICY "platform_assets_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'platform-assets');

DROP POLICY IF EXISTS "platform_assets_delete" ON storage.objects;
CREATE POLICY "platform_assets_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'platform-assets');

-- Comentários
COMMENT ON TABLE storage.buckets IS 'Buckets do Supabase Storage para armazenar arquivos';
