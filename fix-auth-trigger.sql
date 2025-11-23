-- ================================================
-- FIX: Corrige o trigger de criação de usuário
-- ================================================

-- 1. Remove o trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Recria a função com melhor tratamento de erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insere o usuário na tabela public.users
  INSERT INTO public.users (
    id,
    email,
    full_name,
    user_type,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'school'),
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log do erro mas não falha o signup
    RAISE WARNING 'Erro ao criar perfil de usuário: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Recria o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Atualiza a policy de insert para permitir o trigger
DROP POLICY IF EXISTS "Users can self insert" ON public.users;
CREATE POLICY "Users can self insert"
  ON public.users
  FOR INSERT
  WITH CHECK (
    -- Permite service_role (usado pelo trigger)
    auth.role() = 'service_role'
    -- OU permite o próprio usuário inserir seu registro
    OR auth.uid() = id
  );

-- 5. Garante que a policy de insert de schools permite anon
DROP POLICY IF EXISTS "Allow public school creation during registration" ON public.schools;
CREATE POLICY "Allow public school creation during registration"
  ON public.schools
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 6. Permite authenticated users atualizarem a tabela users (para associar school_id)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMIT;
