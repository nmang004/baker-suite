# Quick Start Guide

Get Baker's Suite running locally in 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 20+** ([Download](https://nodejs.org/))
- ✅ **PostgreSQL 16+** ([Download](https://www.postgresql.org/download/))
- ✅ **npm 10+** (comes with Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))

**Verify installations:**

```bash
node --version   # Should be v20.x.x or higher
npm --version    # Should be v10.x.x or higher
psql --version   # Should be 16.x or higher
git --version    # Any recent version
```

## First-Time Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nmang004/baker-suite.git
cd baker-suite
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies for the monorepo. Grab a coffee ☕ - this might take a few minutes.

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

**Edit `.env` with your settings:**

```bash
# Open in your editor
code .env  # VS Code
# or
nano .env  # Terminal editor
```

**Minimum required variables for local development:**

```env
# Database (update with your local PostgreSQL credentials)
DATABASE_URL="postgresql://username:password@localhost:5432/baker_suite"

# Clerk Auth (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Optional but recommended for full functionality:**

```env
# Weather API (get from https://openweathermap.org/api)
OPENWEATHERMAP_API_KEY=your_api_key_here
```

### 4. Set Up the Database

#### Option A: Using Local PostgreSQL

```bash
# Create database
createdb baker_suite

# Or using psql
psql -U postgres -c "CREATE DATABASE baker_suite;"
```

#### Option B: Using Docker

```bash
# Start PostgreSQL in Docker
docker run --name baker-suite-db \
  -e POSTGRES_DB=baker_suite \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

### 5. Run Database Migrations

```bash
npm run db:migrate
```

This creates all the necessary tables in your database.

### 6. Seed the Database (Optional)

```bash
npm run db:seed
```

This adds sample data like flavor pairings.

### 7. Start Development Servers

```bash
npm run dev
```

This starts:
- 🌐 Frontend at [http://localhost:3000](http://localhost:3000)
- 🔌 API at [http://localhost:3001](http://localhost:3001)

**Wait for the build to complete.** You'll see:

```
✓ Ready in 3.5s
○ Compiling / ...
✓ Compiled / in 1.2s

🚀 Server running on port 3001
```

### 8. Open Your Browser

Visit [http://localhost:3000](http://localhost:3000)

You should see the Baker's Suite homepage! 🎉

## Daily Development Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Run migrations if schema changed
npm run db:migrate

# 4. Start dev servers
npm run dev

# 5. Start coding! 💻
```

## Useful Commands

### Development

```bash
npm run dev              # Start all dev servers
npm run dev:web          # Start only frontend (port 3000)
npm run dev:api          # Start only backend (port 3001)
```

### Database

```bash
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:seed          # Seed database
npm run db:push          # Push schema (development only)
npm run db:reset         # Reset database (⚠️ DELETES ALL DATA)
```

### Code Quality

```bash
npm run lint             # Lint all code
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format with Prettier
npm run type-check       # Check TypeScript types
```

### Testing

```bash
npm run test             # Run tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Run with coverage
```

### Building

```bash
npm run build            # Build all apps
npm run start            # Start production build
```

## Troubleshooting

### Port Already in Use

**Problem:** `Error: Port 3000 is already in use`

**Solution:**

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev:web
```

### Database Connection Error

**Problem:** `Can't reach database server`

**Solutions:**

1. **Verify PostgreSQL is running:**
   ```bash
   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql

   # Windows
   # Check Services app
   ```

2. **Check DATABASE_URL:**
   - Verify username, password, host, port, database name
   - Test connection: `psql $DATABASE_URL`

3. **Firewall:**
   - Ensure port 5432 is not blocked

### Clerk Auth Issues

**Problem:** Login not working

**Solutions:**

1. **Verify environment variables:**
   ```bash
   echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   echo $CLERK_SECRET_KEY
   ```

2. **Check Clerk dashboard:**
   - Ensure keys are for correct environment (test/production)
   - Verify allowed domains include `localhost:3000`

3. **Clear browser cache and cookies**

### Build Errors

**Problem:** TypeScript errors during build

**Solution:**

```bash
# Clear all caches and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install

# Run type check to see errors
npm run type-check
```

### Migrations Fail

**Problem:** Migration errors

**Solution:**

```bash
# Reset database (⚠️ DELETES ALL DATA)
npm run db:reset

# Or manually:
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:migrate
```

## Next Steps

### 1. Explore the Codebase

```bash
# Open in VS Code
code .

# Key directories:
apps/web/src/          # Frontend code
apps/api/src/          # Backend code
packages/db/           # Database schema
packages/types/        # Shared types
```

### 2. Read the Documentation

- **[CLAUDE.md](../CLAUDE.md)** - Development guide
- **[API.md](./API.md)** - API reference
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines

### 3. Make Your First Change

Try adding a simple feature:

```bash
# 1. Create a feature branch
git checkout -b feature/my-first-feature

# 2. Make changes
# Edit apps/web/src/app/page.tsx

# 3. See live reload in browser
# Changes appear automatically!

# 4. Commit
git add .
git commit -m "feat: my first feature"
```

### 4. Explore Sample Data

```bash
# Open Prisma Studio
npm run db:studio

# Browse your database visually at http://localhost:5555
```

### 5. Run Tests

```bash
# Run tests
npm run test

# Run specific test file
npm run test -- path/to/test.test.ts
```

## Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Recommended Chrome Extensions

- React Developer Tools
- Redux DevTools (for Zustand)
- JSON Viewer

## Common Tasks

### Adding a New Package

```bash
# Install to root
npm install package-name -w root

# Install to web app
npm install package-name -w @baker-suite/web

# Install to api
npm install package-name -w @baker-suite/api
```

### Creating a Database Migration

```bash
# 1. Edit schema
vim packages/db/prisma/schema.prisma

# 2. Create migration
npm run db:migrate

# 3. Name your migration when prompted
# Example: "add_user_preferences_table"
```

### Viewing Logs

```bash
# Frontend logs: Check browser console

# Backend logs: Check terminal running npm run dev

# Database logs:
tail -f /usr/local/var/log/postgresql@16.log  # macOS
sudo tail -f /var/log/postgresql/postgresql-16-main.log  # Linux
```

## Getting Help

- **Documentation:** Check [CLAUDE.md](../CLAUDE.md)
- **Issues:** Search [GitHub Issues](https://github.com/nmang004/baker-suite/issues)
- **Discussions:** Ask in [GitHub Discussions](https://github.com/nmang004/baker-suite/discussions)
- **Claude Code:** Reference this guide when working with Claude

## Checklist

Before you start developing, ensure:

- [ ] Node.js 20+ installed
- [ ] PostgreSQL running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`.env`)
- [ ] Database migrated (`npm run db:migrate`)
- [ ] Dev servers running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:3001/api/v1/health

---

**Happy coding! 🚀**

If you run into issues, check the [Troubleshooting](#troubleshooting) section or create an issue on GitHub.
