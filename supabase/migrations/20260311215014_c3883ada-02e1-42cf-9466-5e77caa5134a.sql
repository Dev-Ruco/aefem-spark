DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.members'::regclass
      AND contype = 'c'
  LOOP
    EXECUTE 'ALTER TABLE public.members DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

ALTER TABLE public.members ALTER COLUMN status SET DEFAULT 'active';