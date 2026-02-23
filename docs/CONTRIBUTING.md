# Contributing Guide

Thank you for your interest in contributing to the Job Search Activity Tracker!

## Development Setup

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase CLI
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-activity-tracker
   ```

2. **Set up frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
   npm run dev
   ```

3. **Set up backend**
   ```bash
   cd backend
   supabase init
   supabase start  # For local development
   supabase db reset  # Run migrations
   ```

4. **Run tests**
   ```bash
   cd frontend
   npm test
   ```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Use meaningful type names
- Avoid `any` type

### React Components

- Use functional components with hooks
- Follow the component structure:
  ```tsx
  interface ComponentProps {
    // Props definition
  }

  export function Component({ prop1, prop2 }: ComponentProps) {
    // Component logic
    return (
      // JSX
    )
  }
  ```

### File Naming

- Components: PascalCase (e.g., `ActivityDialog.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase (e.g., `types/index.ts`)

### Code Organization

```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── store/         # State management
└── types/         # TypeScript type definitions
```

## Git Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write clear commit messages
   - Keep commits focused and atomic

3. **Test your changes**
   - Run tests: `npm test`
   - Test manually in browser
   - Check for linting errors

4. **Submit a pull request**
   - Describe your changes
   - Reference related issues
   - Request review from maintainers

## Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(activities): add bulk delete functionality

Users can now select multiple activities and delete them at once.
This improves efficiency for users with many activities.

Closes #123
```

## Testing

### Unit Tests

- Write tests for utility functions
- Test component logic (not implementation details)
- Aim for >80% code coverage

### Integration Tests

- Test API interactions
- Test user flows
- Test error handling

### E2E Tests

- Test critical user journeys
- Test authentication flows
- Test Gmail integration

## Documentation

- Update README.md for user-facing changes
- Update API docs for backend changes
- Add JSDoc comments for complex functions
- Update CHANGELOG.md for significant changes

## Pull Request Process

1. **Before submitting**:
   - [ ] Code follows style guidelines
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No console.logs or debug code
   - [ ] No sensitive data committed

2. **PR description should include**:
   - What changes were made
   - Why changes were made
   - How to test the changes
   - Screenshots (if UI changes)

3. **Review process**:
   - Address reviewer feedback
   - Keep PR focused and small
   - Respond to comments promptly

## Code Review Guidelines

### For Reviewers

- Be constructive and respectful
- Explain reasoning for suggestions
- Approve when satisfied
- Request changes when needed

### For Authors

- Respond to all comments
- Make requested changes
- Ask questions if unclear
- Thank reviewers for their time

## Reporting Issues

### Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternatives considered
- Additional context

## Questions?

- Open a discussion for general questions
- Check existing issues and PRs
- Review documentation
- Contact maintainers

Thank you for contributing! 🎉



