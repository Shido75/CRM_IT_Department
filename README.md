# Orbinex CRM System

> **Built & Maintained by [AK 0121 Agency](https://ak0121.agency)**  
> © 2026 AK 0121 Agency. All rights reserved.

A modern, full-featured CRM for IT departments — built with Next.js 16, Supabase, and TypeScript. Designed for managing leads, clients, projects, tasks, and team communications with role-based access control by department.

---

## Features

- **Lead Management** — Track leads, move through pipeline stages, convert to Client + Project in one step
- **Lead → Client → Project Conversion** — Converting a lead automatically creates a linked client record and a new project
- **Client Management** — View and manage clients created via lead conversion (no standalone add)
- **Project Management** — Kanban board view, linked to clients created from leads
- **Task Management** — Create, assign, and track tasks with priorities and due dates
- **Communications Hub** — Log calls, emails, meetings, and notes per client
- **Reports & Analytics** — 5 live charts: Lead funnel, Status breakdown, Lead sources (pie), Leads over time (line), Project status
- **Notifications** — Real-time alerts for CRM activity
- **Role-Based Access Control (RBAC)** — Sidebar navigation filtered by role and department
- **User Management** — Admin creates users with custom email + password (no email verification); real user list with remove

---

## Role & Department Access Matrix

| Page | Admin | Manager | Sales | Dev |
|---|:---:|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ❌ | ❌ |
| Leads | ✅ | ✅ | ✅ | ❌ |
| Clients | ✅ | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ❌ | ✅ |
| Tasks | ✅ | ✅ | ❌ | ✅ |
| Communications | ✅ | ✅ | ❌ | ✅ |
| Reports | ✅ | ✅ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ❌ | ❌ |
| Add User | ✅ only | ❌ | ❌ | ❌ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (admin-created users, no email verification) |
| UI | Shadcn/UI, Tailwind CSS |
| Charts | Recharts |
| State | React Context API with sessionStorage caching |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project ([supabase.com](https://supabase.com))

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # Required for admin user creation
```

> Get `SUPABASE_SERVICE_ROLE_KEY` from: Supabase Dashboard → Project Settings → API → Service Role Key

### 3. Run database migrations
In **Supabase SQL Editor**, run these scripts **in order**:

| # | File | Purpose |
|---|---|---|
| 1 | `db/99-reset-complete.sql` | Full schema reset (profiles, leads, clients, projects) with RLS |
| 2 | `db/08-tasks-migration.sql` | Tasks table with correct schema |

### 4. Start the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Creating the First Admin

In Supabase Dashboard → Authentication → Users:
- Create a user with any email (e.g., `admin@orbinex.in`)
- Copy the user UUID
- Run in SQL Editor:
```sql
UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
```

---

## User Management

Admins can create users via **Settings → User Management → Add User**:
- Custom email format (e.g., `john@orbinex.in`) — no verification email sent
- Password set directly by admin
- Role: `Manager` or `Employee`
- Department: `Sales` or `Dev`
- Users appear in the list immediately with role/department badges
- Admin can remove any user (except themselves)

> Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env`

---

## Key Architecture Decisions

### Lead Conversion Flow
1. Admin/Manager opens the **Leads** page
2. Click **"Convert to Client"** on any lead
3. Fill in **Project Name, Description, Budget, Dates**
4. System atomically creates: a **Client** record (from lead data) + a **Project** (linked to client)
5. Lead status updates to `converted`

### Data Visibility
All authenticated users see **all organization data** on their accessible pages. Data isolation is by page access (RBAC), not by record ownership.

### Performance
- User profile cached in `sessionStorage` — subsequent page navigations load instantly
- Silent background refresh keeps cache fresh
- Sidebar renders immediately; content skeletons during data load

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `NEXT_PUBLIC_APP_URL` | ✅ | App URL (for auth redirects) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Admin features | Create/delete users bypassing RLS |

---

## Project Structure

```
├── app/
│   ├── (protected)/            # Auth-gated pages
│   │   ├── dashboard/
│   │   ├── leads/              # Lead list + ConvertLeadModal
│   │   ├── clients/            # Client list (no standalone add)
│   │   ├── projects/           # Project list (no standalone add)
│   │   ├── tasks/
│   │   ├── communications/
│   │   ├── reports/            # 5 live Recharts visualizations
│   │   ├── notifications/
│   │   └── settings/           # User management + profile settings
│   ├── auth/
│   │   └── login/
│   └── actions/
│       └── users.ts            # createUser / listUsers / deleteUser
├── components/
│   ├── app-sidebar.tsx         # RBAC-filtered navigation
│   ├── leads/
│   │   └── convert-lead-modal.tsx
│   └── tasks/
│       └── task-form.tsx
├── lib/
│   ├── auth-context.tsx        # Auth + sessionStorage profile cache
│   └── services/
│       ├── leads.ts
│       ├── clients.ts
│       ├── projects.ts
│       └── tasks.ts
└── db/
    ├── 99-reset-complete.sql   # Primary schema (run first)
    └── 08-tasks-migration.sql  # Tasks table (run second)
```

---

## Changelog

### Version 2.0.0 — Orbinex CRM (Current)
- ✅ Renamed to **Orbinex CRM System**
- ✅ Removed standalone "Add Client" and "Add Project" buttons
- ✅ Lead → Client + Project atomic conversion modal
- ✅ Role-based sidebar (Admin / Manager / Sales / Dev)
- ✅ Admin user creation with custom email + direct password (no email verification)
- ✅ Real user list in Settings with count badge + remove button
- ✅ Reports page with 5 live Recharts data visualizations
- ✅ Tasks table schema fixed and aligned with TypeScript interfaces
- ✅ Profile cached in sessionStorage for instant page navigation
- ✅ All org data shared across roles (no per-user data filtering)

### Version 1.0.0 — CRM Pro
- Initial release with core CRM features

---

## License & Copyright

© 2026 **AK 0121 Agency**. All rights reserved.  
Unauthorized copying, distribution, or modification of this software is strictly prohibited.

---

*Orbinex CRM System — Developed by AK 0121 Agency*
