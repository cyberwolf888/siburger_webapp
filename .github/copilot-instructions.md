# Copilot Instructions for TeleApp

## Core Commands

- **Development**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Lint**: `npm run lint` (Next.js ESLint config with TypeScript support)

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Frontend**: React 19, TypeScript 5+, Tailwind CSS 4
- **External API**: Telegram WebApp API
- **Type System**: Full TypeScript with strict mode enabled

### Project Structure

```
src/
├── app/           # Next.js App Router pages and layouts
├── hooks/         # Custom React hooks for Telegram integration
├── components/    # Reusable UI components
└── types/         # TypeScript type definitions
```

### Core Modules

#### Telegram Integration

- **`useTelegramWebApp`**: Core hook managing WebApp initialization, user data, and connection status
- **`useTelegramMessaging`**: Handles message sending with loading states and error handling
- **`TelegramComponents`**: UI components with consistent styling and behavior

#### Key Features

- Auto-expanding WebApp for full-height experience
- Polling-based script loading detection with timeout protection
- Real-time connection monitoring and status feedback
- Type-safe Telegram API integration with global type augmentation

## Style Rules

### Code Organization

- Separate concerns: hooks for logic, components for UI, types for definitions
- Use custom hooks for all stateful logic and external API interactions
- Export types from dedicated files for reusability

### TypeScript Patterns

- Use strict mode with full type coverage
- Define interfaces for all props and return types
- Use optional chaining for Telegram API access (`window.Telegram?.WebApp`)
- Export types from `src/types/` for cross-module usage

### React Patterns

- Use `useCallback` for functions passed to dependencies or child components
- Implement proper cleanup with `clearInterval`/`clearTimeout` in `useEffect`
- Use loading states and error boundaries for all async operations
- Auto-reset success states with timeouts for better UX

### Component Design

- Create modular, reusable components with clear prop interfaces
- Use Tailwind classes with responsive breakpoints (`sm:`, etc.)
- Implement loading states with spinners and skeleton placeholders
- Include accessibility features (ARIA labels, semantic HTML)

### Error Handling

- Use try-catch blocks for all external API calls
- Provide user-friendly error messages in state
- Log detailed errors to console for debugging
- Implement graceful fallbacks when Telegram API unavailable

### Naming Conventions

- Use PascalCase for components and types
- Use camelCase for functions, variables, and props
- Prefix custom hooks with `use`
- Use descriptive names for boolean states (`isLoading`, `isAvailable`, `messageSent`)

## Import Style

- Use relative imports for local modules (`../hooks/`, `./components/`)
- Group imports: React hooks first, then local modules
- Import types with explicit `type` keyword when possible

## Development Notes

- Telegram WebApp script loads asynchronously; always check availability
- WebApp initialization includes automatic expansion and user data extraction
- All messaging operations should handle both success and error states
- Use Next.js Image component for optimized avatar rendering
- The app is designed for mobile-first Telegram WebApp environment
