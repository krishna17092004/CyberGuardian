# CyberSentinel AI - Interactive Cybersecurity Platform

## Overview

CyberSentinel AI is a next-generation cybersecurity command center platform that provides real-time threat detection, analysis, and mitigation capabilities. The application features an AI-powered threat monitoring system with interactive educational components, multi-role access control, and a futuristic cybersecurity-themed user interface. Built as a full-stack web application, it combines real-time data visualization, gamified learning experiences, and comprehensive reporting tools for cybersecurity professionals and trainees.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React** with **TypeScript** and follows a modern component-based architecture. The UI leverages **Tailwind CSS** for styling with a custom cybersecurity theme featuring dark mode aesthetics and neon accent colors (cyan, magenta, electric blue). The application uses **shadcn/ui** components for consistent design patterns and **Radix UI** primitives for accessibility.

Key architectural decisions include:
- **Single Page Application (SPA)** with client-side routing using Wouter
- **Component-driven development** with reusable UI components
- **Custom design system** implementing cybersecurity-themed colors and typography
- **Responsive layout** supporting desktop and mobile interfaces
- **Real-time updates** through WebSocket connections

### Backend Architecture
The server is built using **Express.js** with **TypeScript** in an ESM module environment. The backend follows a RESTful API design pattern with real-time capabilities through WebSocket integration.

Core backend components:
- **Express server** handling HTTP requests and WebSocket connections
- **Modular route organization** separating API endpoints by functionality
- **Storage abstraction layer** providing a clean interface for database operations
- **Real-time broadcasting** system for live threat updates
- **AI integration** through OpenAI GPT-5 for intelligent chat assistance

### Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The database schema supports:
- **User management** with role-based access control (admin, analyst, operator)
- **Threat detection and tracking** with severity classifications and status management
- **News and intelligence articles** for cybersecurity awareness
- **Training simulations** and user progress tracking
- **Chat message history** and system metrics logging

Database design emphasizes:
- **Structured threat data** with metadata support for different threat types
- **Audit trails** for user activities and system events
- **Time-series data** for metrics and performance tracking
- **Relational integrity** between users, threats, and activities

### Authentication and Authorization
The system implements a **role-based access control (RBAC)** model with three primary user roles:
- **Admin**: Full system access and user management
- **Analyst**: Advanced threat analysis and reporting capabilities  
- **Operator**: Basic monitoring and response functions

User sessions are managed through secure cookie-based authentication with PostgreSQL session storage using `connect-pg-simple`.

### Real-Time Communication
**WebSocket connections** provide live updates for:
- **Threat detection alerts** with immediate notification
- **System metric updates** for dashboard refresh
- **Chat message delivery** for AI assistant interactions
- **Collaborative features** for multi-user environments

The WebSocket implementation includes automatic reconnection logic and subscription management for different data streams.

## External Dependencies

### Database Services
- **Neon Database** (PostgreSQL-compatible serverless database)
- **Drizzle ORM** for database schema management and migrations
- **Redis** for caching (referenced but not yet implemented)

### AI and Machine Learning
- **OpenAI API** (GPT-5) for intelligent chat assistance and threat analysis
- **Real-time inference capabilities** for threat classification
- **Natural language processing** for cybersecurity information queries

### Development and Build Tools
- **Vite** for frontend development server and build process
- **ESBuild** for server-side TypeScript compilation
- **TypeScript** for type safety across the entire stack
- **TailwindCSS** and **PostCSS** for styling and CSS processing

### UI and Component Libraries
- **shadcn/ui** component library built on Radix UI primitives
- **Radix UI** for accessible component foundations
- **Lucide React** for consistent iconography
- **React Query (TanStack Query)** for server state management
- **React Hook Form** with **Zod** for form validation

### Utility Libraries
- **date-fns** for date manipulation and formatting
- **clsx** and **tailwind-merge** for conditional CSS classes
- **nanoid** for unique identifier generation
- **WebSocket (ws)** for real-time server communications

### Deployment and Runtime
- **Node.js** ESM runtime environment
- **Replit** development and hosting platform integration
- **Environment-based configuration** for different deployment stages