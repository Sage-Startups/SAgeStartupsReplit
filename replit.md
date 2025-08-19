# Sage-Startups - AI-Powered Branding Automation Platform

## Overview

Sage-Startups is a subscription-based full-stack web application offering AI-powered branding automation for startups. It features a CRM-style founder dashboard with real-time analytics, multi-suite navigation, interactive goal tracking, and a professional live analytics dashboard. Users authenticate via Replit Auth, accessing features based on subscription tiers across three main suites: Home (founder dashboard), AI Suite (60+ bots), and Business Suite (startup tools). The platform includes a comprehensive real-time analytics system for monitoring user behavior, site traffic, and conversions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with custom styling
- **UI/UX Decisions**: Clean white backgrounds with gray borders for bot cards, colorful icon containers, simplified navigation (e.g., "Back" button), dynamically generated descriptive session titles. Visual outputs include charts, progress indicators, and structured data.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon Database)
- **AI Integration**: OpenAI GPT-4o for bot responses
- **Session Management**: Express sessions with PostgreSQL store

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files

### Key Features & Technical Implementations
- **Subscription Model**: Three tiers (Free, Pro, Premium) with intelligent signup flow:
  - **Free Trial**: 7-day free access to platform features
  - **Premium Early Bird**: Monthly recurring at $22/month (50% lifetime discount from $44/month)
  - Automatic tier assignment based on softlaunch signup choice
- **User Dashboard**: Comprehensive dashboard with subscription management and analytics.
- **AI Suite**: 67+ specialized bots organized into Marketing, Branding, Advertising, and Analytics sections. Bots are individually programmed master bots with unique interfaces and capabilities (e.g., MarketingStrategyBot, BrandingBot, ContentCreatorBot, SEOExpertBot, Logo Design Assistant, Brand Voice Generator, Color Palette Creator, Typography Selector, Brand Guidelines Builder, Tagline Generator, Brand Story Writer, Visual Identity System, Brand Positioning Bot, Rebranding Consultant, Ad Copy Generator, Creative Concept Bot). Bots provide dynamic, personalized outputs based on user inputs.
  - **Enhanced Result Display**: BotResultDisplay component provides rich, visual formatting for AI responses with tabs (Overview, Detailed Analysis, Implementation), color swatches for palette bots, copy/export functionality, and toggle between formatted results and conversation history.
- **Business Suite**: Categorized startup tools.
- **Analytics System**: Real-time analytics dashboard with auto-refresh, gradient UI, loading skeletons, and visual data representations. Comprehensive tracking middleware for site visits, page views, user actions, device info, and session data.
- **Session Management**: Persistent sessions with full state restoration. Meaningful session names generated dynamically.
- **Landing Pages**: Conversion-focused landing pages with waitlist system, early bird pricing, and dynamic counter.
- **Security**: Input sanitization and prompt length limits implemented for AI prompt injection vulnerability prevention.
- **Storage Layer**: Dual storage implementation (memory for dev, database for production) with interface-based design.

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connectivity
- **openai**: OpenAI API integration
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **Stripe**: Payment processing for subscriptions.
- **SendGrid**: Email delivery for welcome emails and waitlist notifications.
- **Google Analytics**: External analytics tracking (G-WJTY2Z42SJ).
- **DALL-E 3**: Integrated for AI-generated logos.
- **YouTube**: Video embedding.