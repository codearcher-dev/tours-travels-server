# API Routes Reference

> **Base URL (Production):** `https://www.primetraveller.in`  
> **Base URL (Local):** `http://localhost:<PORT>`  
> **Content-Type:** `application/json` (unless stated as `multipart/form-data`)  
> **Auth:** Requests marked 🔒 require a valid `access_token` or `refresh_token` HTTP-only cookie.

---

## Table of Contents

- [Admin Auth — `/api/admin`](#admin-auth--apiadmin)
- [Packages — `/api/package`](#packages--apipackage)
- [Destinations — `/api/destination`](#destinations--apidestination)
- [Enquiries — `/api/enquiry`](#enquiries--apienquiry)
- [Feedback — `/api/feedback`](#feedback--apifeedback)
- [Insights — `/api/insight`](#insights--apiinsight)
- [Utility](#utility)
- [Error Response Format](#error-response-format)

---

## Admin Auth — `/api/admin`

---

### `POST /api/admin/register` 🔒

Register a new admin. Maximum **2 admins** allowed at a time.

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response `201 Created`**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "fcmToken": [],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Response `401 Conflict`**
```json
{ "message": "Admin already exist" }
```

**Response `201`** _(when max admins already reached)_
```json
{ "message": "Maximum No. of Admins reached" }
```

---

### `POST /api/admin/login`

Authenticate an admin. Sets `access_token` (30 min) and `refresh_token` (7 days) as `HttpOnly` cookies.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "securepassword",
  "fcmToken": "firebase_device_token_string"
}
```
> `fcmToken` is optional. If provided and not already stored, it's added to the admin's FCM token list for push notifications.

**Response `200 OK`**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "fcmToken": ["firebase_device_token_string"],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```
> `password` is intentionally excluded from the response.

**Response `404 Not Found`**
```json
{ "message": "Invalid credentials" }
```

**Response `401 Unauthorized`**
```json
{ "message": "Invalid credentials" }
```

**Cookies set on success:**

| Cookie | Max Age | Flags |
|---|---|---|
| `access_token` | 30 minutes | `HttpOnly`, `Secure`, `SameSite=None` |
| `refresh_token` | 7 days | `HttpOnly`, `Secure`, `SameSite=None` |

---

### `POST /api/admin/logout`

Logs out the admin by deleting the server-side session and clearing both auth cookies.

**Request Body** — _None_

**Response `200 OK`**
```json
{ "message": "Logout successful" }
```

**Cookies cleared:** `access_token`, `refresh_token`

---

### `GET /api/admin/` 🔒

Get the profile of the currently authenticated admin.

**Request** — _No body. Auth via cookies._

**Response `200 OK`**
```json
{
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "fcmToken": ["firebase_device_token_string"],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### `PATCH /api/admin/password` 🔒

Change the authenticated admin's password.

**Request Body**
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword"
}
```

**Response `200 OK`**
```json
{ "message": "Password changed successfully" }
```

**Response `401 Unauthorized`**
```json
{ "message": "Invalid old password" }
```

**Response `404 Not Found`**
```json
{ "message": "Admin not found" }
```

---

## Packages — `/api/package`

---

### `GET /api/package/`

Fetch all packages, sorted by newest first.

**Request** — _No body or params._

**Response `200 OK`**
```json
{
  "message": "Packages fetched successfully",
  "count": 2,
  "packages": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Goa Beach Getaway",
      "slug": "goa-beach-getaway",
      "description": "Enjoy the sun, sand, and sea.",
      "location": { "name": "Goa", "url": "https://maps.google.com/..." },
      "duration": { "days": 5, "nights": 4 },
      "price": { "currency": "INR", "actual": 25000, "discounted": 18999 },
      "img": { "url": "https://res.cloudinary.com/...", "publicId": "folder/image_id" },
      "images": [
        { "url": "https://res.cloudinary.com/...", "publicId": "folder/image_id_2" }
      ],
      "destinations": ["Calangute", "Baga", "Anjuna"],
      "inclusions": ["Hotel stay", "Breakfast", "Airport transfer"],
      "exclusions": ["Flight tickets", "Personal expenses"],
      "itinerary": [
        {
          "dayNumber": 1,
          "title": "Arrival & Beach Visit",
          "description": "Check in and head to Calangute beach.",
          "activities": [
            { "name": "Calangute Beach Visit", "notes": "Sunset view", "isExtraCharge": false, "extraChargeAmount": 0 }
          ],
          "mealsIncluded": { "breakfast": false, "lunch": false, "dinner": true }
        }
      ],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/package/:id`

Fetch a single package by its MongoDB `_id`.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the package |

**Response `200 OK`**
```json
{
  "message": "Package fetched successfully",
  "package": { /* same shape as single item in GET all */ }
}
```

---

### `POST /api/package/` 🔒

Create a new package. Uses `multipart/form-data`.

**Content-Type:** `multipart/form-data`

**Form Fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | String (JSON) | Yes | Stringified JSON of package fields (see below) |
| `thumbnail` | File | No | Thumbnail/cover image (max 1, max 10MB) |
| `images` | File[] | No | Gallery images (max 10, max 10MB each) |

**`data` JSON Structure**
```json
{
  "name": "Manali Snow Trip",
  "description": "Experience the snow-clad peaks of Manali.",
  "location": { "name": "Manali, Himachal Pradesh", "url": "https://maps.google.com/..." },
  "duration": { "days": 6, "nights": 5 },
  "price": { "currency": "INR", "actual": 32000, "discounted": 24999 },
  "destinations": ["Solang Valley", "Rohtang Pass", "Old Manali"],
  "inclusions": ["Hotel stay", "All meals", "Cab transfers"],
  "exclusions": ["Flight tickets", "Adventure activities"],
  "itinerary": [
    {
      "dayNumber": 1,
      "title": "Arrival in Manali",
      "description": "Check in and local sightseeing.",
      "activities": [
        { "name": "Mall Road Walk", "notes": "", "isExtraCharge": false, "extraChargeAmount": 0 }
      ],
      "mealsIncluded": { "breakfast": false, "lunch": false, "dinner": true }
    }
  ],
  "isActive": true
}
```
> `slug` is auto-generated from `name`. The `name`, `location`, `duration`, `destinations`, `price`, and `description` fields are required.

**Response `201 Created`**
```json
{
  "message": "Package created successfully",
  "package": { /* full package object */ }
}
```

**Response `400 Bad Request`**
```json
{ "message": "Please fill the required fields" }
```

---

### `PATCH /api/package/:id` 🔒

Update an existing package. Uses `multipart/form-data`.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the package to update |

**Content-Type:** `multipart/form-data`

**Form Fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | String (JSON) | Yes | Stringified JSON of all updated package fields |
| `thumbnail` | File | No | New thumbnail image (replaces existing if provided) |
| `images` | File[] | No | New images to add to the gallery |
| `public_id` | String | No | Comma-separated Cloudinary `publicId`s of images to delete |

**`data` JSON Structure** — same as POST, plus:
```json
{
  "slug": "manali-snow-trip",
  "img": { "url": "...", "publicId": "..." },
  "images": [
    { "url": "...", "publicId": "..." }
  ]
}
```
> Existing images not in the `public_id` delete list are kept and merged with newly uploaded files.

**Response `200 OK`**
```json
{
  "message": "Package updated successfully",
  "package": { /* updated package object */ }
}
```

---

### `DELETE /api/package/:id` 🔒

Delete a package and permanently remove all its associated Cloudinary images.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the package |

**Response `200 OK`**
```json
{
  "message": "Package deleted successfully",
  "package": { /* deleted package object */ }
}
```

---

## Destinations — `/api/destination`

---

### `GET /api/destination/`

Fetch all destinations.

**Request** — _No body or params._

**Response `200 OK`**
```json
{
  "message": "Destinations fetched successfully",
  "count": 3,
  "destinations": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Rajasthan",
      "places": ["Jaipur", "Udaipur", "Jodhpur"],
      "images": [
        { "url": "https://res.cloudinary.com/...", "publicId": "folder/img_id" }
      ],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/destination/:id`

Fetch a single destination by ID.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the destination |

**Response `200 OK`**
```json
{
  "message": "Destination fetched successfully",
  "destination": { /* single destination object */ }
}
```

---

### `POST /api/destination/` 🔒

Create a new destination with optional images.

**Content-Type:** `multipart/form-data`

**Form Fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | String (JSON) | Yes | Stringified JSON with `name` and `places` |
| `images` | File[] | No | Gallery images (max 10, max 10MB each) |

**`data` JSON Structure**
```json
{
  "name": "Rajasthan",
  "places": ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"]
}
```

**Response `200 OK`**
```json
{
  "message": "Destination created successfully",
  "destination": { /* full destination object */ }
}
```

**Response `400 Bad Request`**
```json
{ "message": "Please fill the required fields" }
```

---

### `PATCH /api/destination/:id` 🔒

Update an existing destination.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the destination |

**Content-Type:** `multipart/form-data`

**Form Fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | String (JSON) | Yes | Stringified JSON with `name`, `places`, and existing `images` array |
| `images` | File[] | No | New images to add |
| `public_id` | String | No | Comma-separated Cloudinary `publicId`s of images to delete |

**`data` JSON Structure**
```json
{
  "name": "Rajasthan",
  "places": ["Jaipur", "Udaipur", "Jodhpur"],
  "images": [
    { "url": "https://res.cloudinary.com/...", "publicId": "existing_img_id" }
  ]
}
```

**Response `200 OK`**
```json
{
  "message": "Destination updated successfully",
  "destination": { /* updated destination object */ }
}
```

---

### `DELETE /api/destination/:id` 🔒

Delete a destination and all its Cloudinary images.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the destination |

**Response `200 OK`**
```json
{
  "message": "Destination removed successfully",
  "destination": { /* deleted destination object */ }
}
```

---

## Enquiries — `/api/enquiry`

---

### `GET /api/enquiry/` 🔒

Fetch all enquiries with optional filtering, search, and pagination.

**Query Params**

| Param | Type | Required | Description |
|---|---|---|---|
| `status` | String | No | Filter by `"pending"` or `"completed"` |
| `search` | String | No | Case-insensitive search on `name` or `package` fields |
| `limit` | Number | No | Max records to return |
| `offset` | Number | No | Number of records to skip (for pagination) |

**Response `200 OK`**
```json
{
  "message": "Enquiry feched",
  "count": 2,
  "enquiries": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+919876543210",
      "package": "Goa Beach Getaway",
      "adults": 2,
      "kids": 1,
      "message": "Interested in booking for December.",
      "status": "pending",
      "createdAt": "2025-06-01T10:30:00.000Z",
      "updatedAt": "2025-06-01T10:30:00.000Z"
    }
  ]
}
```

---

### `POST /api/enquiry/`

Submit a new customer enquiry (public route — no auth required).

Also increments `enquiryClicks.form` in today's Insight and the `enquiries` GlobalStat.

**Request Body**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+919876543210",
  "package": "Goa Beach Getaway",
  "adults": 2,
  "kids": 1,
  "message": "Interested in booking for December."
}
```
> `email` and `kids` are optional. All other fields are required.

**Response `201 Created`**
```json
{
  "message": "Enquiry created",
  "enquiry": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+919876543210",
    "package": "Goa Beach Getaway",
    "adults": 2,
    "kids": 1,
    "message": "Interested in booking for December.",
    "status": "pending",
    "createdAt": "2025-06-01T10:30:00.000Z",
    "updatedAt": "2025-06-01T10:30:00.000Z"
  }
}
```

---

### `PATCH /api/enquiry/:id` 🔒

Mark an enquiry as `"completed"`. Status is always set to `"completed"` — no body required.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the enquiry |

**Request Body** — _None_

**Response `200 OK`**
```json
{
  "message": "Status updated",
  "enquiry": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "status": "completed",
    "...": "other fields"
  }
}
```

---

### `DELETE /api/enquiry/:id` 🔒

Delete an enquiry by ID.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the enquiry |

**Response `200 OK`**
```json
{
  "message": "Enquiry deleted",
  "enquiry": { /* deleted enquiry object */ }
}
```

---

### `GET /api/enquiry/:status` 🔒

Count enquiries by status.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `status` | String | `"pending"` or `"completed"` |

**Response `200 OK`**
```json
{
  "message": "Counted successfully",
  "count": 14
}
```

---

## Feedback — `/api/feedback`

---

### `GET /api/feedback/`

Fetch all submitted feedback entries, sorted by newest first.

**Query Params**

| Param | Type | Required | Description |
|---|---|---|---|
| `limit` | Number | No | Max records to return |
| `offset` | Number | No | Records to skip |

**Response `200 OK`**
```json
{
  "message": "Feedback fetched successfully",
  "count": 1,
  "feedbacks": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
      "name": "Ravi Kumar",
      "package": "Goa Beach Getaway",
      "feedback": [
        { "question": "How was the accommodation?", "rating": 5 },
        { "question": "How was the food?", "rating": 4 }
      ],
      "overallRating": 4.5,
      "review": "Amazing trip! Highly recommended.",
      "createdAt": "2025-06-10T08:00:00.000Z",
      "updatedAt": "2025-06-10T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/feedback/:token`

Submit customer feedback using a secure token link. After submission, the token-link is **permanently invalidated** (deleted).

**URL Params**

| Param | Type | Description |
|---|---|---|
| `token` | String | Unique token from the feedback link |

**Request Body**
```json
{
  "name": "Ravi Kumar",
  "package": "Goa Beach Getaway",
  "feedback": [
    { "question": "How was the accommodation?", "rating": 5 },
    { "question": "How was the food?", "rating": 4 }
  ],
  "review": "Amazing trip! Highly recommended."
}
```
> `overallRating` is auto-calculated on the server as the average of all `rating` values.

**Response `200 OK`**
```json
{
  "message": "Feedback created successfully",
  "feedback": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "name": "Ravi Kumar",
    "package": "Goa Beach Getaway",
    "feedback": [ /* array */ ],
    "overallRating": 4.5,
    "review": "Amazing trip! Highly recommended.",
    "createdAt": "2025-06-10T08:00:00.000Z",
    "updatedAt": "2025-06-10T08:00:00.000Z"
  }
}
```

**Response `404 Not Found`** _(invalid or already-used token)_
```json
{ "message": "Invalid feedback link" }
```

---

### `DELETE /api/feedback/:id` 🔒

Delete a feedback entry by its ID.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the feedback |

**Response `200 OK`**
```json
{
  "message": "Feedback deleted successfully",
  "feedback": { /* deleted feedback object */ }
}
```

---

### `GET /api/feedback/link`

Fetch all feedback links, sorted by newest first.

**Response `200 OK`**
```json
{
  "message": "Feedback links fetched successfully",
  "count": 2,
  "links": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
      "package": "Manali Snow Trip",
      "questions": ["How was the accommodation?", "How was the food?"],
      "token": "k7x2m9q4p1r8",
      "url": "https://www.primetraveller.in/feedback/k7x2m9q4p1r8",
      "isValid": true,
      "createdAt": "2025-06-05T09:00:00.000Z",
      "updatedAt": "2025-06-05T09:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/feedback/link/:token`

Fetch a specific feedback link by its token. Used by the frontend to validate and render the feedback form.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `token` | String | The unique link token |

**Response `200 OK`**
```json
{
  "message": "Feedback link fetched successfully",
  "link": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "package": "Manali Snow Trip",
    "questions": ["How was the accommodation?", "How was the food?"],
    "token": "k7x2m9q4p1r8",
    "url": "https://www.primetraveller.in/feedback/k7x2m9q4p1r8",
    "isValid": true,
    "createdAt": "2025-06-05T09:00:00.000Z"
  }
}
```

---

### `POST /api/feedback/link/create` 🔒

Generate a new shareable feedback link for a specific package.

**Request Body**
```json
{
  "package": "Manali Snow Trip",
  "questions": [
    "How was the accommodation?",
    "How was the food?",
    "How was the transport?"
  ]
}
```

**Response `200 OK`**
```json
{
  "message": "Feedback link created successfully",
  "link": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "package": "Manali Snow Trip",
    "questions": ["How was the accommodation?", "How was the food?", "How was the transport?"],
    "token": "k7x2m9q4p1r8n3s6",
    "url": "https://www.primetraveller.in/feedback/k7x2m9q4p1r8n3s6",
    "isValid": true,
    "createdAt": "2025-06-05T09:00:00.000Z"
  }
}
```

---

### `DELETE /api/feedback/link/:id` 🔒

Delete a feedback link by its MongoDB ID.

**URL Params**

| Param | Type | Description |
|---|---|---|
| `id` | String | MongoDB `_id` of the feedback link |

**Response `200 OK`**
```json
{
  "message": "Feedback link deleted successfully",
  "link": { /* deleted link object */ }
}
```

---

## Insights — `/api/insight`

---

### `POST /api/insight/`

Track a unique visitor on initial page load. If `v_id` is present in the body, the visitor is already tracked and counting is skipped.

**Request Body**
```json
{
  "v_id": "optional_existing_visitor_id"
}
```
> Send an **empty body** `{}` or omit `v_id` for a new visitor.

**Response `200 OK` — New visitor**
```json
{
  "message": "visitors updated",
  "v_id": "3a1b2c4d5e6f7a8b9c0d1e2f"
}
```
> Store the returned `v_id` in `localStorage` or a cookie to prevent double-counting on subsequent visits.

**Response `200 OK` — Returning visitor (v_id provided)**
```json
{ "message": "v_id exists" }
```

---

### `PATCH /api/insight/click`

Increment the WhatsApp enquiry click counter in today's Insight and the global `enquiries` stat.

**Request Body** — _None_

**Response `200 OK`**
```json
{ "message": "click updated" }
```

---

### `PATCH /api/insight/visit`

Increment the page view counter in today's Insight and the global `pageViews` stat.

**Request Body** — _None_

**Response `200 OK`**
```json
{ "message": "views updated" }
```

---

### `GET /api/insight/` 🔒

Fetch daily insight records within a date range. Defaults to the last 7 days if no params are given.

**Query Params**

| Param | Type | Required | Description |
|---|---|---|---|
| `start` | String | No | Start date in `YYYY-MM-DD` format. Defaults to 7 days ago. |
| `end` | String | No | End date in `YYYY-MM-DD` format. Defaults to today. |

**Response `200 OK`**
```json
{
  "message": "Insights fetched",
  "insights": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
      "visitors": 142,
      "enquiryClicks": {
        "form": 18,
        "whatsapp": 24
      },
      "pageViews": 390,
      "createdAt": "2025-06-10T00:00:00.000Z",
      "updatedAt": "2025-06-10T23:59:59.000Z"
    }
  ]
}
```

---

### `POST /api/insight/new`

Manually create a new daily Insight document (normally done automatically by the midnight cron job).

**Request Body** — _None_

**Response `201 Created`**
```json
{
  "message": "Insight created",
  "insight": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "visitors": 0,
    "enquiryClicks": { "form": 0, "whatsapp": 0 },
    "pageViews": 0,
    "createdAt": "2025-06-11T00:00:00.000Z",
    "updatedAt": "2025-06-11T00:00:00.000Z"
  }
}
```

---

### `GET /api/insight/global` 🔒

Fetch the global / all-time aggregate statistics document.

**Request** — _No body or params._

**Response `200 OK`**
```json
{
  "message": "stat fetched",
  "stat": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
    "packages": 12,
    "destinations": 8,
    "visitors": 5420,
    "enquiries": 314,
    "pageViews": 18750,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-06-11T12:34:56.000Z"
  }
}
```

---

## Utility

---

### `GET /api/ping`

Health check endpoint. Used to verify the server is running.

**Request** — _None_

**Response `200 OK`**
```json
{ "message": "alive" }
```

---

### `POST /api/push-notification`

Send a test FCM push notification to the most recently registered device of the first admin.

**Request Body**
```json
{
  "title": "New Enquiry Received!",
  "body": "A customer just submitted an enquiry for Goa Package."
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "messageId": "projects/your-project/messages/xxxxxxxx"
}
```

**Response `500 Internal Server Error`**
```json
{
  "success": false,
  "error": "error description"
}
```

---

## Error Response Format

All routes return errors in this consistent format:

```json
{
  "message": "Human-readable error description",
  "error": "Optional technical error detail (string or object)"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — missing or invalid input |
| `401` | Unauthorized — wrong credentials or invalid password |
| `404` | Not Found — resource doesn't exist |
| `500` | Internal Server Error — unexpected failure |
