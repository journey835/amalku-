-- Amalku Database Schema for Supabase (Simplified for Single Family)

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Ibadah entries table
CREATE TABLE IF NOT EXISTS public.ibadah_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  puasa BOOLEAN DEFAULT FALSE,
  subuh BOOLEAN DEFAULT FALSE,
  dzuhur BOOLEAN DEFAULT FALSE,
  ashar BOOLEAN DEFAULT FALSE,
  maghrib BOOLEAN DEFAULT FALSE,
  isya BOOLEAN DEFAULT FALSE,
  tarawih BOOLEAN DEFAULT FALSE,
  witir BOOLEAN DEFAULT FALSE,
  dhuha BOOLEAN DEFAULT FALSE,
  tadarus_pages INTEGER DEFAULT 0,
  sedekah BOOLEAN DEFAULT FALSE,
  sedekah_amount DECIMAL(10, 2),
  dzikir_pagi BOOLEAN DEFAULT FALSE,
  dzikir_petang BOOLEAN DEFAULT FALSE,
  rawatib BOOLEAN DEFAULT FALSE,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, date)
);

-- Badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Streaks table
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_ibadah_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibadah_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Profiles policies (all users can see all profiles)
CREATE POLICY "Anyone can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ibadah entries policies (all users can see all entries)
CREATE POLICY "Anyone can view all ibadah entries" ON public.ibadah_entries
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own entries" ON public.ibadah_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON public.ibadah_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON public.ibadah_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Badges policies (all users can see all badges)
CREATE POLICY "Anyone can view all badges" ON public.badges
  FOR SELECT USING (true);

-- Streaks policies (all users can see all streaks)
CREATE POLICY "Anyone can view all streaks" ON public.streaks
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ibadah_entries_user_date ON public.ibadah_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_ibadah_entries_date ON public.ibadah_entries(date);
CREATE INDEX IF NOT EXISTS idx_badges_user ON public.badges(user_id);
