# MarketingAI Platform

## Overview

MarketingAI is a full-stack AI-powered marketing intelligence platform that helps businesses analyze competitors, create content, and develop marketing strategies. The application combines React frontend with Express backend, utilizing OpenAI for AI capabilities and PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **AI Integration**: OpenAI GPT-4o for content generation and analysis

### Database Design
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations in `./migrations` directory
- **Key Tables**:
  - `users` - User authentication and profile data
  - `companies` - Company information and context
  - `competitors` - Competitor tracking
  - `competitive_analyses` - AI-generated competitive insights
  - `content_items` - Generated content pieces
  - `content_strategies` - Strategic content planning
  - `sessions` - Session storage for authentication

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC
- **Session Storage**: PostgreSQL-backed sessions
- **Security**: HTTP-only cookies with secure flags
- **Authorization**: Route-level protection with middleware

### AI Services
- **Competitive Analysis**: Automated competitor research and insights
- **Content Generation**: AI-powered content creation with customizable parameters
- **Strategic Planning**: Content strategy and positioning recommendations
- **Model**: OpenAI GPT-4o for consistent, high-quality outputs

### User Interface
- **Design System**: Consistent component library with dark/light theme support
- **Layout**: Responsive sidebar navigation with mobile optimization
- **Forms**: Validated forms with real-time feedback
- **Data Visualization**: Progress indicators and analytics displays

### Content Management
- **Creation Workflow**: Multi-step content generation with customization
- **Calendar Integration**: Visual content planning and scheduling
- **Status Tracking**: Draft, review, and published content states
- **Export Capabilities**: Content download and sharing features

## Data Flow

1. **Authentication Flow**:
   - User initiates login through Replit Auth
   - OIDC provider validates credentials
   - Session created and stored in PostgreSQL
   - User redirected to dashboard

2. **Content Generation Flow**:
   - User submits content parameters
   - Backend validates input with Zod schemas
   - OpenAI API called with structured prompts
   - Generated content stored in database
   - Real-time updates via React Query

3. **Competitive Analysis Flow**:
   - User adds competitor information
   - AI analyzes competitor data and market positioning
   - Results stored with structured insights
   - Dashboard displays actionable recommendations

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT-4o for AI capabilities
- **Replit Auth**: Authentication and user management

### Development Tools
- **Replit**: Development environment and deployment
- **Vite**: Build tooling with hot module replacement
- **ESBuild**: Server-side bundling for production

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form state management

## Deployment Strategy

### Development Environment
- **Platform**: Replit with hot reloading
- **Database**: Neon development instance
- **Build Process**: Concurrent client/server development

### Production Build
- **Client**: Vite builds optimized React bundle to `dist/public`
- **Server**: ESBuild bundles Express server to `dist/index.js`
- **Static Assets**: Served directly by Express in production
- **Database**: Production Neon PostgreSQL instance

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OIDC provider endpoint

### Scaling Considerations
- Stateless server design for horizontal scaling
- Database connection pooling via Neon
- CDN-ready static asset structure
- Session store external to application instances