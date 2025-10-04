# 🍞 Baker's Suite

**Your intelligent baking companion** - Achieve professional consistency with ratio-perfect recipes, weather-smart timelines, and flavor discovery.

[![CI](https://github.com/nmang004/baker-suite/workflows/CI/badge.svg)](https://github.com/nmang004/baker-suite/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🧮 **Ratio Calculator** - Scale recipes intelligently using baker's percentages
- ⏰ **Schedule Optimizer** - Weather-aware timeline planning for perfect proofing
- 🌈 **Flavor Pairing** - Discover unexpected ingredient combinations
- 🌡️ **Weather Intelligence** - Auto-adjust timing for temperature and humidity
- 📔 **Baking Journal** - Track and improve your bakes over time
- 🥖 **Starter Tracker** - Never kill your sourdough again

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS + Shadcn/ui
- **State:** Zustand + TanStack Query

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Database:** PostgreSQL (Prisma ORM)
- **Cache:** Redis

### Services
- **Auth:** Clerk
- **Weather:** OpenWeatherMap
- **Storage:** Cloudflare R2
- **Hosting:** Vercel + Railway

## Getting Started

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- PostgreSQL 16+ ([Download](https://www.postgresql.org/download/))
- npm 10+

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nmang004/baker-suite.git
   cd baker-suite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your credentials:
   - Database URL (PostgreSQL)
   - Clerk API keys
   - OpenWeatherMap API key
   - Other service credentials

4. **Set up the database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development servers:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3001](http://localhost:3001)
   - Prisma Studio: `npm run db:studio`

## Project Structure

```
baker-suite/
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── src/app/      # App Router pages
│   │   ├── src/components/ # React components
│   │   └── src/lib/      # Utilities, hooks, stores
│   └── api/              # Express backend
│       ├── src/routes/   # API routes
│       ├── src/services/ # Business logic
│       └── src/controllers/ # Request handlers
├── packages/
│   ├── db/               # Prisma schema + client
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Shared utilities
│   ├── config/           # Shared configs
│   └── ui/               # Shared UI components
└── docs/                 # Documentation
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start all dev servers
npm run dev:web          # Start frontend only
npm run dev:api          # Start backend only

# Building
npm run build            # Build all apps
npm run start            # Start production build

# Database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Code Quality
npm run lint             # Lint all code
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format with Prettier
npm run type-check       # Check TypeScript types

# Testing
npm run test             # Run tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Test with coverage

# Utilities
npm run clean            # Clean build artifacts
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests with Playwright
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Database Management

```bash
# Create a new migration
npm run db:migrate

# Push schema without migration (development only)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed the database
npm run db:seed

# Reset database (DANGER: deletes all data)
npm run db:reset
```

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Comprehensive development guide for Claude Code
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[STRATEGY.md](docs/STRATEGY.md)** - 12-week MVP roadmap and strategic plan
- **[API.md](docs/API.md)** - API documentation
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[QUICK_START.md](docs/QUICK_START.md)** - Quick start guide

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Roadmap

- [x] Core recipe management
- [x] Baker's percentage calculator
- [x] Weather API integration
- [ ] Mobile apps (React Native)
- [ ] Community recipe sharing
- [ ] AI-powered recipe suggestions
- [ ] Integration with smart kitchen devices
- [ ] Multi-language support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data from [OpenWeatherMap](https://openweathermap.org/)
- Flavor pairing science from [Foodpairing](https://www.foodpairing.com/)
- Inspired by the amazing home baking community

## Support

- **Issues:** [GitHub Issues](https://github.com/nmang004/baker-suite/issues)
- **Discussions:** [GitHub Discussions](https://github.com/nmang004/baker-suite/discussions)
- **Email:** support@bakerssuite.com

---

**Built with ❤️ by bakers, for bakers**

*Happy Baking! 🥖*
