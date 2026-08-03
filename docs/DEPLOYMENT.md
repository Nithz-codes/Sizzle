# 🚀 Sizzle Deployment & Setup Guide

This document provides step-by-step instructions for setting up, running, configuring, and deploying the **Sizzle Restaurant Management System**.

---

## 📋 Prerequisites

Ensure the following tools are installed on your environment:

| Component | Minimum Version | Recommended |
| :--- | :---: | :---: |
| **Node.js** | `v18.0.0+` | `v20.x LTS` |
| **npm** | `v9.0.0+` | `v10.x` |
| **Java JDK** | `17` | `Java 21 LTS` |
| **Maven** | `3.8+` | `3.9+` |
| **Git** | `2.30+` | Latest |

---

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nithz-codes/sizzle.git
cd sizzle
```

---

### 2. Frontend Setup (React + TypeScript + Vite)

```bash
# Install frontend dependencies from root directory
npm install

# Start the Vite development server
npm run dev
```

- **Frontend URL**: `http://localhost:3000` (or `http://localhost:5173`)
- **Environment File**: Copy `.env.example` to `.env` if custom backend endpoints are needed:
  ```env
  VITE_API_BASE_URL=http://localhost:8080/api
  ```

---

### 3. Backend Setup (Spring Boot)

```bash
# Change directory to backend
cd backend

# Build and run the Spring Boot application
mvn spring-boot:run
```

- **Backend API Base**: `http://localhost:8080/api`
- **H2 Database Console**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:sizzledb`
  - **Username**: `sa`
  - **Password**: *(leave blank)*

---

## 🗄️ Database Configuration & Migration

### Default: Embedded H2 Database
The application defaults to H2 in-memory storage (`src/main/resources/application-h2.properties`):
```properties
spring.datasource.url=jdbc:h2:mem:sizzledb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

---

### Switching to MySQL / PostgreSQL

To transition from H2 to MySQL:

1. Update `backend/pom.xml` to include MySQL connector driver:
   ```xml
   <dependency>
       <groupId>com.mysql</groupId>
       <artifactId>mysql-connector-j</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

2. Modify `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/sizzle_db?createDatabaseIfNotExist=true&useSSL=false
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
   ```

---

## 🔑 Environment Variables Reference

| Environment Variable | Target | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Frontend | `http://localhost:8080/api` | Base URL for Spring Boot backend APIs |
| `PORT` | Backend | `8080` | Spring Boot HTTP server port |
| `APP_JWT_SECRET` | Backend | `9a2f8c...` | Secret key for signing JWT tokens |
| `APP_JWT_EXPIRATION` | Backend | `86400000` | Token expiration time in milliseconds (24h) |
| `APP_CORS_ALLOWED_ORIGINS` | Backend | `http://localhost:3000,http://localhost:5173` | Allowed origins for cross-origin requests |

---

## 🏭 Production Build & Deployment Preparation

### Frontend Bundle Production Build

```bash
# Build production bundle in root directory
npm run build
```
Output artifacts are generated in `/dist`. These static files can be served via Nginx, Vercel, Netlify, or AWS S3 + CloudFront.

### Backend Package Build

```bash
# Create executable JAR in backend directory
cd backend
mvn clean package -DskipTests
```
The compiled executable JAR will be located at `backend/target/backend-0.0.1-SNAPSHOT.jar`.

Run the production JAR:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

---

## 🔗 Related Documentation

- [Architecture Guide](file:///d:/Sizzle/Sizzle/docs/ARCHITECTURE.md)
- [Database Schema](file:///d:/Sizzle/Sizzle/docs/DATABASE_SCHEMA.md)
- [Security Specifications](file:///d:/Sizzle/Sizzle/docs/SECURITY.md)
