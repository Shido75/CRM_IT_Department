# Environment Variables Documentation

This document explains all environment variables used in CRM Pro.

## Setup Instructions

### 1. Create .env.local file

Copy the example file:
```bash
cp .env.example .env.local
```

### 2. Add Your Values

Edit `.env.local` with your configuration:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_value_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Required Environment Variables

### NEXT_PUBLIC_SUPABASE_URL
**Type**: String (URL)  
**Required**: Yes  
**Default**: None

The URL of your Supabase project.

**How to get it:**
1. Log in to Supabase Dashboard
2. Go to **Settings** → **API**
3. Copy the **Project URL** value
4. Example: `https://your-project.supabase.co`

**Usage**: 
- Used to connect to Supabase database
- Publicly visible in browser (safe to expose)
- Must start with `https://`

---

### NEXT_PUBLIC_SUPABASE_ANON_KEY
**Type**: String (API Key)  
**Required**: Yes  
**Default**: None

The anonymous (public) API key for Supabase.

**How to get it:**
1. Log in to Supabase Dashboard
2. Go to **Settings** → **API**
3. Under "Project API keys", copy the **Anon** key
4. Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Usage**:
- Used for client-side Supabase authentication
- Publicly visible in browser (safe to expose)
- Enables RLS security at database level

---

### NEXT_PUBLIC_APP_URL
**Type**: String (URL)  
**Required**: Yes  
**Default**: http://localhost:3000

The base URL of your application.

**How to set it:**
- **Development**: `http://localhost:3000`
- **Production**: Your deployed domain (e.g., `https://crm.example.com`)

**Usage**:
- Used in password reset email links
- Used in authentication redirects
- Must match your actual application URL

**Examples**:
```
Development:  http://localhost:3000
Staging:      https://staging-crm.example.com
Production:   https://crm.example.com
```

---

## Optional Environment Variables

### VERCEL_ANALYTICS_ID
**Type**: String  
**Required**: No  
**Default**: Not set

Vercel Analytics ID for performance monitoring.

**How to get it:**
1. Deploy to Vercel
2. Go to project settings
3. Copy Analytics ID from deployment settings

**Usage**:
- Enables performance metrics in Vercel Dashboard
- Only needed if using Vercel for deployment

---

## Environment Variable Prefixes Explained

### NEXT_PUBLIC_
Variables prefixed with `NEXT_PUBLIC_` are **publicly visible** in the browser.

These should only contain non-sensitive information like:
- API endpoints
- Public API keys
- Application URLs
- Feature flags

**Examples in this project:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### No Prefix
Variables without prefix are **server-side only** and never exposed to the browser.

Use these for sensitive credentials:
- Database passwords
- Private API keys
- Encryption secrets
- Authentication tokens

---

## File Structure

```
project-root/
├── .env.example         # Template (commit to git)
├── .env.local          # Your local config (never commit)
├── .env.production     # Production config (use in CI/CD)
└── ENV.md             # This file
```

### .env.example (Template)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
VERCEL_ANALYTICS_ID=your_vercel_analytics_id_here
```

### .env.local (Local Development)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### .env.production (Production)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://crm.example.com
VERCEL_ANALYTICS_ID=your_vercel_analytics_id_here
```

---

## How to Get Supabase Credentials

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project

### Step 2: Get Project URL
1. In Supabase Dashboard, go to **Settings** (bottom left)
2. Click **API** tab
3. Under "Project URL", copy the full URL
4. Paste into `NEXT_PUBLIC_SUPABASE_URL`

### Step 3: Get Anon Key
1. Same location as above (**Settings** → **API**)
2. Under "Project API keys"
3. Find the **anon** key (public key)
4. Copy and paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Verify
```bash
# These should be set correctly
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Troubleshooting

### "Failed to connect to Supabase"
**Problem**: Wrong credentials or URL format

**Solution**:
1. Double-check URL format: `https://your-project.supabase.co`
2. Verify no extra spaces: `[ ]` at start/end
3. Test URL in browser (should show Supabase error page)
4. Restart dev server: `npm run dev`

### "Authentication failed"
**Problem**: Invalid API key

**Solution**:
1. Verify anon key is for correct project
2. Check it's not the service_role key
3. Ensure key format is correct (long string starting with `ey`)
4. Restart dev server

### "Cannot find module '@supabase/supabase-js'"
**Problem**: Missing Supabase client library

**Solution**:
```bash
npm install @supabase/supabase-js
```

### "Environment variable not loading"
**Problem**: .env.local not being read

**Solution**:
1. Ensure file is named exactly `.env.local`
2. Check it's in project root (not subfolder)
3. Verify no syntax errors (no quotes needed for values)
4. Restart dev server
5. Check `.gitignore` includes `.env*`

---

## Security Best Practices

1. **Never commit .env.local**
   ```bash
   # .gitignore already has this
   .env.local
   .env.*.local
   ```

2. **Use different keys per environment**
   - Development: `.env.local`
   - Staging: `.env.staging`
   - Production: Environment variables in Vercel/hosting platform

3. **Rotate keys regularly**
   - In Supabase, go to **Settings** → **API**
   - Regenerate keys periodically
   - Update all environments

4. **Never share credentials**
   - Don't paste in Slack/email
   - Don't commit to version control
   - Don't share in pull requests

5. **Use role-based API keys**
   - Use "anon" key for client-side (has RLS)
   - Use "service_role" only for server-side code (if needed)

---

## Environment-Specific Configurations

### Local Development
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Staging/Testing
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
NEXT_PUBLIC_APP_URL=https://staging.example.com
```

### Production
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_APP_URL=https://crm.example.com
VERCEL_ANALYTICS_ID=your-vercel-id
```

---

## Vercel Deployment

When deploying to Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your production Supabase URL
   - Environments: Select all or specific (Production, Preview, Development)

5. Repeat for all required variables

**Important**: Click "Save" after each variable.

---

## Checking if Variables Are Loaded

To verify variables are loaded correctly:

```javascript
// This will only work in server-side code
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)

// Browser console will show values
console.log(typeof window !== 'undefined' ? 'Client' : 'Server')
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Supabase not defined" | Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| "Cannot read property 'auth'" | Verify both Supabase env vars are set |
| "Redirect loop on login" | Check `NEXT_PUBLIC_APP_URL` matches your domain |
| "ENV variables not updating" | Restart dev server with `npm run dev` |
| "Different values in production" | Set Vercel env vars separately in dashboard |

---

## Quick Reference

```bash
# Development
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (in Vercel)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
VERCEL_ANALYTICS_ID=xxx (optional)
```

---

## Support

For environment variable issues:
1. Review this document
2. Check Supabase API docs
3. Review `.env.example` template
4. Check troubleshooting section above

Still stuck? Review the main README.md or QUICKSTART.md
