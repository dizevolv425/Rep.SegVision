-- ================================================
-- DIAGNOSTIC: What's blocking the schools insert?
-- Run this to see the current state
-- ================================================

-- 1. Check RLS status
SELECT
  'RLS STATUS' as check_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('users', 'schools')
  AND schemaname = 'public';

-- 2. List ALL policies on schools table
SELECT
  'SCHOOLS POLICIES' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'schools';

-- 3. Check grants on schools
SELECT
  'SCHOOLS GRANTS' as check_type,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name = 'schools'
ORDER BY grantee, privilege_type;

-- 4. Check if there are any RESTRICTIVE policies
SELECT
  'RESTRICTIVE POLICIES' as check_type,
  tablename,
  policyname,
  permissive
FROM pg_policies
WHERE tablename = 'schools'
  AND permissive = 'RESTRICTIVE';

-- 5. Show auth configuration (if accessible)
SELECT
  'CURRENT ROLE' as check_type,
  current_user as current_role,
  session_user as session_role;
