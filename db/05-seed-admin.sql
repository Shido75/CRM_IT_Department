-- Seed initial admin user
-- Note: This script creates the admin profile. The auth user must be created in Supabase Dashboard first.
-- 
-- Instructions:
-- 1. Go to Supabase Dashboard -> Authentication -> Users
-- 2. Click "Create User" or "Add User"
-- 3. Enter email: admin@company.com
-- 4. Set password: Admin@123
-- 5. Run this script to create the profile

-- Insert admin profile (replace the UUID with the actual user ID from Supabase)
-- You'll need to get the user UUID from your Supabase auth table
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  department,
  status,
  requires_password_change
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual Supabase user UUID
  'admin@company.com',
  'Admin User',
  'admin',
  'Administration',
  'active',
  false
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User',
  department = 'Administration',
  status = 'active',
  requires_password_change = false;
