# Sage-Startups - AI-Powered Branding Automation Platform

## Overview

Sage-Startups is a subscription-based full-stack web application that provides AI-powered branding automation for startups. The platform now features a comprehensive CRM-style founder dashboard with real-time business analytics, multi-suite navigation system, and interactive goal tracking. Users authenticate via Replit Auth and access features based on their subscription tier across three main suites: Home (founder dashboard), AI Suite (60+ bots), and Business Suite (startup tools).

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

- ✅ Converted platform to subscription-based model with Replit authentication
- ✅ Added three subscription tiers: Free (8 bots), Pro ($24/month, 30 bots), Premium ($44/month, all 60+ bots)
- ✅ Created new sales-focused landing page with pricing tiers and feature comparisons
- ✅ Built comprehensive user dashboard with subscription management and analytics
- ✅ Implemented user authentication using Replit Auth (OpenID Connect)
- ✅ Added PostgreSQL database with user management, analytics, and session storage
- ✅ Updated all API routes to require authentication and enforce subscription limits
- ✅ Fixed database connection issues with Neon serverless configuration
- ✅ Resolved React warnings by properly mapping icon strings to Lucide React components
- ✅ Fixed AI message validation errors by adding required role field
- ✅ Added subscription tier and usage tracking to dashboard
- ✅ Replaced conversational bot interface with dropdown-based option selection
- ✅ Created structured input forms for better user experience
- ✅ Transformed into CRM-style founder dashboard with real-time editable analytics
- ✅ Implemented multi-suite navigation: Home (founder dashboard), AI Suite, Business Suite
- ✅ Added interactive goal tracking with completion status and dates
- ✅ Created comprehensive business suite with categorized startup tools
- ✅ Enhanced navigation with user account management and personalized experience
- ✅ Added "Reset All Metrics" button to founder dashboard with confirmation dialog
- ✅ Removed subscription submenu from AI-suite page (Tools tab)
- ✅ Changed "My Bots" naming to "Tools" throughout the interface
- ✅ Implemented collapsible sections in AI-suite - users must click on sections like "Branding" to expand and see the tools
- ✅ Deleted Community section completely from bot definitions
- ✅ Moved all Blog bots into Marketing section (now 20+ tools in Marketing)
- ✅ Reorganized tool sections: Marketing (20+), Branding (10), Advertising (10), Analytics (10)
- ✅ Updated free subscription to provide 8 bots (2 from each of the 4 sections) instead of 6 bots
- ✅ Completed comprehensive platform rebrand from "BrandAI Pro" to "Sage-Startups"
- ✅ Fixed individual session delete functionality with proper error handling and logging
- ✅ Made recent activities clickable to navigate directly to bot sessions
- ✅ Updated HTML title and meta description for better SEO
- ✅ Removed email verification requirement for smoother user onboarding - users get immediate access after signup
- ✅ Updated welcome emails to congratulate users with direct sign-in links instead of verification requirements
- ✅ Added comprehensive password management for super admin including reset and edit capabilities
- ✅ Configured SendGrid integration with contact@sage-startups.com for welcome email delivery
- ✅ Fixed post-signup redirect flow to automatically sign in users and redirect to dashboard
- ✅ Updated all authenticated pages to use consistent MainNavigation component instead of mixed navigation
- ✅ **Major Architecture Change**: Replaced generic bot interfaces with specialized, individually programmed master bots
- ✅ Created MarketingStrategyBot: Comprehensive marketing analysis with visual charts, ROI projections, and channel strategies
- ✅ Created BrandingBot: Professional brand identity creation with color palettes, typography, and implementation roadmaps
- ✅ Created ContentCreatorBot: Multi-format content generation with SEO optimization and distribution strategies
- ✅ Created SEOExpertBot: Deep SEO analysis with technical audits, keyword research, and competitor analysis
- ✅ Each bot now has unique interfaces, workflows, and specialized capabilities tailored to their domain
- ✅ Bots provide visual outputs including charts, progress indicators, and structured data instead of plain text
- ✅ Added session loading functionality to all specialized bots to restore previous work
- ✅ Fixed critical billing bug: upgrade buttons were processing upgrades for free instead of charging through Stripe
- ✅ Updated /api/user/subscription endpoint to require payment for all paid tier upgrades  
- ✅ Modified upgrade mutation in user-dashboard to redirect to checkout page when payment is required
- ✅ Only downgrades to free tier are allowed without payment; all upgrades must go through Stripe checkout
- ✅ Added comprehensive download functionality to MarketingStrategyBot with PDF, Word, share, and print options
- ✅ Added icons to all specialized AI bot interfaces (Marketing Strategy, Branding, Content Creator, SEO Expert)
- ✅ Enhanced bot cards in AI Suite with icons next to bot names for better visual identification
- ✅ Implemented proper subscription period management - users maintain access until billing cycle ends when canceling
- ✅ **MAJOR BOT IMPROVEMENT**: Transformed bots from static responses to dynamic, personalized outputs
- ✅ Enhanced MarketingStrategyBot with dynamic calculations based on user revenue and budget inputs
- ✅ Upgraded SEOExpertBot with industry-specific scoring, personalized competitor analysis, and dynamic projections
- ✅ All bots now generate unique responses based on user inputs rather than hardcoded template data
- ✅ **ENHANCED SEO BOT ISSUES**: Converted generic SEO audit issues to website-specific, personalized issues that reference actual user inputs (URL, industry, keywords, target audience) for authentic analysis results

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **AI Integration**: OpenAI GPT-4o for bot responses
- **Session Management**: Express sessions with PostgreSQL store

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files

## Key Components

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Basic user authentication and profiles
- **Projects**: User-created projects for organizing work
- **Bot Sessions**: Individual chat sessions with AI bots
- **Chat Messages**: Conversation history between users and bots
- **Generated Assets**: AI-created content like logos, copy, strategies

### Bot System
- **60+ Specialized Bots**: Organized into four main sections (Marketing, Branding, Advertising, Analytics)
- **Individually Programmed Master Bots**: Each bot has unique interfaces and specialized capabilities
  - MarketingStrategyBot: Market analysis, ROI projections, channel strategies with visual charts
  - BrandingBot: Brand identity creation with color palettes, typography, visual guidelines
  - ContentCreatorBot: Multi-format content generation with SEO and distribution planning
  - SEOExpertBot: Technical audits, keyword research, competitor analysis with progress tracking
- **Visual Output Focus**: Bots provide charts, progress indicators, and structured data
- **Session Management**: Persistent sessions with full state restoration

### Storage Layer
- **Dual Storage Implementation**: Memory storage for development, database storage for production
- **Interface-Based Design**: IStorage interface allows switching between storage backends
- **Type Safety**: Drizzle ORM provides compile-time type checking

## Data Flow

1. **User Authentication**: Simple user system (currently hardcoded to userId=1 for demo)
2. **Project Creation**: Users create projects to organize their branding work
3. **Bot Interaction**: Users select bots and start chat sessions within projects
4. **AI Processing**: Messages sent to OpenAI GPT-4o with specialized prompts
5. **Asset Generation**: AI responses can include generated assets (logos, copy, etc.)
6. **Persistence**: All conversations and assets saved to database

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **openai**: OpenAI API integration for AI bot responses
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives

### Development Tools
- **Vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database migrations and schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Setup**: Drizzle migrations prepare PostgreSQL schema

### Environment Configuration
- **Development**: Uses memory storage, local development server
- **Production**: Requires `DATABASE_URL` and `OPENAI_API_KEY` environment variables
- **Replit Integration**: Special handling for Replit development environment

### Startup Scripts
- `npm run dev`: Development with hot reload
- `npm run build`: Production build
- `npm start`: Production server
- `npm run db:push`: Database schema updates

The application is designed as a modern full-stack TypeScript application with strong type safety, scalable architecture, and AI integration for delivering specialized branding assistance to startup users.