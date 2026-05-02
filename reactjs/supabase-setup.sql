-- 1. Create the user_generations table
CREATE TABLE IF NOT EXISTS public.user_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    title TEXT,
    prompt TEXT NOT NULL,
    description TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Force add the url column in case the table already existed without it!
ALTER TABLE public.user_generations ADD COLUMN IF NOT EXISTS url TEXT;

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE public.user_generations ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for the table (Clerk doesn't use Supabase Auth native by default, so if passing JWT, it works. 
-- Assuming anon key is used right now, we will allow all for ease of use, OR if you are using Clerk custom JWT, we can filter.
-- Since the frontend uses user_id directly from useUser() to insert/fetch, we allow select/insert/update based on the frontend logic.
-- NOTE: In production with Clerk, you should verify the JWT, but here we provide a permissive policy to allow frontend inserts and updates.
CREATE POLICY "Enable read access for all users" ON public.user_generations FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.user_generations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.user_generations FOR UPDATE USING (true);

-- 4. Create the Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('user_assets', 'user_assets', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Enable Storage Policies
CREATE POLICY "Give public access to user_assets" ON storage.objects FOR SELECT USING (bucket_id = 'user_assets');
CREATE POLICY "Allow uploads to user_assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user_assets');
CREATE POLICY "Allow updates to user_assets" ON storage.objects FOR UPDATE USING (bucket_id = 'user_assets');
