-- ================================================
-- FINAL FIX: Complete RLS and permissions setup
-- Execute this in Supabase SQL Editor
-- ================================================

-- ================================================
-- 1. ENSURE SCHEMA PERMISSIONS
-- ================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ================================================
-- 2. DISABLE RLS TEMPORARILY
-- ================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools DISABLE ROW LEVEL SECURITY;

-- ================================================
-- 3. DROP ALL EXISTING POLICIES
-- ================================================

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can self insert" ON public.users;
DROP POLICY IF EXISTS "Enable read for own user" ON public.users;
DROP POLICY IF EXISTS "Enable insert for service role only" ON public.users;
DROP POLICY IF EXISTS "Enable update for own user" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_service_role" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Schools policies
DROP POLICY IF EXISTS "Users can view own school" ON public.schools;
DROP POLICY IF EXISTS "Admins can view all schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can insert schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can update schools" ON public.schools;
DROP POLICY IF EXISTS "Users can update own school" ON public.schools;
DROP POLICY IF EXISTS "Allow public school creation during registration" ON public.schools;
DROP POLICY IF EXISTS "Enable read for authenticated" ON public.schools;
DROP POLICY IF EXISTS "Enable insert for authenticated and anon" ON public.schools;
DROP POLICY IF EXISTS "Enable update for authenticated" ON public.schools;
DROP POLICY IF EXISTS "schools_select_own" ON public.schools;
DROP POLICY IF EXISTS "schools_insert_all" ON public.schools;
DROP POLICY IF EXISTS "schools_update_own" ON public.schools;

-- ================================================
-- 4. RECREATE TRIGGER FOR USER CREATION
-- ================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
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
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 5. GRANT TABLE PERMISSIONS (BEFORE RLS)
-- ================================================

-- Schools table - grant ALL permissions to ensure no permission errors
GRANT ALL ON public.schools TO authenticated;
GRANT ALL ON public.schools TO anon;
GRANT ALL ON public.schools TO service_role;

-- Users table - grant ALL permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.users TO service_role;

-- ================================================
-- 6. CREATE RLS POLICIES
-- ================================================

-- USERS POLICIES
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_insert_service_role"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "users_insert_own"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SCHOOLS POLICIES
CREATE POLICY "schools_select_own"
  ON public.schools
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "schools_insert_all"
  ON public.schools
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "schools_update_own"
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

-- ================================================
-- 7. ENABLE RLS
-- ================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 8. VERIFY PERMISSIONS
-- ================================================
-- These queries will show the current state:
-- SELECT grantee, privilege_type FROM information_schema.table_privileges WHERE table_name = 'schools';
-- SELECT policyname FROM pg_policies WHERE tablename = 'schools';
