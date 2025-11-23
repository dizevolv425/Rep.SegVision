-- ================================================
-- FIX: Remove recursão infinita nas policies
-- ================================================

-- 1. Desabilita RLS temporariamente para limpar
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools DISABLE ROW LEVEL SECURITY;

-- 2. Remove TODAS as policies antigas
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can self insert" ON public.users;

DROP POLICY IF EXISTS "Users can view own school" ON public.schools;
DROP POLICY IF EXISTS "Admins can view all schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can insert schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can update schools" ON public.schools;
DROP POLICY IF EXISTS "Users can update own school" ON public.schools;
DROP POLICY IF EXISTS "Allow public school creation during registration" ON public.schools;

-- 3. Cria policies SIMPLES sem recursão
-- USERS POLICIES
CREATE POLICY "Enable read for own user"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for service role only"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Enable update for own user"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SCHOOLS POLICIES
CREATE POLICY "Enable read for authenticated"
  ON public.schools
  FOR SELECT
  TO authenticated
  USING (
    -- Usuário pode ver sua própria escola OU é service_role
    id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Enable insert for authenticated and anon"
  ON public.schools
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated"
  ON public.schools
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- 4. Reabilita RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- 5. Verifica o trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE 'Trigger não existe. Criando...';

    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

COMMIT;
