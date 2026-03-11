
-- Confirm email for steliomucavelee@gmail.com (was registered before auto-confirm was enabled)
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'steliomucavelee@gmail.com' 
  AND email_confirmed_at IS NULL;
