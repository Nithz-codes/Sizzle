# 🏗️ Sizzle Architecture Documentation

This document describes the architectural design and system structure of the **Sizzle Restaurant Management System**.

---

## 📐 System Overview

Sizzle is built using a modern decoupled architecture, separating the client-side presentation layer (**React + TypeScript + Vite**) from the server-side business logic and persistence layer (**Spring Boot + Spring Security + Spring Data JPA**).

```mermaid
graph TD
    Client["Client Browser (React 19 + TS)"]
    API["API Service (Axios / Fetch)"]
    Filter["JwtAuthenticationFilter"]
    SecConfig["SecurityConfig (Spring Security)"]
    AuthCtrl["AuthController (/api/auth/*)"]
    UserCtrl["UserController (/api/users/*)"]
    AuthService["AuthService"]
    Repo["UserRepository (Spring Data JPA)"]
    DB[("MySQL 8.x Database")]

    Client -->|HTTP / JSON| API
    API -->|Bearer Token Header| Filter
    Filter --> SecConfig
    SecConfig --> AuthCtrl
    SecConfig --> UserCtrl
    AuthCtrl --> AuthService
    UserCtrl --> AuthService
    AuthService --> Repo
    Repo --> DB
```

---

## 🎨 Frontend Architecture

The frontend application resides in the root `/src` directory and is constructed using **React 19**, **TypeScript**, and **Vite**.

```
src/
├── assets/          # Static images & branding assets
├── components/      # Modular UI components (Navbar, Hero, Menu, Cart, Modals)
├── context/         # React Context providers for global state (CartContext)
├── data/            # Local data models & mock dataset
├── services/        # Centralized HTTP API client (api.ts)
├── types.ts         # Global TypeScript interfaces & type definitions
├── main.tsx         # Application entrypoint
└── vite-env.d.ts    # Vite ambient client types
```

### Key Architectural Concepts
- **Component-Based UI**: Atomic, reusable components styled with custom CSS and Tailwind utilities.
- **Global State Management**: React Context API (`CartContext`) manages cart items, totals, badge counters, and checkout states across component boundaries.
- **Centralized API Service**: [src/services/api.ts](file:///d:/Sizzle/Sizzle/src/services/api.ts) abstracts HTTP requests, injecting `Authorization: Bearer <token>` headers from `localStorage`.

---

## ☕ Backend Architecture

The backend application lives inside the `/backend` directory and is powered by **Spring Boot 3.4.x** and **Java 21**.

```
backend/src/main/java/com/sizzle/backend/
├── SizzleBackendApplication.java   # Spring Boot Application Entry point
├── config/                        # Global CORS & application beans
├── controller/                    # REST API Controllers (AuthController, UserController)
├── dto/                           # Data Transfer Objects & validation schemas
├── exception/                     # Global exception handlers & custom errors
├── model/                         # JPA Entities (User, Role, AccountStatus)
├── repository/                    # Spring Data JPA Repositories (UserRepository)
├── security/                      # JWT Providers, Security Config, UserDetails Service
└── service/                       # Business logic services (AuthService)
```

---

## 🔒 Security Architecture

The backend employs a **Stateless JWT (JSON Web Token)** security model powered by **Spring Security**.

```mermaid
sequenceDiagram
    autonumber
    actor User as Client App
    participant Filter as JwtAuthenticationFilter
    participant Provider as JwtTokenProvider
    participant Context as SecurityContextHolder
    participant Endpoint as REST Controller

    User->>Filter: Request with Header `Authorization: Bearer <token>`
    alt Header Present & Starts with Bearer
        Filter->>Provider: validateToken(token)
        alt Token Valid
            Filter->>Provider: getUsernameFromJWT(token)
            Filter->>Context: Set Authentication(UsernamePasswordAuthenticationToken)
        end
    end
    Filter->>Endpoint: Proceed filter chain
    Endpoint-->>User: HTTP 200 OK Response
```

### Security Highlights
- **Password Hashing**: Passwords are salted and hashed using `BCryptPasswordEncoder`.
- **CORS Management**: Fine-grained CORS configuration allows frontend origins (`localhost:3000`, `localhost:5173`) while denying unauthorized cross-origin requests.
- **CSRF Protection**: Disabled for REST APIs relying on stateless JWT headers.

---

## 🗄️ Database Layer

- **Database Engine**: MySQL 8.x Database (configured via `application.properties`).
- **ORM & Data Mapping**: Spring Data JPA with Hibernate.
- **Schema Auto-Generation**: Tables are automatically generated on backend startup (`spring.jpa.hibernate.ddl-auto=update`).

---

## 🔄 Application Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as User / Customer
    participant UI as React UI (App.tsx)
    participant Service as API Service (api.ts)
    participant Auth as AuthController
    participant UserSvc as AuthService
    participant DB as MySQL Database

    Customer->>UI: Fills Registration Form
    UI->>Service: authApi.register(payload)
    Service->>Auth: POST /api/auth/register
    Auth->>UserSvc: register(RegisterRequest)
    UserSvc->>DB: Save User Entity (BCrypt Password)
    DB-->>UserSvc: Saved User
    UserSvc-->>Auth: AuthResponse (JWT Token + User Metadata)
    Auth-->>Service: 201 Created + JSON Response
    Service-->>UI: Save Token to localStorage & Update Auth State
    UI-->>Customer: Display Success Toast & Authenticated State
```

---

## 🔗 Related Documentation

- [Features Catalog](file:///d:/Sizzle/Sizzle/docs/FEATURES.md)
- [API Documentation](file:///d:/Sizzle/Sizzle/docs/API_DOCUMENTATION.md)
- [Database Schema](file:///d:/Sizzle/Sizzle/docs/DATABASE_SCHEMA.md)
- [Security Architecture](file:///d:/Sizzle/Sizzle/docs/SECURITY.md)
