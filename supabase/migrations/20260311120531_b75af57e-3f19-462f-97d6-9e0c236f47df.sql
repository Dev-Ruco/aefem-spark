
CREATE TABLE public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  profession text,
  age integer,
  whatsapp_number text NOT NULL,
  province text NOT NULL,
  access_code text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application"
  ON public.membership_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view applications"
  ON public.membership_applications
  FOR SELECT
  TO authenticated
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can manage applications"
  ON public.membership_applications
  FOR ALL
  TO authenticated
  USING (is_admin_or_editor(auth.uid()))
  WITH CHECK (is_admin_or_editor(auth.uid()));
