-- ============================================================================
-- Wedding Gift Tracking Web Application (ប្រព័ន្ធកត់ចំណងដៃអាពាហ៍ពិពាហ៍)
-- Complete Supabase PostgreSQL Schema & Security Policies
-- ============================================================================

-- 1. Create Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'host');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gift_status') THEN
    CREATE TYPE gift_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'currency_type') THEN
    CREATE TYPE currency_type AS ENUM ('USD', 'KHR');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wedding_side') THEN
    CREATE TYPE wedding_side AS ENUM ('groom', 'bride', 'both');
  END IF;
END $$;

-- 2. Profiles Table (linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'host',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Wedding Gifts Table
CREATE TABLE IF NOT EXISTS wedding_gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  side wedding_side DEFAULT 'both',
  amount NUMERIC(12, 2) NOT NULL,
  currency currency_type DEFAULT 'USD',
  payment_method TEXT DEFAULT 'Cash',
  receipt_url TEXT,
  wishes TEXT,
  status gift_status DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_gifts ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin view all profiles" ON profiles;
CREATE POLICY "Admin view all profiles"
ON profiles FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 6. Wedding Gifts RLS Policies (as defined in prompt)
DROP POLICY IF EXISTS "Guests can submit pending gifts" ON wedding_gifts;
CREATE POLICY "Guests can submit pending gifts"
ON wedding_gifts FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Admin full access" ON wedding_gifts;
CREATE POLICY "Admin full access"
ON wedding_gifts FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Host view approved gifts" ON wedding_gifts;
CREATE POLICY "Host view approved gifts"
ON wedding_gifts FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'host'));

-- 7. Realtime Publication for Live Dashboard
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE wedding_gifts;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 8. Auto-create Profile Trigger on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'host')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. Storage Bucket Configuration for Payment Receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can upload receipts" ON storage.objects;
CREATE POLICY "Public can upload receipts" 
ON storage.objects FOR INSERT TO anon, authenticated 
WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Public can view receipts" ON storage.objects;
CREATE POLICY "Public can view receipts" 
ON storage.objects FOR SELECT TO anon, authenticated 
USING (bucket_id = 'receipts');
