# Tours & Travels Server — Documentation

> **Project:** `tours-travels-server`  
> **Version:** 1.0.0  
> **Runtime:** Node.js (ES Modules)  
> **Live Domain:** [primetraveller.in](https://www.primetraveller.in)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture](#4-architecture)
5. [Configuration & Environment Variables](#5-configuration--environment-variables)
6. [Database Models](#6-database-models)
7. [API Reference](#7-api-reference)
   - [Admin Auth](#71-admin-auth-apiadmin)
   - [Packages](#72-packages-apipackage)
   - [Destinations](#73-destinations-apidestination)
   - [Enquiries](#74-enquiries-apienquiry)
   - [Feedback](#75-feedback-apifeedback)
   - [Insights](#76-insights-apiinsight)
   - [Utility Routes](#77-utility-routes)
8. [Authentication System](#8-authentication-system)
9. [Middleware](#9-middleware)
10. [Services](#10-services)
11. [Utilities](#11-utilities)
12. [Third-Party Integrations](#12-third-party-integrations)
13. [Scheduled Jobs](#13-scheduled-jobs)
14. [CORS Policy](#14-cors-policy)
15. [Setup & Running the Project](#15-setup--running-the-project)

---

## 1. Project Overview

**Tours & Travels Server** is the backend REST API for the **Prime Traveller** travel platform. It powers both the
public-facing customer website (`primetraveller.in`) and the admin dashboard (`admin.primetraveller.in`).

### Key Capabilities

| Feature                  | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| **Tour Packages**        | Full CRUD for travel packages with image management via Cloudinary      |
| **Destinations**         | Manage travel destinations with associated gallery images               |
| **Enquiries**            | Customers can submit enquiries; admins can track and update status      |
| **Feedback System**      | Token-based feedback link generation; customers rate their experience   |
| **Analytics / Insights** | Real-time visitor tracking, page view counting, enquiry click analytics |
| **Admin Authentication** | JWT-based auth with access/refresh token pair, persistent sessions      |
| **Push Notifications**   | Firebase Cloud Messaging (FCM) push notifications to admin devices      |

---

## 2. Tech Stack

| Layer              | Technology             | Version |
| ------------------ | ---------------------- | ------- |
| Runtime            | Node.js (ESM)          | —       |
| Web Framework      | Express                | ^5.2.1  |
| Database           | MongoDB (via Mongoose) | ^9.9.2  |
| Authentication     | JWT (`jsonwebtoken`)   | ^9.0.3  |
| Password Hashing   | bcryptjs               | ^3.0.3  |
| Image Storage      | Cloudinary SDK         | ^2.10.1 |
| File Upload        | Multer                 | ^2.2.0  |
| Push Notifications | Firebase Admin SDK     | ^14.5.0 |
| Scheduled Tasks    | node-cron              | ^4.6.0  |
| Environment Config | dotenv                 | ^17.4.2 |
| HTTP Client        | axios                  | ^1.19.0 |
| Cookie Parsing     | cookie-parser          | ^1.4.7  |
| IP Detection       | request-ip             | ^3.3.0  |
| CORS               | cors                   | ^2.8.6  |

---

## 3. Project Structure

```
tours-travels-server/
│
├── src/
│   ├── index.js                    # Application entry point
│   │
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── cloudinary.js           # Cloudinary + Multer setup
│   │   └── firebase.config.js      # Firebase Admin initialization
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── admin.schema.js
│   │   ├── session.schema.js
│   │   ├── packages.schema.js
│   │   ├── destinations.schema.js
│   │   ├── enquiry.schema.js
│   │   ├── feedback.schema.js
│   │   ├── feedback.link.schema.js
│   │   └── insight.schema.js
│   │
│   ├── routes/                     # Express routers
│   │   ├── admin.auth.routes.js
│   │   ├── package.routes.js
│   │   ├── destination.routes.js
│   │   ├── enquiry.routes.js
│   │   ├── feedback.routes.js
│   │   └── insight.routes.js
│   │
│   ├── controllers/                # Request handlers
│   │   ├── admin.auth.controller.js
│   │   ├── package.controller.js
│   │   ├── destination.controller.js
│   │   ├── enquiry.controller.js
│   │   ├── feedback.controller.js
│   │   └── insight.controller.js
│   │
│   ├── services/                   # Business logic layer
│   │   ├── auth.services.js
│   │   ├── jwt.services.js
│   │   ├── bcrypt.services.js
│   │   ├── session.services.js
│   │   ├── admin.services.js
│   │   ├── package.services.js
│   │   ├── destination.services.js
│   │   ├── enquiry.services.js
│   │   ├── feedback.services.js
│   │   ├── insight.services.js
│   │   └── cloudinary.services.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js      # JWT verification + token refresh
│   │
│   └── utils/
│       ├── uploadToCloudinary.js   # Stream-upload helper
│       └── deleteFromCloudinary.js # Bulk-delete helper
│
├── .env                            # Secrets (not committed)
├── .env.example                    # Environment variable template
├── firebase-service-account-key.json
├── package.json
└── DOCUMENTATION.md
```

---

## 4. Architecture

The server follows a layered **MVC + Service** architecture:

```
Client Request
      │
      ▼
  Express Router  ──► Auth Middleware (verifyAuthentication)
      │
      ▼
  Controller  (validates input, calls services, formats response)
      │
      ▼
  Service Layer  (business logic, DB queries)
      │
      ▼
  Mongoose Model  (MongoDB)
```

- **Routes** define the URL paths and which middleware/controllers handle them.
- **Controllers** parse request data and call service functions. They never interact with models directly.
- **Services** contain all business/database logic. They are the single source of truth for data operations.
- **Models** define MongoDB schemas and are used only inside service files.
- **Middleware** intercepts requests for cross-cutting concerns (e.g., authentication).
- **Utils** are stateless helper functions (e.g., Cloudinary upload/delete).

---

## 5. Configuration & Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# MongoDB
MONGO_DB_URI=<your_mongodb_connection_string>

# JSON Web Token
JWT_SECRET=<your_jwt_secret>

# Server Port
PORT=3000

# Cloudinary (Image CDN)
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# Firebase (Push Notifications)
FIREBASE_SERVICE_ACCOUNT_CONFIG='<stringified JSON of service account key>'
```

> **Note:** The `FIREBASE_SERVICE_ACCOUNT_CONFIG` env var should contain the full JSON content of the Firebase service
> account key file as a single-line escaped JSON string.

---

## 6. Database Models

### 6.1 Admin

Stores admin user accounts. A maximum of **2 admins** can be registered.

| Field       | Type     | Notes                                      |
| ----------- | -------- | ------------------------------------------ |
| `name`      | String   | Required                                   |
| `email`     | String   | Required, unique                           |
| `password`  | String   | Required, bcrypt-hashed                    |
| `fcmToken`  | [String] | Array of FCM tokens for push notifications |
| `createdAt` | Date     | Auto (timestamps)                          |
| `updatedAt` | Date     | Auto (timestamps)                          |

---

### 6.2 Session

Tracks active authentication sessions for refresh token validation.

| Field       | Type   | Notes                         |
| ----------- | ------ | ----------------------------- |
| `sessionId` | String | Required, unique UUID         |
| `email`     | String | Admin email linked to session |
| `userAgent` | String | Browser/device info           |
| `ip`        | String | Client IP address             |
| `createdAt` | Date   | Auto (timestamps)             |

---

### 6.3 Package

The core travel package model.

| Field              | Type                      | Notes                                     |
| ------------------ | ------------------------- | ----------------------------------------- |
| `name`             | String                    | Required                                  |
| `slug`             | String                    | Unique, URL-safe auto-generated from name |
| `description`      | String                    | —                                         |
| `location.name`    | String                    | Required                                  |
| `location.url`     | String                    | Optional map/location link                |
| `duration.days`    | Number                    | Required                                  |
| `duration.nights`  | Number                    | Required                                  |
| `price.currency`   | String                    | Default: `'INR'`                          |
| `price.actual`     | Number                    | Required (original price)                 |
| `price.discounted` | Number                    | Required (selling price)                  |
| `img`              | Object `{url, publicId}`  | Thumbnail image                           |
| `images`           | Array `[{url, publicId}]` | Gallery images                            |
| `destinations`     | [String]                  | List of destination names                 |
| `inclusions`       | [String]                  | What's included                           |
| `exclusions`       | [String]                  | What's excluded                           |
| `itinerary`        | [DayPlan]                 | Day-wise plan (see below)                 |
| `isActive`         | Boolean                   | Default: `true`                           |
| `createdAt`        | Date                      | Auto (timestamps)                         |

**DayPlan Sub-schema:**

| Field           | Type   | Notes                                               |
| --------------- | ------ | --------------------------------------------------- |
| `dayNumber`     | Number | Required                                            |
| `title`         | String | Required                                            |
| `description`   | String | —                                                   |
| `activities`    | Array  | `[{name, notes, isExtraCharge, extraChargeAmount}]` |
| `mealsIncluded` | Object | `{breakfast, lunch, dinner}` — all Boolean          |

---

### 6.4 Destination

Represents a travel destination category.

| Field       | Type                      | Notes                             |
| ----------- | ------------------------- | --------------------------------- |
| `name`      | String                    | Required                          |
| `places`    | [String]                  | Sub-places within the destination |
| `images`    | Array `[{url, publicId}]` | Gallery images (up to 10)         |
| `createdAt` | Date                      | Auto (timestamps)                 |

---

### 6.5 Enquiry

Customer enquiry/booking request.

| Field       | Type   | Notes                                  |
| ----------- | ------ | -------------------------------------- |
| `name`      | String | Required                               |
| `email`     | String | Optional                               |
| `phone`     | String | Required                               |
| `package`   | String | Required (package name or ID)          |
| `adults`    | Number | Required                               |
| `kids`      | Number | Default: `0`                           |
| `message`   | String | Required                               |
| `status`    | String | `"pending"` (default) or `"completed"` |
| `createdAt` | Date   | Auto (timestamps)                      |

---

### 6.6 Feedback

Customer satisfaction feedback submitted via a secure token link.

| Field           | Type   | Notes                        |
| --------------- | ------ | ---------------------------- |
| `name`          | String | Required                     |
| `package`       | String | Required                     |
| `feedback`      | Array  | `[{question, rating (1–5)}]` |
| `overallRating` | Number | —                            |
| `review`        | String | —                            |
| `createdAt`     | Date   | Auto (timestamps)            |

---

### 6.7 FeedbackLink

Token-protected links generated by admins and sent to customers for feedback collection.

| Field       | Type     | Notes                      |
| ----------- | -------- | -------------------------- |
| `package`   | String   | Required                   |
| `questions` | [String] | List of feedback questions |
| `token`     | String   | Required, unique token     |
| `url`       | String   | Full feedback URL          |
| `isValid`   | Boolean  | Default: `true`            |
| `createdAt` | Date     | Auto (timestamps)          |

---

### 6.8 Insight (Daily Analytics)

A new `Insight` document is created every day at midnight (IST) via cron job.

| Field                    | Type   | Notes                            |
| ------------------------ | ------ | -------------------------------- |
| `visitors`               | Number | Unique visitor count for the day |
| `enquiryClicks.form`     | Number | Form enquiry clicks              |
| `enquiryClicks.whatsapp` | Number | WhatsApp enquiry clicks          |
| `pageViews`              | Number | Total page view count            |
| `createdAt`              | Date   | Auto (timestamps)                |

---

### 6.9 GlobalStat

Aggregate statistics across all time (running totals).

| Field          | Type   | Notes                  |
| -------------- | ------ | ---------------------- |
| `packages`     | Number | Total packages created |
| `destinations` | Number | Total destinations     |
| `visitors`     | Number | All-time visitors      |
| `enquiries`    | Number | All-time enquiries     |
| `pageViews`    | Number | All-time page views    |
| `createdAt`    | Date   | Auto (timestamps)      |

---

## 7. API Reference

> **Base URL:** `https://www.primetraveller.in` (or `http://localhost:PORT` in development)  
> **🔒** = Requires authentication (valid `access_token` or `refresh_token` cookie)

---

### 7.1 Admin Auth — `/api/admin`

| Method  | Endpoint              | Auth | Description                           |
| ------- | --------------------- | ---- | ------------------------------------- |
| `POST`  | `/api/admin/register` | 🔒   | Register a new admin (max 2 allowed)  |
| `POST`  | `/api/admin/login`    | —    | Login and receive auth cookies        |
| `POST`  | `/api/admin/logout`   | —    | Logout and clear auth cookies         |
| `GET`   | `/api/admin/`         | 🔒   | Get the currently authenticated admin |
| `PATCH` | `/api/admin/password` | 🔒   | Change admin password                 |

**POST `/api/admin/login`** — Request Body:

```json
{
  "email": "admin@example.com",
  "password": "your_password",
  "fcmToken": "firebase_cloud_messaging_token"
}
```

**POST `/api/admin/register`** — Request Body:

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "your_password"
}
```

**PATCH `/api/admin/password`** — Request Body:

```json
{
  "oldPassword": "current_password",
  "newPassword": "new_password"
}
```

---

### 7.2 Packages — `/api/package`

| Method   | Endpoint           | Auth | Description                                      |
| -------- | ------------------ | ---- | ------------------------------------------------ |
| `GET`    | `/api/package/`    | —    | Get all packages                                 |
| `GET`    | `/api/package/:id` | —    | Get a single package by ID or slug               |
| `POST`   | `/api/package/`    | 🔒   | Create a new package (multipart/form-data)       |
| `PATCH`  | `/api/package/:id` | 🔒   | Update an existing package (multipart/form-data) |
| `DELETE` | `/api/package/:id` | 🔒   | Delete a package and its Cloudinary images       |

**POST / PATCH** — `multipart/form-data` fields:

- `data` — JSON string containing all package fields
- `thumbnail` — Single image file (max 1, max 10MB)
- `images` — Multiple image files (max 10, max 10MB each)
- `public_id` — Comma-separated Cloudinary public IDs of images to delete (PATCH only)

---

### 7.3 Destinations — `/api/destination`

| Method   | Endpoint               | Auth | Description                                    |
| -------- | ---------------------- | ---- | ---------------------------------------------- |
| `GET`    | `/api/destination/`    | —    | Get all destinations                           |
| `GET`    | `/api/destination/:id` | —    | Get a single destination                       |
| `POST`   | `/api/destination/`    | 🔒   | Create a new destination (multipart/form-data) |
| `PATCH`  | `/api/destination/:id` | 🔒   | Update a destination (multipart/form-data)     |
| `DELETE` | `/api/destination/:id` | 🔒   | Delete a destination and its images            |

**POST / PATCH** — `multipart/form-data` fields:

- `images` — Image files (max 10, max 10MB each)
- Other fields as JSON body fields (`name`, `places`)

---

### 7.4 Enquiries — `/api/enquiry`

| Method   | Endpoint               | Auth | Description                                       |
| -------- | ---------------------- | ---- | ------------------------------------------------- |
| `GET`    | `/api/enquiry/`        | 🔒   | Get all enquiries                                 |
| `GET`    | `/api/enquiry/:status` | 🔒   | Count enquiries by status (`pending`/`completed`) |
| `POST`   | `/api/enquiry/`        | —    | Submit a new enquiry (public)                     |
| `PATCH`  | `/api/enquiry/:id`     | 🔒   | Update enquiry status                             |
| `DELETE` | `/api/enquiry/:id`     | 🔒   | Delete an enquiry                                 |

**POST `/api/enquiry/`** — Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91XXXXXXXXXX",
  "package": "Goa Beach Package",
  "adults": 2,
  "kids": 1,
  "message": "Interested in booking for December"
}
```

---

### 7.5 Feedback — `/api/feedback`

| Method   | Endpoint                    | Auth | Description                           |
| -------- | --------------------------- | ---- | ------------------------------------- |
| `GET`    | `/api/feedback/`            | —    | Get all feedback                      |
| `POST`   | `/api/feedback/:token`      | —    | Submit feedback using a secure token  |
| `DELETE` | `/api/feedback/:id`         | 🔒   | Delete a feedback entry               |
| `GET`    | `/api/feedback/link`        | —    | Get all feedback links                |
| `GET`    | `/api/feedback/link/:token` | —    | Get a specific feedback link by token |
| `POST`   | `/api/feedback/link/create` | 🔒   | Create a new feedback link            |
| `DELETE` | `/api/feedback/link/:id`    | 🔒   | Delete a feedback link                |

**POST `/api/feedback/link/create`** — Request Body:

```json
{
  "package": "Manali Package",
  "questions": ["How was the accommodation?", "How was the food?"]
}
```

**POST `/api/feedback/:token`** — Request Body:

```json
{
  "name": "Jane Doe",
  "feedback": [
    { "question": "How was the accommodation?", "rating": 5 },
    { "question": "How was the food?", "rating": 4 }
  ],
  "overallRating": 4.5,
  "review": "Excellent trip!"
}
```

---

### 7.6 Insights — `/api/insight`

| Method  | Endpoint              | Auth | Description                                |
| ------- | --------------------- | ---- | ------------------------------------------ |
| `POST`  | `/api/insight/`       | —    | Track initial page load / unique visitor   |
| `POST`  | `/api/insight/new`    | —    | Manually create a new daily insight record |
| `GET`   | `/api/insight/`       | 🔒   | Get insights for a date range              |
| `PATCH` | `/api/insight/click`  | —    | Increment WhatsApp enquiry click count     |
| `PATCH` | `/api/insight/visit`  | —    | Increment page view count                  |
| `GET`   | `/api/insight/global` | 🔒   | Get global/aggregate statistics            |

**GET `/api/insight/`** — Query params:

- `start` — Start date (`YYYY-MM-DD`)
- `end` — End date (`YYYY-MM-DD`)

**POST `/api/insight/`** — Request Body:

```json
{
  "v_id": "optional_visitor_id_if_already_tracked"
}
```

> If `v_id` is present, the server skips incrementing the visitor count (prevents double-counting).

---

### 7.7 Utility Routes

| Method | Endpoint                 | Auth | Description                                   |
| ------ | ------------------------ | ---- | --------------------------------------------- |
| `GET`  | `/api/ping`              | —    | Health check — returns `{ message: "alive" }` |
| `POST` | `/api/push-notification` | —    | Send a test FCM push notification to admin    |

**POST `/api/push-notification`** — Request Body:

```json
{
  "title": "New Enquiry!",
  "body": "A customer submitted an enquiry."
}
```

---

## 8. Authentication System

The server uses a **dual-token JWT authentication** pattern:

### Tokens

| Token           | Storage           | Expiry         | Purpose                    |
| --------------- | ----------------- | -------------- | -------------------------- |
| `access_token`  | `HttpOnly` cookie | **30 minutes** | Authorizes API requests    |
| `refresh_token` | `HttpOnly` cookie | **7 days**     | Refreshes the access token |

### Cookie Configuration

All auth cookies are set with:

```js
{ httpOnly: true, secure: true, sameSite: "None" }
```

This enables cross-origin cookie sharing (required for separate admin frontend domain) while being protected from XSS.

### Token Refresh Flow

```
Request arrives ──► Has access_token?
                         │
                   YES ──► Verify → Attach user → next()
                   NO  ──► Has refresh_token?
                                  │
                            YES ──► Verify → Look up Session DB
                                     → Get Admin → Issue new tokens
                                     → Set cookies → next()
                            NO  ──► next() (req.user = null)
```

The middleware **always calls `next()`** — route handlers are responsible for checking `req.user` and rejecting
unauthorized requests.

### Session Management

On login, a `Session` document is created in MongoDB containing:

- A unique `sessionId` (UUID)
- The admin's email
- The client `userAgent` and `ip`

The refresh token payload only carries the `sessionId`. On refresh, the server validates the session exists in the DB,
fetches the admin, and issues a new token pair. Logout deletes the session document, invalidating the refresh token.

### FCM Token Management

On login, if an `fcmToken` (Firebase Cloud Messaging) is provided and not already registered for the admin, it is pushed
to the admin's `fcmToken` array. This enables push notifications to multiple devices.

---

## 9. Middleware

### `verifyAuthentication` — `src/middlewares/auth.middleware.js`

The single authentication middleware used across all protected routes.

- Reads `access_token` and `refresh_token` from request cookies.
- Verifies the access token with the JWT secret.
- If the access token is expired/missing, attempts a silent token refresh using the refresh token.
- Attaches the decoded user payload to `req.user`.
- Calls `next()` in all cases — controllers must check `req.user` themselves.

---

## 10. Services

| Service File              | Responsibility                                                     |
| ------------------------- | ------------------------------------------------------------------ |
| `auth.services.js`        | `authenticateAdmin` (login flow), `refreshTokens` (token rotation) |
| `jwt.services.js`         | `generateAccessToken`, `generateRefreshToken`, `verifyJwtToken`    |
| `bcrypt.services.js`      | Password hashing and verification                                  |
| `session.services.js`     | Create, find, and delete session records                           |
| `admin.services.js`       | Create admin, find by email, get all, update password              |
| `package.services.js`     | CRUD for packages, find Cloudinary public IDs                      |
| `destination.services.js` | CRUD for destinations                                              |
| `enquiry.services.js`     | Create, get, update status, delete, count enquiries                |
| `feedback.services.js`    | Feedback and feedback link CRUD                                    |
| `insight.services.js`     | Analytics: store daily insights, update counters, global stats     |
| `cloudinary.services.js`  | `upload()` — batch-uploads buffers to Cloudinary                   |

---

## 11. Utilities

### `uploadToCloudinary` — `src/utils/uploadToCloudinary.js`

Wraps Cloudinary's `upload_stream` in a Promise. Accepts a file buffer and optional folder name. Returns
`{ url, public_id }`.

### `deleteFromCloudinary` — `src/utils/deleteFromCloudinary.js`

Calls Cloudinary's `api.delete_resources()` for batch deletion by public ID array. Sets `invalidate: true` to clear CDN
caches.

---

## 12. Third-Party Integrations

### Cloudinary (Image CDN)

- **Config:** `src/config/cloudinary.js`
- Multer is configured with **in-memory storage** (buffers) — files never touch the disk.
- **File filter:** Only `image/*` MIME types accepted.
- **Size limit:** 10 MB per file.
- Images are uploaded to Cloudinary and the returned `secure_url` + `public_id` are stored in MongoDB.
- On package/destination deletion or image replacement, old images are **bulk-deleted** from Cloudinary with CDN cache
  invalidation.

### Firebase Admin SDK (Push Notifications)

- **Config:** `src/config/firebase.config.js`
- Used to send FCM push notifications to admin devices.
- Service account credentials are loaded from the `FIREBASE_SERVICE_ACCOUNT_CONFIG` env variable.
- Notifications are targeted to the most recently registered FCM token of admin accounts.
- Android notification priority is set to `"high"` with `default_channel`.

### MongoDB / Mongoose

- **Config:** `src/config/db.js`
- Connected using `mongoose.connect()` on server startup.
- If connection fails, the process exits with code `1`.

---

## 13. Scheduled Jobs

The server uses `node-cron` to run the following scheduled task:

| Schedule                              | Timezone       | Task                                                   |
| ------------------------------------- | -------------- | ------------------------------------------------------ |
| `0 0 0 * * *` (every day at midnight) | `Asia/Kolkata` | Creates a new empty `Insight` document for the new day |

This ensures each day starts fresh with zero counts, and daily analytics can be queried by date range.

---

## 14. CORS Policy

The server allows cross-origin requests from the following origins:

| Origin                                          | Purpose                       |
| ----------------------------------------------- | ----------------------------- |
| `https://www.primetraveller.in`                 | Production customer site      |
| `https://admin.primetraveller.in`               | Production admin dashboard    |
| `https://tours-travels-react.onrender.com`      | Render.com staging (customer) |
| `https://tours-travels-admin-axch.onrender.com` | Render.com staging (admin)    |
| `http://localhost:5173`                         | Local dev (customer frontend) |
| `http://localhost:5174`                         | Local dev (admin frontend)    |
| `http://localhost` / `https://localhost`        | Local dev                     |

`credentials: true` is set globally to allow cookies to be sent cross-origin.

---

## 15. Setup & Running the Project

### Prerequisites

- Node.js (v18+ recommended for native `--watch` support)
- A MongoDB database (Atlas or local)
- Cloudinary account
- Firebase project with a service account key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd tours-travels-server

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and fill in all values
```

For `FIREBASE_SERVICE_ACCOUNT_CONFIG`, paste the contents of your `firebase-service-account-key.json` as a JSON string:

```bash
# On Linux/Mac:
FIREBASE_SERVICE_ACCOUNT_CONFIG=$(cat firebase-service-account-key.json)
```

Or manually wrap the JSON in single quotes in your `.env` file.

### Running the Server

```bash
# Development (with auto-restart on file changes)
npm run dev

# Production
npm start
```

The server starts on `PORT` from `.env` (default: `3000`).

### Health Check

```
GET /api/ping
-> 200 OK { "message": "alive" }
```

---

_Documentation created on 2026-10-13._
