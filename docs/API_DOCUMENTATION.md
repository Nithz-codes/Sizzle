# 📡 Sizzle REST API Documentation

This document provides complete specification for all **currently implemented** REST API endpoints in the Sizzle backend server.

---

## 🌐 Base URL

- **Development Server**: `http://localhost:8080/api`
- **Content-Type**: `application/json`

---

## 📄 Standard API Response Format

All API endpoints return data wrapped in a consistent JSON structure:

```json
{
  "success": true,
  "message": "Operation response message",
  "data": { ... },
  "timestamp": "2026-08-03T09:30:00.123456"
}
```

---

## 🔐 Authentication Endpoints (`/api/auth`)

### 1. User Registration

Registers a new user account in the system.

- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth Required**: No (Public)

#### Request Body
```json
{
  "name": "Nithish V",
  "email": "nithish@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "role": "CUSTOMER"
}
```

| Field | Type | Required | Constraints |
| :--- | :--- | :---: | :--- |
| `name` | String | Yes | 2–100 chars, Non-blank |
| `email` | String | Yes | Valid email format, Unique |
| `password` | String | Yes | Min 6 chars |
| `phone` | String | No | Max 20 chars |
| `role` | String | No | Enum: `CUSTOMER`, `ADMIN` (Defaults to `CUSTOMER`) |

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "id": 1,
    "name": "Nithish V",
    "email": "nithish@example.com",
    "phone": "+1234567890",
    "role": "CUSTOMER"
  },
  "timestamp": "2026-08-03T09:31:10.452100"
}
```

#### Status Codes
- `201 Created`: User successfully registered.
- `400 Bad Request`: Validation failure (missing required fields or invalid email).
- `409 Conflict`: Email already exists.

---

### 2. User Login

Authenticates user credentials and returns a JWT Bearer Token.

- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth Required**: No (Public)

#### Request Body
```json
{
  "email": "nithish@example.com",
  "password": "SecurePassword123!"
}
```

| Field | Type | Required | Constraints |
| :--- | :--- | :---: | :--- |
| `email` | String | Yes | Valid email format |
| `password` | String | Yes | Non-blank |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaXRoaXNoQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU0MTkyNjAwLCJleHAiOjE3NTQyNzkwMDB9...",
    "tokenType": "Bearer",
    "id": 1,
    "name": "Nithish V",
    "email": "nithish@example.com",
    "phone": "+1234567890",
    "role": "CUSTOMER"
  },
  "timestamp": "2026-08-03T09:32:00.100200"
}
```

#### Status Codes
- `200 OK`: Successful authentication.
- `400 Bad Request`: Invalid input fields.
- `401 Unauthorized`: Invalid email or password.

---

## 👤 User Profile Endpoints (`/api/users`)

### 3. Get User Profile

Fetches profile details of the currently authenticated user.

- **Method**: `GET`
- **URL**: `/api/users/profile`
- **Auth Required**: Yes (`Bearer <token>`)

#### Request Headers
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "Nithish V",
    "email": "nithish@example.com",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "accountStatus": "ACTIVE",
    "createdAt": "2026-08-03T09:31:10",
    "updatedAt": "2026-08-03T09:31:10"
  },
  "timestamp": "2026-08-03T09:33:45.000100"
}
```

#### Status Codes
- `200 OK`: Profile retrieved successfully.
- `401 Unauthorized`: Missing, expired, or invalid JWT token.

---

### 4. Update User Profile

Updates editable profile fields (name and phone) for the logged-in user.

- **Method**: `PUT`
- **URL**: `/api/users/profile`
- **Auth Required**: Yes (`Bearer <token>`)

#### Request Headers
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### Request Body
```json
{
  "name": "Nithish V (Updated)",
  "phone": "+9876543210"
}
```

| Field | Type | Required | Constraints |
| :--- | :--- | :---: | :--- |
| `name` | String | Yes | 2–100 chars |
| `phone` | String | No | Max 20 chars |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "id": 1,
    "name": "Nithish V (Updated)",
    "email": "nithish@example.com",
    "phone": "+9876543210",
    "role": "CUSTOMER",
    "accountStatus": "ACTIVE",
    "createdAt": "2026-08-03T09:31:10",
    "updatedAt": "2026-08-03T09:34:00"
  },
  "timestamp": "2026-08-03T09:34:00.500000"
}
```

#### Status Codes
- `200 OK`: Profile successfully updated.
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Missing or invalid token.

---

## 🔗 Related Documentation

- [Architecture Guide](file:///d:/Sizzle/Sizzle/docs/ARCHITECTURE.md)
- [Security Specifications](file:///d:/Sizzle/Sizzle/docs/SECURITY.md)
- [Database Schema](file:///d:/Sizzle/Sizzle/docs/DATABASE_SCHEMA.md)
