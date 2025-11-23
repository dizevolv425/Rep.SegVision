-- ================================================
-- SegVision - Supabase Database Schema
-- Migration: Initial setup for authentication and schools
-- ================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. CREATE ENUMS
-- ================================================

-- User type enum
CREATE TYPE user_type AS ENUM ('admin', 'school');

-- School status enum
CREATE TYPE school_status AS ENUM ('active', 'inactive', 'pending');

-- Plan type enum
CREATE TYPE plan_type AS ENUM ('basic', 'pro', 'enterprise');

-- ================================================
-- 2. CREATE TABLES
-- ================================================

-- Schools table
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    plan plan_type NOT NULL DEFAULT 'basic',
    status school_status NOT NULL DEFAULT 'pending',
    contact_name TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    user_type user_type NOT NULL DEFAULT 'school',
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ================================================
-- 3. CREATE INDEXES
-- ================================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_school_id ON public.users(school_id);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_schools_cnpj ON public.schools(cnpj);
CREATE INDEX idx_schools_status ON public.schools(status);

-- ================================================
-- 4. CREATE TRIGGERS FOR UPDATED_AT
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for schools table
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON public.schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 5. CREATE FUNCTION TO HANDLE NEW USER REGISTRATION
-- ================================================

-- Function to create user profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, user_type)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'school')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Users policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
    ON public.users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Admins can insert users
CREATE POLICY "Admins can insert users"
    ON public.users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Allow self-insert (needed for auth.signup trigger)
CREATE POLICY "Users can self insert"
    ON public.users
    FOR INSERT
    WITH CHECK (
        auth.role() = 'service_role'
        OR auth.uid() = id
    );

-- Schools policies
-- Users can read their own school
CREATE POLICY "Users can view own school"
    ON public.schools
    FOR SELECT
    USING (
        id IN (
            SELECT school_id FROM public.users
            WHERE id = auth.uid()
        )
    );

-- Admins can view all schools
CREATE POLICY "Admins can view all schools"
    ON public.schools
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Admins can insert schools
CREATE POLICY "Admins can insert schools"
    ON public.schools
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Admins can update schools
CREATE POLICY "Admins can update schools"
    ON public.schools
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Users can update their own school
CREATE POLICY "Users can update own school"
    ON public.schools
    FOR UPDATE
    USING (
        id IN (
            SELECT school_id FROM public.users
            WHERE id = auth.uid()
        )
    );

-- Allow public insert during registration (will be refined later)
CREATE POLICY "Allow public school creation during registration"
    ON public.schools
    FOR INSERT
    WITH CHECK (true);

-- ================================================
-- 7. GRANT PERMISSIONS
-- ================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.schools TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT INSERT ON public.schools TO anon;

-- ================================================
-- 8. CREATE ADMIN USER (OPTIONAL - FOR TESTING)
-- ================================================

-- This section should be run AFTER creating your first admin user via Supabase Auth
-- Replace 'ADMIN_USER_UUID' with the actual UUID from auth.users

-- Example (DO NOT RUN YET):
-- UPDATE public.users
-- SET user_type = 'admin'
-- WHERE id = 'ADMIN_USER_UUID';

-- ================================================
-- END OF MIGRATION
-- ================================================
