# CRM Pro - Setup Checklist

Use this checklist to ensure you've completed all setup steps.

---

## Pre-Setup Requirements

- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm or yarn installed (`npm -v`)
- [ ] Git installed
- [ ] Supabase account created (free at supabase.com)
- [ ] Code editor ready (VS Code recommended)

---

## Step 1: Project Setup

- [ ] Clone repository: `git clone <url>`
- [ ] Navigate to folder: `cd crm-pro`
- [ ] Install dependencies: `npm install`
- [ ] Verify installation: `npm list @supabase/supabase-js`

---

## Step 2: Supabase Project Creation

- [ ] Create new Supabase project at supabase.com
- [ ] Project name entered
- [ ] Database password created (save securely)
- [ ] Region selected (closest to you)
- [ ] Wait for project initialization (2-3 min)
- [ ] Project dashboard loads successfully

---

## Step 3: Get Supabase Credentials

### Project URL
- [ ] Go to Supabase Dashboard
- [ ] Click **Settings** (bottom left)
- [ ] Click **API** tab
- [ ] Copy **Project URL** (starts with https://)
- [ ] Save URL somewhere safe

### Anon Key
- [ ] Still in API settings
- [ ] Find **Project API keys** section
- [ ] Copy the **anon** key (public/anonymous key)
- [ ] Verify it starts with `eyJ`
- [ ] Save key somewhere safe

### Verify Credentials
- [ ] URL format: `https://your-project.supabase.co`
- [ ] Key format: Long string starting with `eyJ`
- [ ] No extra spaces in either value
- [ ] Both values copied correctly

---

## Step 4: Environment Configuration

### Create .env.local File
- [ ] Copy example: `cp .env.example .env.local`
- [ ] File created in project root
- [ ] File named exactly `.env.local` (not .env)

### Edit .env.local
- [ ] Open `.env.local` in editor
- [ ] Add Supabase URL (replace placeholder)
- [ ] Add Supabase Anon Key (replace placeholder)
- [ ] Ensure NEXT_PUBLIC_APP_URL is set
- [ ] No quotes around values
- [ ] No extra spaces
- [ ] Save file

### Example (Your Values):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5: Database Setup

### Run SQL Script 1: Schema
- [ ] Go to Supabase SQL Editor
- [ ] Create new query
- [ ] Open `/db/01-schema.sql`
- [ ] Copy entire file contents
- [ ] Paste into SQL Editor
- [ ] Click **Run** button
- [ ] Wait for completion (no errors)
- [ ] Verify message shows success

### Run SQL Script 2: RLS Policies
- [ ] Create new query in SQL Editor
- [ ] Open `/db/02-rls-policies.sql`
- [ ] Copy entire file contents
- [ ] Paste into SQL Editor
- [ ] Click **Run** button
- [ ] Wait for completion
- [ ] Verify no errors

### Run SQL Script 3: Indexes
- [ ] Create new query in SQL Editor
- [ ] Open `/db/03-indexes.sql`
- [ ] Copy entire file contents
- [ ] Paste into SQL Editor
- [ ] Click **Run** button
- [ ] Wait for completion
- [ ] Verify no errors

### Run SQL Script 4: Triggers
- [ ] Create new query in SQL Editor
- [ ] Open `/db/04-triggers.sql`
- [ ] Copy entire file contents
- [ ] Paste into SQL Editor
- [ ] Click **Run** button
- [ ] Wait for completion
- [ ] Verify no errors

### Verify Tables Created
- [ ] Go to **Table Editor** in Supabase
- [ ] See `profiles` table listed
- [ ] See `leads` table listed
- [ ] See `clients` table listed
- [ ] See `projects` table listed
- [ ] See `tasks` table listed
- [ ] See `communications` table listed
- [ ] See `notifications` table listed

---

## Step 6: Create Admin User

### Via Supabase Dashboard

- [ ] Go to **Authentication** (left sidebar)
- [ ] Click **Users** tab
- [ ] Click **"Create User"** or **"Add User"** button
- [ ] Email: `admin@company.com`
- [ ] Password: `Admin@123`
- [ ] Click **"Create User"** button
- [ ] Admin user appears in list
- [ ] **IMPORTANT**: Copy the **User UID/ID** that appears
- [ ] Verify UID format: looks like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- [ ] Save UID in text editor

---

## Step 7: Create Admin Profile

- [ ] Go to Supabase **SQL Editor**
- [ ] Create new query
- [ ] Open `/db/05-seed-admin.sql`
- [ ] Copy entire file
- [ ] Paste into SQL Editor
- [ ] Find line with: `'00000000-0000-0000-0000-000000000001'`
- [ ] Replace with actual UID from Step 6
- [ ] Verify email is `admin@company.com`
- [ ] Click **Run** button
- [ ] Wait for completion
- [ ] Verify no errors

### Verification
- [ ] Go to **Table Editor**
- [ ] Click **profiles** table
- [ ] See admin profile with email `admin@company.com`
- [ ] Verify role is `admin`
- [ ] Verify status is `active`

---

## Step 8: Start Application

- [ ] Terminal in project root
- [ ] Run: `npm run dev`
- [ ] See message: "ready - started server on 0.0.0.0:3000"
- [ ] No errors in terminal

---

## Step 9: Test Login

- [ ] Open browser
- [ ] Go to http://localhost:3000
- [ ] Verify redirect to http://localhost:3000/auth/login
- [ ] See login form
- [ ] Email field visible
- [ ] Password field visible
- [ ] "Remember me" checkbox visible
- [ ] Enter email: `admin@company.com`
- [ ] Enter password: `Admin@123`
- [ ] Click "Sign In" button
- [ ] Wait for processing
- [ ] See dashboard
- [ ] See sidebar navigation
- [ ] See welcome message

---

## Step 10: Verify Dashboard Access

- [ ] Dashboard page loads
- [ ] Can see main navigation
- [ ] Can access "Leads"
- [ ] Can access "Clients"
- [ ] Can access "Projects"
- [ ] Can access "Tasks"
- [ ] Can access "Communications"
- [ ] Can access "Reports"
- [ ] Can access "Settings"
- [ ] Can access "Notifications"

---

## Step 11: Change Default Password

**IMPORTANT**: Do this immediately after first login!

- [ ] Go to **Settings**
- [ ] Click **Security** tab
- [ ] Scroll to "Change Password"
- [ ] Enter current password: `Admin@123`
- [ ] Enter new password (strong password)
- [ ] Confirm new password
- [ ] Click **"Update Password"**
- [ ] See success message
- [ ] Logout and login with new password
- [ ] Verify login works with new password

---

## Step 12: Optional - Create Test Users

- [ ] Go to Settings
- [ ] Click "User Management" tab
- [ ] Click **"Add User"** button
- [ ] Enter test user details:
  - Email: `manager@company.com`
  - Full Name: `Test Manager`
  - Role: `Manager`
  - Department: `Sales`
- [ ] Click **"Send Invite"**
- [ ] See success message

---

## Step 13: Documentation Review

- [ ] Read QUICKSTART.md (overview)
- [ ] Read README.md (features)
- [ ] Read db/SETUP_GUIDE.md (database details)
- [ ] Read ENV.md (environment variables)
- [ ] Read PROJECT_INFO.md (architecture)

---

## Step 14: Development Ready

- [ ] Application running on localhost:3000
- [ ] Admin can login successfully
- [ ] Dashboard accessible
- [ ] All navigation working
- [ ] Default password changed
- [ ] Ready for development/customization
- [ ] Database verified
- [ ] Environment configured

---

## Troubleshooting Checkpoints

### If Login Fails
- [ ] Check email: `admin@company.com` (exact match)
- [ ] Check password: `Admin@123` (case-sensitive)
- [ ] Verify admin user exists in Supabase Auth
- [ ] Verify profile exists in profiles table
- [ ] Check .env.local has correct credentials
- [ ] Restart dev server: `npm run dev`

### If Database Connection Fails
- [ ] Verify NEXT_PUBLIC_SUPABASE_URL in .env.local
- [ ] Verify NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
- [ ] Check no extra spaces in credentials
- [ ] Check URL format: `https://xxx.supabase.co`
- [ ] Check key starts with `eyJ`

### If Dashboard Won't Load
- [ ] Check browser console for errors
- [ ] Verify all 4 SQL scripts ran successfully
- [ ] Verify admin profile has role=`admin`
- [ ] Check RLS policies are enabled
- [ ] Restart dev server

### If Database Scripts Fail
- [ ] Check for syntax errors in copied SQL
- [ ] Verify no special characters copied
- [ ] Try running one script at a time
- [ ] Check Supabase status page
- [ ] Contact Supabase support if issue persists

---

## Quick Reference

### Default Credentials
```
Email: admin@company.com
Password: Admin@123
```

### Important URLs
```
App: http://localhost:3000
Supabase: https://app.supabase.com
Login: http://localhost:3000/auth/login
```

### Important Files
```
.env.local               - Your environment config
db/01-schema.sql       - Database tables
db/02-rls-policies.sql - Security policies
db/03-indexes.sql      - Performance indexes
db/04-triggers.sql     - Auto-update triggers
db/05-seed-admin.sql   - Admin seeder
```

### Key Commands
```
npm install            - Install dependencies
npm run dev           - Start dev server
npm run build         - Build for production
npm start             - Run production build
```

---

## Final Checklist Summary

- [ ] Prerequisites installed
- [ ] Project cloned and dependencies installed
- [ ] Supabase project created
- [ ] Credentials obtained and saved
- [ ] .env.local configured
- [ ] All 4 SQL scripts run successfully
- [ ] Admin user created in Auth
- [ ] Admin profile seeded
- [ ] Application running
- [ ] Login successful
- [ ] Dashboard accessible
- [ ] Default password changed
- [ ] Documentation reviewed
- [ ] Ready for use

---

## You're All Set!

If all checkboxes are checked, CRM Pro is ready to use!

### Next Steps:
1. **Customize** - Modify features for your organization
2. **Deploy** - Follow deployment guide in README
3. **Team Setup** - Create users for your team
4. **Training** - Review feature guide with team
5. **Integration** - Connect with other systems (future)

---

## Support

If you get stuck:
1. Check this checklist again
2. Review QUICKSTART.md
3. Review db/SETUP_GUIDE.md
4. Check troubleshooting in README.md
5. Review ENV.md for environment issues

---

**Setup Complete!** 🎉

Your CRM Pro system is now operational.

Default Login: admin@company.com / Admin@123

Remember to change the default password!
