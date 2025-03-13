# About "Onde ir"

Onde ir is a comprehensive food advisory platform designed to help users discover and share experiences about various food establishments, similar to TripAdvisor but with a focus on specific categories such as restaurants (more categories will be added in the future).

This Next.js fullstack project leverages modern web technologies and libraries to create a robust and user-friendly application.

Project Framework: The project is built using Next.js, a powerful framework that enables server-side rendering and static site generation, providing an optimized performance and improved SEO.

## 🔥 Core Features
### 🚀 Authentication
- User signup and signin
- Forgot password flow (email-based recovery)
- Change password functionality
- Welcome email upon successful registration

### 🌍 App Features
- Admin Dashboard to approve/decline posts and manage pending submissions
- Explore places with infinite scroll and diverse filtering options
- Place rating system (1 to 5 stars)
- Comment system with nested replies and likes

### 🛠️ Technologies & Strategies
- Next.js with server actions for efficient data handling
- Node postgres (pg) for database connections and queries
- Shadcn for UI components
- Vitest for unit and integration testing
- Zod for input validation
- IBGE API for selecting states and cities (improving UX in the post creation form)
- AWS Services (S3, Lambda, CloudFront) for photo uploads
- Resend for email notifications

## Status 🚧

- Work in progress

## Getting Started 💻

_you must have `docker` installed_

### Step 1:

- Copy ".env" file and create a ".env.local"

```bash
cp .env .env.local
```

### Step 2:

- With docker running on your machine, run the development server:

> it will compose the docker file and run development server

```bash
pnpm dev
```

### Step 3:

- Open you browser in http://localhost:3000

## Database Modeling 🐳

![modeling](./onde-ir-data-modeling.png)
