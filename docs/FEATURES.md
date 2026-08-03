# 🚀 Sizzle Feature Catalog

This document provides a comprehensive list of all implemented and planned features for the **Sizzle Restaurant Management System**.

---

## 🟢 Implemented Features

### 🔐 1. Authentication & User Management

| Feature | Status | Description |
| :--- | :---: | :--- |
| **User Registration** | `[Completed]` | Allows new users to create accounts with full name, email, password, phone, and role specification (`CUSTOMER`, `ADMIN`). Passwords are hashed with BCrypt. |
| **User Login** | `[Completed]` | Authenticates users against stored BCrypt credentials and issues a stateless JWT bearer token for authorized sessions. |
| **Profile Retrieval** | `[Completed]` | Fetches profile metadata for authenticated users via `GET /api/users/profile` using bearer tokens. |
| **Profile Updates** | `[Completed]` | Enables users to update name and phone number via `PUT /api/users/profile`. |
| **Role-Based Definitions** | `[Completed]` | System model supports distinct user roles: `CUSTOMER`, `ADMIN`, `CHEF`, `MANAGER`, `CASHIER`, `WAITER`. |

---

### 🎨 2. Web Frontend (Stage 3 - React 19 + TypeScript)

| Feature | Status | Description |
| :--- | :---: | :--- |
| **Interactive Menu Browsing** | `[Completed]` | Users can browse categorized food items with rich visuals, tags (spicy, vegetarian), and detailed descriptions. |
| **Live Menu Search** | `[Completed]` | Instant client-side search filtering menu items by name, category, or description. |
| **Category Sidebar Filter** | `[Completed]` | Quick navigation panel allowing users to filter dishes by categories (Starters, Main Course, Desserts, Beverages). |
| **Global Cart Management** | `[Completed]` | React Context API driven cart allowing users to add/remove items, adjust quantities, and calculate subtotals, taxes, and grand totals in real-time. |
| **Sticky Cart Bar** | `[Completed]` | Floating shopping cart shortcut displaying item count badges and total amount. |
| **Interactive Checkout Modal** | `[Completed]` | Modal workflow capturing customer delivery address, contact details, and payment selection. |
| **Digital Receipt Generator** | `[Completed]` | Post-checkout itemized modal summary displaying order ID, timestamp, breakdown, and tax calculation. |
| **Order History View** | `[Completed]` | Dedicated section rendering customer's previous orders and historical receipts. |
| **Toast Notifications** | `[Completed]` | Floating UI alerts providing feedback for cart updates, auth actions, and error handling. |

---

### ☕ 3. Backend Core (Spring Boot REST Service)

| Feature | Status | Description |
| :--- | :---: | :--- |
| **REST API Controller Architecture** | `[Completed]` | Layered controller architecture exposing structured `/api/auth` and `/api/users` endpoints. |
| **Spring Security Integration** | `[Completed]` | Security filter chain enforcing JWT authentication on protected routes while leaving public routes open. |
| **JPA Data Persistence** | `[Completed]` | Spring Data JPA ORM integration mapping Java domain models to relational tables. |
| **H2 In-Memory Database** | `[Completed]` | Zero-config local embedded database for rapid development and testing. |
| **Standardized API Response Wrapper** | `[Completed]` | Universal JSON response structure containing `success`, `message`, `data`, and ISO `timestamp`. |

---

### 📜 4. Historical Legacy Versions (Preserved via Git Tags)

| Version | Tag | Description |
| :--- | :---: | :--- |
| **Stage 1 (Java Console App)** | `v1` | Initial CLI-based restaurant ordering system covering menu display, cart building, subtotal calculations, and receipt output in terminal. |
| **Stage 2 (Enhanced Console)** | `version2` | Refined CLI version with modular package structure, input validation, expanded food categories, and cleaner console output formatting. |

---

## ⏳ Future Features (Planned Roadmap)

> [!NOTE]
> The following features are currently under development or scheduled for upcoming phases.

| Feature | Planned Phase | Description |
| :--- | :---: | :--- |
| **Dynamic Backend Menu CRUD** | Phase 2 | Full REST API (`/api/menu`, `/api/categories`) allowing admins to manage dishes dynamically from the database. |
| **Database Order Persistence** | Phase 4 | Server-side `Order` and `OrderItem` JPA models replacing client-side mock order history. |
| **Kitchen Display System (KDS)** | Phase 5 | Live order queue screen for chefs to transition orders from `PENDING` -> `PREPARING` -> `READY`. |
| **Inventory Management** | Phase 6 | Ingredients and stock tracking with automated low-stock warnings. |
| **Payment Gateway Integration** | Phase 7 | Real Stripe / PayPal checkout integration with instant webhooks. |
| **Business Analytics & Reporting** | Phase 8 | Dashboard metrics for daily revenue, popular items, peak order hours, and customer trends. |
| **AI Recommendation Engine** | Phase 9 | Personalized food recommendations using Google Gemini / Generative AI APIs. |

---

## 🔗 Related Documentation

- [Architecture Overview](file:///d:/Sizzle/Sizzle/docs/ARCHITECTURE.md)
- [API Documentation](file:///d:/Sizzle/Sizzle/docs/API_DOCUMENTATION.md)
- [Development Roadmap](file:///d:/Sizzle/Sizzle/ROADMAP.md)
