## 📋 Project Overview

A modern, scalable, and culturally-tailored e-commerce platform purpose-built for the Saudi Arabian market. This project emphasizes a user-friendly interface, localized experience, and streamlined order lifecycle management.

> ⚠️ **Note:** Not all instructions should be followed blindly. AI tools and contributors are expected to follow modern best practices and provide the best advice, even if it means suggesting improvements or alternatives. Code must always remain **simple, clear, and easy to understand**, allowing developers to maintain and scale it over time.

> ⚠️ **Routes Note:** When referencing routes like `http://localhost:3000/dashboard/orders-management`, this means pointing to actual code paths within the App Router system (Next.js 15). Always interpret such paths as code-based, not as static or legacy page routing.

---

## 🎯 Project Scope

The platform consists of three interconnected applications, each with a distinct purpose:

### 🏍️ Customer Platform

* Intuitive product browsing with filterable search
* Persistent shopping cart using local storage
* Seamless order placement and tracking
* Real-time delivery updates via maps
* Payment integration *(on hold)*
* Secure user profile management
* Order history with status tracking
* Product favoriting system
* Social media sharing
* Real-time push notifications

### 📊 Admin Dashboard

* Sales analytics and real-time reporting
* Full product lifecycle management (CRUD, stock, inventory)
* Order processing and logistics control
* Customer account management
* Promotions and discount engine
* Driver assignment for deliveries
* Live order tracking interface
* Role-based access control
* Business performance metrics
* Financial overviews and export-ready reports

### 🚗 Driver Platform

* Order pickup and delivery workflows
* Live GPS tracking
* Optimized routing suggestions
* Delivery status updates with timestamps
* Daily/weekly earnings summaries
* Driver profile and history view
* Location-aware task assignment

---

## 🏗️ Project Structure (Monorepo-style)

```
www.ammawag.com/
├── app/                    # Next.js app directory (routes, pages, API)
├── components/            # Reusable UI components (global)
├── constant/              # App-wide constants and enums
├── fonts/                 # Custom font files and loaders
├── hooks/                 # Custom reusable React hooks
├── lib/                   # Shared business logic, API, utilities
├── prisma/                # Prisma schema, seeders, and migrations
├── provider/              # React context and providers
├── public/                # Static assets (images, icons)
├── store/                 # Zustand global state store
├── types/                 # Global TypeScript types and interfaces
├── utils/                 # Utility helpers and functions
├️ config files:
│   ├️ .env                  # Environment variables
│   ├️ auth-config.ts        # NextAuth setup
│   ├️ components.json       # shadcn UI configuration
│   ├️ next-config.ts        # Next.js setup
│   ├️ tailwind-config.ts    # TailwindCSS theme and plugins
│   └️ tsconfig.json         # TypeScript configuration
└── <route>/
    ├── components/           # Route-specific UI components
    ├── actions/              # Route-specific server actions
    └️ helper/               # Route-specific schemas/helpers
```

---

## 📝 Coding Standards & Conventions

### File Naming

* `kebab-case.ts` for general files (e.g., `fetch-orders.ts`)
* `PascalCase.tsx` for components (e.g., `ProductCard.tsx`)
* `camelCase.ts` for custom hooks prefixed with `use` (e.g., `useCart.ts`)
* `PascalCase.ts` for types/interfaces suffixed with `Type` or `Props`
* `SCREAMING_SNAKE_CASE.ts` for constants (e.g., `API_ENDPOINTS.ts`)

### Naming Conventions

* **Components:** PascalCase (e.g., `OrderSummary`)
* **Variables:** camelCase
* **Booleans:** prefixed with `is`, `has`, `should` (e.g., `isLoading`)
* **Constants:** SCREAMING\_SNAKE\_CASE
* **Arrays:** plural camelCase (e.g., `productsList`)
* **Private vars:** prefixed with `_` (e.g., `_tempValue`)

### Functions

* **General:** camelCase, verb-noun (e.g., `createOrder`)
* **Handlers:** prefixed with `handle` (e.g., `handleLogin`)
* **Async:** prefixed with verb (e.g., `fetchUserData`)
* **React props:** prefixed with `on` (e.g., `onClick`)
* **Context Providers:** PascalCase + `Provider` (e.g., `AuthProvider`)
* **Hooks:** camelCase with `use` prefix

### Code Quality

* Use `useActionState` for mutations
* Catch server errors and surface human-readable messages to UI
* Keep all code **simple and minimal** — easy to read, easy to refactor
* Never use hardcoded color values — always use semantic color tokens from the global Tailwind theme.
* If a new color is needed, add it to the global theme configuration file in the appropriate section to support both dark and light modes.
* When launching the development server, always check if port `3000` is already in use and reuse it if possible. Avoid blindly switching to other ports unless necessary — investigate if a process is already using it.
* Always use the latest and recommended Next.js APIs. When working with route `params` and `searchParams`, refer to the official upgrade documentation: [https://nextjs.org/docs/app/guides/upgrading/version-15#params--searchparams](https://nextjs.org/docs/app/guides/upgrading/version-15#params--searchparams)
* searchParams: { page?: string; pageSize?: string; reason?: string }; @ https://nextjs.org/docs/app/guides/upgrading/version-15#params--searchparams

### Database Schema (Prisma + MongoDB)

* **Models:** PascalCase singular (e.g., `Product`)
* **Fields:** camelCase (e.g., `createdAt`, `categoryName`)
* **Relations:** suffixed with `userId`, `productId`, etc.
* **Junction Tables:** PascalCase concatenated (e.g., `UserProduct`)

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15.2.1
* **Language:** TypeScript
* **Database:** Prisma ORM + MongoDB
* **Styling:** Tailwind CSS
* **Authentication:** NextAuth.js
* **UI Libraries:**

  * shadcn UI
  * Framer Motion
  * Sonner
  * SweetAlert2
* **Maps & Geo:** Google Maps API
* **Real-Time:** Pusher
* **State Management:** Zustand

---

## 🔐 Security & Best Practices

* Secure API keys via `.env`
* Session/auth managed by NextAuth
* Middleware-protected API routes
* Input validation via Zod
* Encrypted sensitive data
* Payment secured with industry standards (pending integration)
* Rate limiting + CORS + XSS protection

---

## 📱 Key Features

* Fully responsive
* Dark/light mode support
* Real-time delivery tracking
* Google Maps integration
* Cloudinary image upload
* Email and push notifications
* SEO & performance optimized
* Social sharing functionality
* Analytics integrations (GA, etc.)
* Smart caching strategies

---

## 🔄 Future Roadmap

* Full Arabic/English multi-language support
* Advanced BI dashboards
* Mobile app integration
* AI-based product recommendations
* Enhanced search & filtering
* Automated backups and migration tools
* Performance monitoring dashboards
* End-to-end test suite

---

## 🚀 Quality Assurance

### Code Quality

* ESLint + Prettier integration
* Strict TypeScript — never use `any`
* Auto-remove unused variables and imports
* Always follow lint rules for clarity and maintainability
* Never use hardcoded colors — always reference semantic colors from the design system

### Performance

* Lighthouse > 90
* Optimized images & assets
* Code splitting & lazy loading
* Bundle size reduction

### Accessibility

* WCAG 2.1 compliance
* Keyboard navigation support
* Screen reader compatible
* Adequate color contrast
* ARIA labeling throughout

---

Maintained by **DreamToApp Team** — Built for scale, optimized for experience.
