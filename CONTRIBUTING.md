# Contributing to Orbex Exchange

Thank you for your interest in contributing to the Orbex Exchange platform. This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating in the project.

---

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js     | 18.0+   |
| pnpm        | 8.0+    |
| MySQL       | 8.0+    |
| Redis       | 7.0+    |
| Git         | 2.30+   |

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/orbex-exchange.git
cd orbex-exchange
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/Paxeer-Network/Pax-OrbexOpenSourceExchange.git
```

---

## Development Setup

### Install Dependencies

```bash
pnpm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your local database credentials and configuration.

### Initialize Database

```bash
pnpm seed
```

### Start Development Servers

**Frontend:**
```bash
pnpm dev
```

**Backend:**
```bash
pnpm dev:backend
```

**Background Workers:**
```bash
pnpm dev:thread
```

---

## Contribution Workflow

### 1. Sync Your Fork

Before starting work, sync your fork with upstream:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create a Feature Branch

Create a branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### 3. Make Your Changes

- Write clean, maintainable code
- Follow the coding standards outlined below
- Add tests for new functionality
- Update documentation as needed

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add order history export functionality"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation change
- `style:` - Code style change (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test addition or modification
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

---

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use Prettier for code formatting

```bash
pnpm lint
pnpm format
```

### File Organization

- Place React components in `src/components/`
- Place API handlers in `backend/api/`
- Place database models in `models/`
- Place type definitions in `types/`

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `OrderBook.tsx` |
| Files (utilities) | camelCase | `formatCurrency.ts` |
| Variables | camelCase | `orderTotal` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ORDER_SIZE` |
| Types/Interfaces | PascalCase | `OrderDetails` |
| Database models | PascalCase | `ExchangeOrder` |

### Code Style

- Maximum line length: 100 characters
- Use explicit return types for functions
- Avoid `any` type where possible
- Use async/await over raw Promises
- Handle errors explicitly

---

## Testing Requirements

### Running Tests

```bash
pnpm test
```

### Test Coverage

- All new features must include tests
- Bug fixes should include regression tests
- Maintain or improve existing coverage

### Test Organization

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] New code includes appropriate tests
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### Pull Request Template

When creating a PR, include:

1. **Description** - What does this PR do?
2. **Related Issue** - Link to related issue(s)
3. **Type of Change** - Feature, fix, docs, etc.
4. **Testing** - How was this tested?
5. **Screenshots** - If applicable

### Review Process

1. Automated checks must pass (lint, tests, build)
2. At least one maintainer review required
3. All review comments must be addressed
4. Final approval from Paxeer Network team

---

## Issue Guidelines

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or logs if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Alternative solutions considered

### Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvement
- `good first issue` - Good for newcomers
- `help wanted` - Community help requested
- `priority: high` - High priority item
- `priority: low` - Low priority item

---

## Recognition

Contributors who make significant contributions will be recognized in:
- The project README
- Release notes
- Our contributors page

---

## Questions

For questions about contributing, open a discussion on GitHub or contact the team at contributors@paxeer.network.

---

**Orbex Exchange** - A PaxLabs and Sidiora Markets Venture for Paxeer Network
