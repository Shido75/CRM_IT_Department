# CRM Pro - Quick Start Guide

Get CRM Pro up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free at [supabase.com](https://supabase.com))

## Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone <repository-url>
cd crm-pro

# Install dependencies
npm install
```

## Step 2: Setup Supabase (2 min)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API**
3. Copy your:
   - **Project URL**
   - **Anon Key**

## Step 3: Configure Environment (1 min)

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Setup Database (1 min)

### Quick Method (Supabase Dashboard)

1. Go to **SQL Editor** in Supabase Dashboard
2. Create a new query
3. Copy & paste content of `db/01-schema.sql`
4. Click **Run**
5. Repeat for: `db/02-rls-policies.sql`, `db/03-indexes.sql`, `db/04-triggers.sql`

**Pro Tip**: You can run all scripts at once by concatenating them.

## Step 5: Create Admin Account (1 min)

### Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **"Create User"** or **"Add User"**
3. Email: `admin@company.com`
4. Password: `Admin@123`
5. Copy the **User ID** that appears
6. Go to **SQL Editor** and run:

```sql
INSERT INTO public.profiles (id, email, full_name, role, status, requires_password_change)
VALUES (
  'YOUR_USER_ID_HERE',
  'admin@company.com',
  'Admin User',
  'admin',
  'active',
  false
);
```

## Step 6: Run the App

```bash
npm run dev
```

Visit http://localhost:3000 → You'll be redirected to login!

## Login

```
Email: admin@company.com
Password: Admin@123
```

## Success!

You should now see the CRM Pro dashboard. 

## Next Steps

1. Explore the dashboard features
2. Create some test leads/clients
3. Add team members through Settings
4. Customize for your needs

## Troubleshooting

**"Connection refused" error?**
- Check Supabase URL and keys in `.env.local`
- Restart the dev server: `Ctrl+C`, then `npm run dev`

**"Can't login"?**
- Verify admin user was created in Supabase Auth
- Verify profile was inserted with correct user ID
- Check browser console for error messages

**"Database tables not found"?**
- Run all 4 SQL scripts in order
- Check SQL script execution completed without errors

## Get Help

1. **Setup Issues**: See `db/SETUP_GUIDE.md`
2. **Features Guide**: See `README.md`
3. **Project Details**: See `PROJECT_INFO.md`

## What's Included

- ✅ Complete CRM system
- ✅ Lead management
- ✅ Client tracking
- ✅ Project management (Kanban)
- ✅ Task management
- ✅ Communications hub
- ✅ Admin panel
- ✅ Role-based access
- ✅ Analytics & reports

## Key Features

- **Dashboard**: Overview of key metrics
- **Leads**: Track prospects from first contact to conversion
- **Clients**: Manage converted customers
- **Projects**: Kanban board for project visualization
- **Tasks**: Assign and track work items
- **Communications**: Log all client interactions
- **Reports**: Analytics and insights
- **Settings**: User and team management

## Important: Change Default Password!

After first login, go to **Settings** → change the default admin password immediately.

## Ready for More?

- Check `README.md` for complete documentation
- Review `db/SETUP_GUIDE.md` for database details
- Explore `PROJECT_INFO.md` for architecture info

Enjoy CRM Pro! 🚀
