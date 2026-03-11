-- Make user_id nullable to support members without auth accounts (approved from applications)
ALTER TABLE public.members ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS: allow admins to insert members without user_id (for approving applications)
DROP POLICY IF EXISTS "Anyone can register as member" ON public.members;
CREATE POLICY "Anyone can register as member"
  ON public.members FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR is_admin_or_editor(auth.uid())
  );