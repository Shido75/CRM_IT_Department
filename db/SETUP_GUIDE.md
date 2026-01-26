# CRM Pro Database Setup Guide

This guide walks you through setting up the CRM Pro database using Supabase or local PostgreSQL.

## Quick Start (Recommended: Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `crm-pro` (or your choice)
   - Database Password: Create a strong password
   - Region: Select closest to you
5. Wait for project initialization (2-3 minutes)

### Step 2: Retrieve Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy and save:
   - **Project URL** (under "Project URL")
   - **Anon Key** (under "Project API keys")
3. These go in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

### Step 3: Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of **`db/01-schema.sql`**
4. Paste into the SQL Editor
5. Click **"Run"** button
6. Wait for completion

**Repeat steps 2-5 for each file:**
- `db/02-rls-policies.sql` (Row Level Security)
- `db/03-indexes.sql` (Performance indexes)
- `db/04-triggers.sql` (Auto-update timestamps)

### Step 4: Create Admin User

#### Method A: Via Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users** (left sidebar)
2. Click **"Create User"** or **"Add User"** button
3. Enter:
   - Email: `admin@company.com`
   - Password: `Admin@123`
4. Click **"Create User"** button
5. **Important**: Copy the **User UID** that appears after creation

#### Method B: Via SQL Query

```sql
-- Run in SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'admin@company.com',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
)
RETURNING id;
```

This will output the user ID. Note it down.

### Step 5: Create Admin Profile

1. In Supabase **SQL Editor**, create a new query
2. Copy contents of **`db/05-seed-admin.sql`**
3. Find this line:
   ```sql
   id = '00000000-0000-0000-0000-000000000001', -- Replace with actual UUID
   ```
4. Replace the UUID with the one from Step 4
5. Click **"Run"**

Example:
```sql
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  department,
  status,
  requires_password_change
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- Your actual UUID
  'admin@company.com',
  'Admin User',
  'admin',
  'Administration',
  'active',
  false
)
...
```

### Step 6: Configure Application

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 7: Test Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000
   - You should be redirected to login page
   - Login with:
     - Email: `admin@company.com`
     - Password: `Admin@123`

3. If login succeeds, database setup is complete!

---

## Local PostgreSQL Setup

### Prerequisites

- PostgreSQL 12+ installed
- `psql` command-line tool available

### Installation

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

#### Windows
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer and follow prompts

### Setup Steps

1. **Create database**
   ```bash
   createdb crm_pro
   ```

2. **Run schema scripts**
   ```bash
   psql crm_pro < db/01-schema.sql
   psql crm_pro < db/02-rls-policies.sql
   psql crm_pro < db/03-indexes.sql
   psql crm_pro < db/04-triggers.sql
   ```

3. **Create admin user**
   ```bash
   psql crm_pro < db/05-seed-admin.sql
   ```

4. **Update environment variables**
   
   Create `.env.local`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_pro
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Test connection**
   ```bash
   psql crm_pro -c "SELECT COUNT(*) FROM profiles;"
   ```

---

## Verification Checklist

After setup, verify everything is working:

- [ ] Supabase/PostgreSQL database created
- [ ] All 4 schema scripts executed successfully
- [ ] Admin user created with UUID noted
- [ ] Admin profile seeded
- [ ] Environment variables configured
- [ ] Login works with admin credentials
- [ ] Can navigate dashboard without errors

## Common Issues & Solutions

### "Connection refused"
- Supabase: Check project status in dashboard
- PostgreSQL: Ensure database service is running

### "RLS policy violation"
- Verify `02-rls-policies.sql` was executed
- Check user UUID in profiles table matches auth.users

### "User not found in profiles"
- Run the seeder script with correct UUID
- Verify email matches exactly: `admin@company.com`

### "Password change required" on login
- Expected behavior for new users
- Set `requires_password_change = false` in profiles table
- Or force password change through UI (if implemented)

### UUID mismatch errors
- Double-check the UUID copy-paste from Step 4
- Ensure no extra spaces or formatting

## Database Structure

### Core Tables

- **profiles**: User accounts and roles
- **leads**: Sales leads and prospects
- **clients**: Converted leads and customers
- **projects**: Client projects
- **tasks**: Work tasks assigned to team
- **communications**: Client interactions
- **support_tickets**: Support issues
- **notifications**: User notifications

### Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control (admin, manager, employee)
- Email-based authentication
- Encrypted passwords

## Adding Team Members

After admin account is set up:

1. Login to dashboard with admin account
2. Go to **Settings** → **User Management**
3. Click **"Add User"**
4. Fill in user details
5. System sends temporary password via email
6. User changes password on first login

## Next Steps

1. Review `README.md` for feature overview
2. Start application: `npm run dev`
3. Explore dashboard features
4. Customize as needed for your organization

## Support

For database-specific issues:
- Review Supabase docs: https://supabase.com/docs
- Check PostgreSQL docs: https://www.postgresql.org/docs/
- Review troubleshooting in main README
