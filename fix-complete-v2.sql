-- ================================================
-- COMPREHENSIVE FIX V2: Force clean and rebuild
-- Execute this in Supabase SQL Editor
-- ================================================

-- ================================================
-- 1. DISABLE RLS TEMPORARILY
-- ================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools DISABLE ROW LEVEL SECURITY;

-- ================================================
-- 2. DROP ALL EXISTING POLICIES (FORCE)
-- ================================================

-- Users policies - drop ALL possible variations
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

-- Schools policies - drop ALL possible variations
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
-- 3. RECREATE TRIGGER FOR USER CREATION
-- ================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert user profile in public.users
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
    -- Log error but don't fail the signup
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 4. CREATE SIMPLIFIED RLS POLICIES (NO RECURSION)
-- ================================================

-- USERS TABLE POLICIES
-- --------------------------------------------

-- Allow users to read their own profile
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow service_role to insert (used by trigger)
CREATE POLICY "users_insert_service_role"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to insert their own profile
-- This is needed if trigger fails
CREATE POLICY "users_insert_own"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SCHOOLS TABLE POLICIES
-- --------------------------------------------

-- Allow authenticated users to read their own school
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

-- Allow both authenticated AND anonymous users to insert schools
-- This is critical for the registration flow
CREATE POLICY "schools_insert_all"
  ON public.schools
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Allow users to update their own school
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
-- 5. RE-ENABLE RLS
-- ================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 6. GRANT NECESSARY PERMISSIONS
-- ================================================

-- Revoke all first to ensure clean state
REVOKE ALL ON public.schools FROM anon, authenticated;
REVOKE ALL ON public.users FROM anon, authenticated;

-- Grant specific permissions
GRANT INSERT ON public.schools TO anon;
GRANT INSERT ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.schools TO authenticated;

-- ================================================
-- DONE!
-- ================================================
-- Run verify-database.sql next to confirm everything is correct
