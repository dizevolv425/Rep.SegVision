-- ================================================
-- DIAGNOSTIC SCRIPT: Check current database state
-- Execute this in Supabase SQL Editor to verify everything
-- ================================================

-- 1. Check if tables exist
SELECT 'TABLES' as check_type,
       table_name,
       'EXISTS' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'schools')
ORDER BY table_name;

-- 2. Check RLS status
SELECT 'RLS STATUS' as check_type,
       tablename as table_name,
       rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'schools');

-- 3. Check policies on USERS table
SELECT 'USERS POLICIES' as check_type,
       policyname as policy_name,
       cmd as command,
       roles,
       CASE
         WHEN qual IS NOT NULL THEN 'HAS USING'
         ELSE 'NO USING'
       END as using_clause,
       CASE
         WHEN with_check IS NOT NULL THEN 'HAS CHECK'
         ELSE 'NO CHECK'
       END as check_clause
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- 4. Check policies on SCHOOLS table
SELECT 'SCHOOLS POLICIES' as check_type,
       policyname as policy_name,
       cmd as command,
       roles,
       CASE
         WHEN qual IS NOT NULL THEN 'HAS USING'
         ELSE 'NO USING'
       END as using_clause,
       CASE
         WHEN with_check IS NOT NULL THEN 'HAS CHECK'
         ELSE 'NO CHECK'
       END as check_clause
FROM pg_policies
WHERE tablename = 'schools'
ORDER BY policyname;

-- 5. Check trigger exists
SELECT 'TRIGGER STATUS' as check_type,
       tgname as trigger_name,
       tgrelid::regclass as table_name,
       CASE tgenabled
         WHEN 'O' THEN 'ENABLED'
         WHEN 'D' THEN 'DISABLED'
         ELSE 'UNKNOWN'
       END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 6. Check function exists
SELECT 'FUNCTION STATUS' as check_type,
       proname as function_name,
       prosecdef as is_security_definer,
       'EXISTS' as status
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 7. Check grants on schools table
SELECT 'SCHOOLS GRANTS' as check_type,
       grantee,
       privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name = 'schools'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;

-- 8. Check grants on users table
SELECT 'USERS GRANTS' as check_type,
       grantee,
       privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;

-- ================================================
-- EXPECTED RESULTS:
-- ================================================
-- TABLES: Both 'users' and 'schools' should exist
-- RLS STATUS: Both tables should have rls_enabled = true
-- USERS POLICIES: Should have 4 policies (select, insert service_role, insert own, update)
-- SCHOOLS POLICIES: Should have 3 policies (select, insert, update)
-- TRIGGER STATUS: Should show 'on_auth_user_created' as ENABLED
-- FUNCTION STATUS: Should show 'handle_new_user' with is_security_definer = true
-- SCHOOLS GRANTS: 'anon' should have INSERT, 'authenticated' should have SELECT, INSERT, UPDATE
-- USERS GRANTS: 'authenticated' should have SELECT, INSERT, UPDATE
