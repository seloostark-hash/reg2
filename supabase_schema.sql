-- ==============================================================================
-- HACKTIVATORS EVENT PLATFORM - SUPABASE DATABASE SCHEMA
-- Project Reference: mwqohvrgimpfyduaxrow
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/mwqohvrgimpfyduaxrow/sql)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    school TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    group_name TEXT NOT NULL CHECK (group_name IN ('A', 'B', 'C', 'D')),
    qr_code_token TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create Workshop Ratings & Feedback Table
CREATE TABLE IF NOT EXISTS public.workshop_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_email TEXT NOT NULL,
    workshop_id TEXT NOT NULL CHECK (workshop_id IN ('emotional_intelligence', 'block_programming', 'game_dev', 'design_basics')),
    rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE (student_id, workshop_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_ratings ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Policies for Anon key (Public event registration & attendance verification)
DROP POLICY IF EXISTS "Public full access on students" ON public.students;
CREATE POLICY "Public full access on students" ON public.students
    FOR ALL 
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on workshop_ratings" ON public.workshop_ratings;
CREATE POLICY "Public full access on workshop_ratings" ON public.workshop_ratings
    FOR ALL 
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
