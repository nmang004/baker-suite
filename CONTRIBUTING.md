# Contributing to Baker's Suite

Thank you for your interest in contributing to Baker's Suite! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and considerate in all interactions.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Git
- A GitHub account

### Setup Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/nmang004/baker-suite.git
   cd baker-suite
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/baker-suite.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

6. **Set up database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

7. **Start development servers:**
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Tooling/config changes

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add/update tests as needed
- Update documentation if necessary
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Run type checker
npm run type-check

# Run tests
npm run test

# Run E2E tests (if applicable)
npm run test:e2e
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add recipe scaling feature"
git commit -m "fix: correct hydration calculation"
git commit -m "docs: update API documentation"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic changes)
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Tooling/config changes
- `perf:` - Performance improvements

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- Clear title following commit conventions
- Detailed description of changes
- Screenshots (if UI changes)
- Link to related issues

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Avoid `any` - use `unknown` with type guards
- Prefer interfaces for object types
- Use Zod for runtime validation
- Document complex types with comments

```typescript
// Good
interface Recipe {
  id: string;
  name: string;
  hydration: number;
}

// Avoid
type Recipe = any;
```

### React

- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components focused and small (<200 lines)
- Use composition over prop drilling
- Add 'use client' only when necessary

```typescript
// Good
'use client';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { isLoading, data } = useRecipe(recipe.id);

  if (isLoading) return <Skeleton />;

  return <div>{data.name}</div>;
}
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Generic UI components
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components
├── lib/
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── validations/     # Zod schemas
└── types/               # TypeScript types
```

### Naming Conventions

- **Components:** PascalCase (`RecipeCard.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Hooks:** camelCase with "use" prefix (`useRecipe.ts`)
- **Types:** PascalCase (`Recipe.types.ts`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RECIPES`)

## Testing Guidelines

### Unit Tests

Write unit tests for:
- Utility functions
- Business logic services
- Complex hooks

```typescript
import { describe, it, expect } from 'vitest';
import { calculateHydration } from './baker-math';

describe('calculateHydration', () => {
  it('should calculate hydration percentage correctly', () => {
    const ingredients = [
      { name: 'flour', quantity: 100, unit: 'g' },
      { name: 'water', quantity: 70, unit: 'g' },
    ];

    expect(calculateHydration(ingredients)).toBe(70);
  });
});
```

### Integration Tests

Write integration tests for:
- API endpoints
- Database operations
- External service integrations

### E2E Tests

Write E2E tests for:
- Critical user flows
- Authentication flows
- Data creation/editing flows

## Pull Request Process

1. **Ensure all tests pass:**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

2. **Update documentation** if you changed:
   - API endpoints (update `docs/API.md`)
   - Database schema (update Prisma schema comments)
   - Configuration options (update `.env.example`)
   - User-facing features (update `README.md`)

3. **Update CLAUDE.md** if you added:
   - New patterns or conventions
   - Common development tasks
   - Troubleshooting tips

4. **Describe your changes** in the PR:
   - What problem does it solve?
   - What approach did you take?
   - Are there any trade-offs?
   - Screenshots for UI changes

5. **Wait for review:**
   - Address reviewer feedback
   - Make requested changes
   - Keep the discussion respectful

6. **Squash commits** before merging:
   - Combine related commits
   - Ensure commit message is clear

## Reporting Bugs

### Before Submitting

1. Check if the bug has already been reported
2. Try to reproduce with latest version
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox]
- Version: [e.g., 0.1.0]

**Additional context**
Any other relevant information.
```

## Feature Requests

### Before Submitting

1. Check if feature has been requested
2. Consider if it aligns with project goals
3. Think about implementation approach

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples.
```

## Database Migrations

When changing the database schema:

1. **Update Prisma schema:**
   ```prisma
   // packages/db/prisma/schema.prisma
   model NewModel {
     id        String   @id @default(cuid())
     name      String
     createdAt DateTime @default(now())
   }
   ```

2. **Create migration:**
   ```bash
   npm run db:migrate
   ```

3. **Update seed data if needed:**
   ```typescript
   // packages/db/prisma/seed.ts
   await prisma.newModel.create({
     data: { name: 'Example' }
   });
   ```

4. **Document changes** in PR description

## API Changes

When adding/modifying API endpoints:

1. **Define types:**
   ```typescript
   // packages/types/index.ts
   export interface NewResource {
     id: string;
     name: string;
   }
   ```

2. **Create Zod schema:**
   ```typescript
   // Validation schema
   export const newResourceSchema = z.object({
     name: z.string().min(1).max(100),
   });
   ```

3. **Implement endpoint:**
   ```typescript
   // Service, controller, route
   ```

4. **Update API docs:**
   ```markdown
   // docs/API.md
   ### POST /api/v1/resources
   Create a new resource.
   ```

5. **Add tests**

## Questions?

- Check [CLAUDE.md](CLAUDE.md) for development guidance
- Read [README.md](README.md) for project overview
- Open a [Discussion](https://github.com/nmang004/baker-suite/discussions)
- Ask in [Issues](https://github.com/nmang004/baker-suite/issues)

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes
- Project documentation

Thank you for contributing to Baker's Suite! 🍞
