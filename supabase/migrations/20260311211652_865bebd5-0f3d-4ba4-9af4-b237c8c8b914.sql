
-- Add profession and age columns to members
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS profession text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS age integer;

-- Make gender and birth_year nullable
ALTER TABLE public.members ALTER COLUMN gender DROP NOT NULL;
ALTER TABLE public.members ALTER COLUMN birth_year DROP NOT NULL;

-- Add user_roles policy for members to read their own role
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
