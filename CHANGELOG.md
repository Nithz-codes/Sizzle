# 📝 Changelog

All notable changes to the **Sizzle** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Dynamic Spring Boot Menu & Category management REST APIs (`/api/menu`, `/api/categories`).
- Database entity mapping for Orders and Order Items (`/api/orders`).
- Admin CRUD portal for managing restaurant items.

---

## [0.1.0] - 2026-08-03

### Added
- **Spring Boot 3.4.x REST Backend**: Initialized Java 21 Spring Boot REST server under `/backend`.
- **JWT Authentication Security**:
  - Added `JwtTokenProvider` for signing and validating HS256 JWT tokens.
  - Implemented `JwtAuthenticationFilter` and `SecurityConfig` stateless filter chain.
  - Integrated `BCryptPasswordEncoder` for user password hashing.
- **Auth & User REST Endpoints**:
  - `POST /api/auth/register` — User account creation.
  - `POST /api/auth/login` — Authentication & token issuance.
  - `GET /api/users/profile` — Authenticated profile retrieval.
  - `PUT /api/users/profile` — Profile update endpoint.
- **Database Model**: Created `User` JPA entity with `Role` and `AccountStatus` enums on embedded H2 database.
- **Frontend API Integration**: Centralized API service ([src/services/api.ts](file:///d:/Sizzle/Sizzle/src/services/api.ts)) linking React application with Spring Boot endpoints.
- **Vite Ambient Types**: Added [src/vite-env.d.ts](file:///d:/Sizzle/Sizzle/src/vite-env.d.ts) and configured `"types": ["vite/client"]` in `tsconfig.json`.

---

## [3.0.0] - 2026-07-26

### Added
- **React 19 + TypeScript Web App**: Rebuilt Sizzle from console app to full-fledged single page application.
- **Responsive UI/UX**: Hero section, category navigation sidebar, food item cards, and live search filtering.
- **Context API Cart Management**: Global cart state handling item additions, removals, quantity changes, and badge counters.
- **Checkout & Digital Receipts**: Interactive checkout modal with delivery details, itemized digital receipts, and local order history view.

---

## [2.0.0] - 2026-07-16 *(Git Tag: `version2`)*

### Added
- **Enhanced Java Console App**: Refined OOP architecture with modular package structure (`model`, `service`, `util`).
- **Expanded Menu**: Additional food categories, items, and input validation guards against invalid terminal selections.
- **Formatted Receipts**: Formatted text-based receipt generator in console output.

---

## [1.0.0] - 2026-07-01 *(Git Tag: `v1`)*

### Added
- **Initial Java Console App**: First version of Sizzle implementing core restaurant ordering concepts in Java CLI.
- **Cart & Subtotal Logic**: Terminal menu display, quantity inputs, subtotal calculations, and receipt printing.

---

## 🔗 Related Documentation

- [Project Progress](file:///d:/Sizzle/Sizzle/PROJECT_PROGRESS.md)
- [Roadmap](file:///d:/Sizzle/Sizzle/ROADMAP.md)
