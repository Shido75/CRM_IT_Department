# CRM Pro - Complete Customer Relationship Management System

A modern, feature-rich CRM system built with Next.js 16, Supabase, and TypeScript. Designed for managing leads, clients, projects, tasks, and communications with role-based access control.

## Features

- **Lead Management**: Track and convert leads with status tracking and assignment
- **Client Management**: Manage client relationships and communications
- **Project Management**: Kanban board for visualizing projects and workflow
- **Task Management**: Create, assign, and track tasks with priorities and deadlines
- **Communications Hub**: Track all client communications (calls, emails, meetings, notes)
- **Support Tickets**: Issue tracking and resolution management
- **Analytics & Reports**: Comprehensive dashboards with key metrics
- **Notifications**: Real-time alerts for important CRM activities
- **Role-Based Access Control**: Admin, Manager, and Employee roles with specific permissions
- **User Management**: Admin can create and manage team members

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Shadcn/UI with Tailwind CSS
- **State Management**: React Context API + SWR for data fetching
- **Charts**: Recharts for data visualization

## Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   ├── forgot-password/      # Password recovery
│   │   └── reset-password/       # Password reset
│   ├── dashboard/               # Main dashboard
│   ├── leads/                   # Lead management
│   ├── clients/                 # Client management
│   ├── projects/                # Project management
│   ├── tasks/                   # Task management
│   ├── communications/          # Communications hub
│   ├── notifications/           # Notifications page
│   ├── reports/                 # Reports & analytics
│   ├── settings/                # Settings & user management
│   └── layout.tsx              # Root layout
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   ├── leads/                   # Lead-specific components
│   ├── clients/                 # Client-specific components
│   ├── projects/                # Project-specific components
│   ├── tasks/                   # Task-specific components
│   ├── sidebar.tsx              # Main sidebar navigation
│   └── header.tsx               # Header with user menu
├── lib/                          # Utility functions
│   ├── auth.ts                  # Authentication utilities
│   ├── auth-context.tsx         # Auth context provider
│   └── services/                # API service functions
├── db/                           # Database scripts
│   ├── 01-schema.sql            # Table definitions
│   ├── 02-rls-policies.sql      # Row Level Security policies
│   ├── 03-indexes.sql           # Database indexes
│   ├── 04-triggers.sql          # Triggers for auto-updates
│   └── 05-seed-admin.sql        # Initial admin seeder
└── scripts/                      # Legacy scripts folder
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the login page.

## Database Setup

### Supabase Setup (Recommended)

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project
   - Note your project URL and anon key

2. **Create the database schema**
   - In Supabase Dashboard, go to SQL Editor
   - Create a new query and run the following scripts in order:
     ```
     1. db/01-schema.sql      (Create tables)
     2. db/02-rls-policies.sql (Enable Row Level Security)
     3. db/03-indexes.sql     (Create performance indexes)
     4. db/04-triggers.sql    (Set up auto-update triggers)
     ```

3. **Create the first admin user**
   - In Supabase Dashboard, go to Authentication → Users
   - Click "Create User" or "Add User"
   - Email: `admin@company.com`
   - Password: `Admin@123`
   - Note the user UUID

4. **Seed the admin profile**
   - In SQL Editor, open `db/05-seed-admin.sql`
   - Replace the UUID placeholder with the actual admin user UUID from step 3
   - Run the script

5. **Add your environment variables to .env.local**

### Local PostgreSQL Setup (Alternative)

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Create a database**
   ```bash
   createdb crm_pro
   ```

3. **Run the setup scripts**
   ```bash
   psql crm_pro < db/01-schema.sql
   psql crm_pro < db/02-rls-policies.sql
   psql crm_pro < db/03-indexes.sql
   psql crm_pro < db/04-triggers.sql
   psql crm_pro < db/05-seed-admin.sql
   ```

4. **Update your database connection string in .env.local**

## Default Admin Credentials

Once the database is set up with the seeder script, you can log in with:

- **Email**: `admin@company.com`
- **Password**: `Admin@123`

**Important**: Change these credentials immediately after first login.

## Authentication & Authorization

### User Roles

1. **Admin**
   - Full system access
   - Can create and manage users
   - Can view all data
   - Can assign leads and tasks
   - Can manage projects

2. **Manager**
   - Can manage own team
   - Can create and assign leads
   - Can create and manage projects
   - Can view team performance

3. **Employee**
   - Can only view and edit assigned tasks
   - Can view leads and clients
   - Can log communications
   - Limited data access based on assignments

### User Management

Admins can add new users through:
1. Settings → User Management → Add User
2. Provide email, full name, role, and department
3. System sends temporary password via email
4. User must change password on first login

## Features Guide

### Dashboard
- Overview of key metrics
- Recent activity feed
- Quick statistics

### Lead Management
- Create and track leads
- Update lead status (new, contacted, in_progress, converted, lost)
- Assign leads to team members
- Convert leads to clients
- Add notes and track communications

### Client Management
- Manage client information
- Track client projects
- View communication history
- Monitor support tickets

### Projects
- Create projects linked to clients
- Kanban board visualization
- Assign team members
- Set budget and priorities
- Track project status

### Tasks
- Create tasks within projects
- Assign to team members
- Set priorities and deadlines
- Track task status
- Auto-notifications for upcoming deadlines

### Communications
- Log all client interactions
- Record phone calls, emails, meetings, and notes
- Search and filter communications
- Track communication history

### Reports
- Lead pipeline analysis
- Conversion metrics
- Revenue tracking
- Team performance

### Notifications
- Real-time alerts
- Task assignments
- Deadline reminders
- Lead updates
- Project status changes

## API Services

The application uses service functions located in `/lib/services/`:

- `leads.ts` - Lead CRUD operations
- `clients.ts` - Client management
- `projects.ts` - Project management
- `tasks.ts` - Task management

Each service uses Supabase client for database queries and includes error handling.

## Security

- **Row Level Security (RLS)**: Implemented on all tables
- **Authentication**: Supabase Auth with secure session management
- **Password Management**: Hashed passwords with Supabase auth
- **CORS**: Configured for secure cross-origin requests
- **Role-Based Access**: Fine-grained permissions per role

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Your Supabase anonymous key
NEXT_PUBLIC_APP_URL=              # Application URL (for password reset links)
```

See `.env.example` for a template.

## Development

### Build for Production
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

### Code Formatting
```bash
npm run lint
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with a single click

### Deploy to Other Platforms

- **Self-hosted**: Use `npm run build` and deploy the `.next` folder
- **Docker**: Create a Dockerfile based on Next.js documentation
- **Other**: Follow platform-specific Next.js deployment guides

## Database Maintenance

### Backups
- Supabase provides daily backups on Pro plan
- Use `pg_dump` for local PostgreSQL backups

### Monitoring
- Monitor database performance in Supabase dashboard
- Check RLS policy effectiveness
- Review slow query logs

### Migrations
Database schema updates should follow this process:
1. Create new migration file in `/db` folder
2. Test in development environment
3. Apply to production database
4. Deploy application changes

## Troubleshooting

### Common Issues

**"Cannot read property 'user' of null"**
- Ensure Supabase credentials are correct in `.env.local`
- Check that user exists in Supabase Auth
- Verify RLS policies are enabled

**"Rows not appearing in dashboard"**
- Check RLS policies for SELECT permissions
- Verify user role in profiles table
- Check auth token validity

**"Password reset email not received"**
- Configure email in Supabase Auth settings
- Check email domain whitelist
- Verify NEXT_PUBLIC_APP_URL is correct

### Debug Mode
Add debug logging to authentication:
```typescript
console.log("[v0] Auth user:", user)
console.log("[v0] User profile:", profile)
```

## Support & Contributing

For issues, suggestions, or contributions:
1. Create an issue on GitHub
2. Fork and submit pull requests
3. Follow the existing code style and conventions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Core CRM features
- Admin panel
- Database schema with RLS
- Role-based access control
- Complete authentication system

## Roadmap

- [ ] Email integration for automatic logging
- [ ] Advanced reporting and custom dashboards
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Webhook support
- [ ] Two-factor authentication
- [ ] Activity audit log
- [ ] Advanced team collaboration features

## Support

For questions or issues, please:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Open an issue on GitHub
4. Contact the development team
