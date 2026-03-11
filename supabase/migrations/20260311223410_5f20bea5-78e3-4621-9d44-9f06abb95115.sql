
-- Create publications table
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Public can read active publications
CREATE POLICY "Active publications are viewable by everyone"
  ON public.publications
  FOR SELECT
  TO public
  USING (true);

-- Admins/editors can manage publications
CREATE POLICY "Admins and editors can manage publications"
  ON public.publications
  FOR ALL
  TO authenticated
  USING (is_admin_or_editor(auth.uid()))
  WITH CHECK (is_admin_or_editor(auth.uid()));

-- Create storage bucket for publications
INSERT INTO storage.buckets (id, name, public)
VALUES ('publications', 'publications', true);

-- Storage policies for publications bucket
CREATE POLICY "Public can view publication files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'publications');

CREATE POLICY "Admins can upload publication files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'publications' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update publication files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'publications' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete publication files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'publications' AND is_admin_or_editor(auth.uid()));
