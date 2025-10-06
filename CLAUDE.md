# Baker's Suite - Claude Development Guide

This document provides comprehensive guidance for Claude Code when working on the Baker's Suite codebase.

## Project Overview

**Baker's Suite** is a full-stack TypeScript monorepo for an intelligent baking companion app. It helps serious home bakers achieve professional consistency through ratio calculations, weather-aware scheduling, and flavor discovery.

**Target Users:** Serious home bakers (2-4 bakes/week)
**Business Model:** Freemium (free tier + premium subscription)

## Architecture

### Monorepo Structure

```
baker-suite/
├── apps/
│   ├── web/          # Next.js 14 frontend (App Router)
│   └── api/          # Express.js backend
├── packages/
│   ├── db/           # Prisma schema + database client
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utility functions
│   ├── config/       # Shared ESLint/TS configs
│   └── ui/           # Shared React components (Shadcn/ui)
└── docs/             # Documentation
```

### Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui, Zustand, React Query
**Backend:** Node.js 20, Express, TypeScript
**Database:** PostgreSQL (via Prisma ORM)
**Auth:** Clerk
**Caching:** Redis
**Storage:** Cloudflare R2

### Key Design Decisions

1. **Monorepo with Turborepo:** Enables code sharing, consistent builds, and faster CI
2. **Type Safety First:** Strict TypeScript + Zod validation throughout
3. **Baker's Percentages:** Core domain model - all recipes use ratios (flour = 100%)
4. **Weather Intelligence:** Proofing times adjust based on temperature/humidity
5. **Offline-First:** PWA capabilities with service workers

## Working with the Codebase

### Environment Setup

1. **Prerequisites:**
   ```bash
   node --version  # Should be v20+
   npm --version   # Should be v10+
   ```

2. **Initial Setup:**
   ```bash
   # Clone and install
   git clone <repo-url>
   cd baker-suite
   npm install

   # Set up environment
   cp .env.example .env
   # Edit .env with your credentials

   # Set up database
   npm run db:migrate
   npm run db:seed
   ```

3. **Development:**
   ```bash
   npm run dev  # Starts all apps (web on :3000, api on :3001)
   ```

### Common Development Tasks

#### Adding a New Feature

1. **Plan the feature:**
   - Identify affected packages/apps
   - Design database schema changes (if any)
   - Define TypeScript types
   - Create Zod validation schemas

2. **Implementation order:**
   ```
   packages/types → packages/db → apps/api → apps/web
   ```

3. **Example: Adding a "Bake Notes" feature**
   ```bash
   # 1. Add types
   # Edit packages/types/index.ts

   # 2. Update database schema
   # Edit packages/db/prisma/schema.prisma
   npm run db:migrate

   # 3. Create API endpoint
   # Create apps/api/src/routes/notes.routes.ts
   # Create apps/api/src/controllers/notes.controller.ts
   # Create apps/api/src/services/notes.service.ts

   # 4. Build frontend
   # Create apps/web/src/components/features/bake-notes/
   # Create apps/web/src/lib/hooks/useNotes.ts
   ```

#### Database Changes

```bash
# 1. Edit schema
vim packages/db/prisma/schema.prisma

# 2. Create migration
npm run db:migrate

# 3. Generate Prisma client
npm run db:generate

# 4. Update seed data (if needed)
vim packages/db/prisma/seed.ts
npm run db:seed
```

#### Adding a New API Endpoint

```typescript
// 1. Define types (packages/types/index.ts)
export interface BakeNote {
  id: string;
  bakeId: string;
  content: string;
  createdAt: Date;
}

// 2. Create Zod schema (apps/api/src/validators/)
import { z } from 'zod';

export const createBakeNoteSchema = z.object({
  bakeId: z.string().cuid(),
  content: z.string().min(1).max(1000),
});

// 3. Create service (apps/api/src/services/bake-note.service.ts)
import { prisma } from '@baker-suite/db';

export class BakeNoteService {
  async create(userId: string, data: CreateBakeNoteInput) {
    return prisma.bakeNote.create({
      data: { ...data, userId },
    });
  }
}

// 4. Create controller (apps/api/src/controllers/bake-note.controller.ts)
export class BakeNoteController {
  async create(req: Request, res: Response) {
    const userId = req.auth.userId; // From Clerk
    const data = createBakeNoteSchema.parse(req.body);
    const note = await bakeNoteService.create(userId, data);
    res.json({ data: note });
  }
}

// 5. Create route (apps/api/src/routes/bake-note.routes.ts)
import { Router } from 'express';

const router = Router();
router.post('/', bakeNoteController.create);

export default router;

// 6. Register in main routes (apps/api/src/routes/index.ts)
import bakeNoteRoutes from './bake-note.routes';
router.use('/bake-notes', bakeNoteRoutes);
```

#### Adding a Frontend Component

```typescript
// 1. Create component (apps/web/src/components/features/my-feature/MyComponent.tsx)
'use client';

import { useState } from 'react';
import { Button } from '@baker-suite/ui';

export function MyComponent() {
  return <div>Component content</div>;
}

// 2. Create custom hook if needed (apps/web/src/lib/hooks/useMyFeature.ts)
import { useQuery } from '@tanstack/react-query';

export function useMyFeature() {
  return useQuery({
    queryKey: ['myFeature'],
    queryFn: async () => {
      const res = await fetch('/api/v1/my-feature');
      return res.json();
    },
  });
}

// 3. Use in page (apps/web/src/app/(dashboard)/my-feature/page.tsx)
import { MyComponent } from '@/components/features/my-feature/MyComponent';

export default function MyFeaturePage() {
  return <MyComponent />;
}
```

### State Management Patterns

**Use Zustand for:**
- Global UI state (theme, modals, sidebar)
- User preferences
- Draft/temporary data

**Use React Query for:**
- Server state (recipes, bakes, timelines)
- API data fetching and caching
- Optimistic updates

**Use local state (useState) for:**
- Form inputs
- Component-specific UI state
- Temporary flags

### File Naming Conventions

- **Components:** PascalCase - `RatioCalculator.tsx`
- **Utilities:** camelCase - `formatRecipe.ts`
- **Types:** PascalCase - `Recipe.types.ts`
- **Hooks:** camelCase with "use" prefix - `useRecipe.ts`
- **API Routes:** kebab-case - `recipe.routes.ts`
- **Services:** kebab-case - `ratio-calculator.service.ts`

### Code Style Guidelines

1. **TypeScript:**
   - Use strict mode
   - Avoid `any` - use `unknown` and type guards
   - Prefer interfaces for objects, types for unions
   - Use Zod for runtime validation

2. **React:**
   - Use functional components with hooks
   - Extract complex logic into custom hooks
   - Keep components small (<200 lines)
   - Use composition over prop drilling

3. **Icons and Visual Elements:**
   - **ALWAYS use Lucide React icons instead of emojis**
   - Import icons from 'lucide-react' package
   - Use semantic icon names (e.g., `<Wheat />` not 🍞, `<Timer />` not ⏱️)
   - Apply consistent sizing via className (e.g., `className="h-6 w-6"`)
   - For console/terminal output: use text symbols like [✓] and [✗] instead of emoji
   - Never add emojis to user-facing UI or code
   - Example usage:
     ```tsx
     import { Wheat, Clock, Thermometer } from 'lucide-react';

     <div className="flex items-center gap-2">
       <Wheat className="h-6 w-6 text-sunset-orange" />
       <h1>Baker's Suite</h1>
     </div>
     ```

4. **API Design:**
   - RESTful conventions
   - Consistent error responses
   - Validate all inputs with Zod
   - Always return proper HTTP status codes

5. **Testing:**
   - Unit tests for utilities and services
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Component tests for complex UI

### Domain-Specific Knowledge

#### Baker's Percentages

All recipes use baker's percentages where flour = 100%.

```typescript
// Example: 70% hydration sourdough
const recipe = {
  flour: 100,      // Always 100%
  water: 70,       // 70% of flour weight
  salt: 2,         // 2% of flour weight
  starter: 20,     // 20% of flour weight
};

// To scale to 500g flour:
const flour = 500;
const water = flour * 0.70;  // 350g
const salt = flour * 0.02;   // 10g
const starter = flour * 0.20; // 100g
```

#### Weather Adjustments

Proofing times are adjusted based on temperature:
- **18-20°C:** +20% time
- **21-24°C:** Base time
- **25-28°C:** -15% time
- **29°C+:** -25% time

Humidity affects dough handling:
- **Low (<40%):** Dough may dry out, add 1-2% hydration
- **High (>70%):** Dough may be sticky, reduce 1-2% hydration

### Common Commands

```bash
# Development
npm run dev                 # Start all dev servers
npm run dev:web            # Start only frontend
npm run dev:api            # Start only backend

# Building
npm run build              # Build all apps
npm run build:web          # Build frontend only
npm run build:api          # Build backend only

# Database
npm run db:migrate         # Run migrations
npm run db:push            # Push schema to DB (no migration)
npm run db:studio          # Open Prisma Studio
npm run db:seed            # Seed database
npm run db:reset           # Reset database (DANGER!)

# Code Quality
npm run lint               # Lint all packages
npm run lint:fix           # Auto-fix linting issues
npm run format             # Format with Prettier
npm run type-check         # Check TypeScript types

# Testing
npm run test               # Run all tests
npm run test:coverage      # Run tests with coverage
npm run test:e2e           # Run E2E tests

# Utilities
npm run clean              # Remove node_modules and build artifacts
```

### Debugging Tips

#### Frontend Issues

```bash
# Check browser console for errors
# Use React DevTools to inspect component state
# Check Network tab for API calls

# Common issues:
# - Hydration errors: Check for client-only code in server components
# - Clerk auth issues: Verify environment variables
# - API 404s: Check NEXT_PUBLIC_API_URL in .env
```

#### Backend Issues

```bash
# Check server logs in terminal
# Use logger.debug() for detailed logging

# Common issues:
# - Database connection: Verify DATABASE_URL
# - CORS errors: Check CORS_ORIGIN setting
# - 500 errors: Check error middleware logs
```

#### Database Issues

```bash
# Check Prisma Studio: npm run db:studio
# View migration history: ls packages/db/prisma/migrations
# Check database directly: psql $DATABASE_URL

# Common issues:
# - Migration conflicts: Reset and re-migrate
# - Seed failures: Check data format in seed.ts
# - Connection errors: Verify PostgreSQL is running
```

### API Response Format

All API responses follow this structure:

```typescript
// Success
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  }
}
```

### Error Codes

- `VALIDATION_ERROR` - Zod validation failed
- `UNAUTHORIZED` - No auth token or invalid token
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Unexpected error

### Performance Best Practices

1. **Frontend:**
   - Use Next.js Image component for images
   - Implement pagination for lists
   - Use React.memo for expensive components
   - Lazy load heavy components

2. **Backend:**
   - Cache frequently accessed data in Redis
   - Use database indexes for common queries
   - Implement rate limiting
   - Use connection pooling

3. **Database:**
   - Add indexes for foreign keys
   - Use select to limit returned fields
   - Batch create/update operations
   - Avoid N+1 queries

### Security Checklist

- [ ] All inputs validated with Zod
- [ ] Authentication required for user endpoints
- [ ] Authorization checks before data access
- [ ] SQL injection prevented by Prisma
- [ ] XSS prevented by React's escaping
- [ ] CSRF tokens on mutations
- [ ] Rate limiting enabled
- [ ] Secrets in environment variables
- [ ] HTTPS in production

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add my feature"

# 3. Push and create PR
git push origin feature/my-feature

# Commit message format:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting
# refactor: code restructure
# test: add tests
# chore: tooling
```

### Troubleshooting

**Build fails:**
1. Clear cache: `npm run clean && npm install`
2. Check TypeScript errors: `npm run type-check`
3. Verify all dependencies: `npm list`

**Tests fail:**
1. Clear test cache: `rm -rf .next/cache`
2. Check environment: `NODE_ENV=test`
3. Verify database is seeded

**Deployment issues:**
1. Check environment variables
2. Verify build succeeds locally
3. Check logs in hosting platform

## Quick Reference

### Prisma Commands
- `npx prisma studio` - Open database GUI
- `npx prisma migrate dev` - Create migration
- `npx prisma generate` - Generate client

### Next.js Patterns
- Server Components: Default, faster, no client JS
- Client Components: Add 'use client', for interactivity
- Server Actions: 'use server' for mutations

### Useful Packages
- `@baker-suite/types` - Shared types
- `@baker-suite/utils` - Utilities (formatting, validation)
- `@baker-suite/ui` - UI components
- `@baker-suite/db` - Database client

---

**Questions?** Check README.md, API.md, or ARCHITECTURE.md for more details.
