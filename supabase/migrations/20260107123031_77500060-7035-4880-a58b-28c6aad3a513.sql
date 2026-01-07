-- Create app_role enum if it doesn't include 'member'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'member' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'member';
  END IF;
END$$;

-- Create team_members table for AEFEM collaborators
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  position_en TEXT,
  photo_url TEXT,
  bio TEXT,
  bio_en TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team members policies
CREATE POLICY "Team members are viewable by everyone"
ON public.team_members FOR SELECT
USING (is_active = true OR is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can manage team members"
ON public.team_members FOR ALL
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

-- Create members table for AEFEM membership
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('masculino', 'feminino', 'outro')),
  birth_year INTEGER NOT NULL CHECK (birth_year >= 1940 AND birth_year <= 2010),
  province TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Members policies
CREATE POLICY "Members can view their own profile"
ON public.members FOR SELECT
USING (auth.uid() = user_id OR is_admin_or_editor(auth.uid()));

CREATE POLICY "Members can update their own profile"
ON public.members FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can register as member"
ON public.members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all members"
ON public.members FOR ALL
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

-- Create member_quotas table
CREATE TABLE public.member_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  reference_month DATE NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  payment_date TIMESTAMPTZ,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(member_id, reference_month)
);

-- Enable RLS on member_quotas
ALTER TABLE public.member_quotas ENABLE ROW LEVEL SECURITY;

-- Member quotas policies
CREATE POLICY "Members can view their own quotas"
ON public.member_quotas FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.members WHERE id = member_id AND user_id = auth.uid())
  OR is_admin_or_editor(auth.uid())
);

CREATE POLICY "Admins can manage all quotas"
ON public.member_quotas FOR ALL
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

-- Create member_notifications table
CREATE TABLE public.member_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'quota')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on member_notifications
ALTER TABLE public.member_notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Members can view their own notifications"
ON public.member_notifications FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.members WHERE id = member_id AND user_id = auth.uid())
  OR is_admin_or_editor(auth.uid())
);

CREATE POLICY "Members can update their own notifications"
ON public.member_notifications FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.members WHERE id = member_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all notifications"
ON public.member_notifications FOR ALL
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

-- Add translation fields to articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS excerpt_en TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS content_en TEXT;

-- Create triggers for updated_at columns
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if user is a member
CREATE OR REPLACE FUNCTION public.is_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.members
    WHERE user_id = _user_id
      AND status = 'active'
  )
$$;

-- Create storage bucket for team photos
INSERT INTO storage.buckets (id, name, public) VALUES ('team', 'team', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for team bucket
CREATE POLICY "Team photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'team');

CREATE POLICY "Admins can upload team photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update team photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'team' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete team photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'team' AND is_admin_or_editor(auth.uid()));