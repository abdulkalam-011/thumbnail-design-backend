# Thumbnail Design API (Backend)

This repository contains the backend for the **Thumbnail Design** portfolio project. It is a Node.js/Express API that supports authentication, user/profile management, file uploads, and CRUD operations for works, projects, testimonials, and categories.

## 🧱 Technology Stack

- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **Cloudinary** for image storage
- **Multer** for file uploads

## 🚀 Features

- JWT-based authentication with access + refresh tokens
- Register, login, logout, refresh token
- Get current user profile, reset password, delete account
- CRUD for users, works, projects, testimonials, categories
- Upload images to Cloudinary
- Role-based authorization support
- Centralized error handling and async controller utilities

## 🛠️ Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in `backend` and add:

```env
PORT=4000
MONGODB_URI=<your_mongo_connection_string>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

ACCESS_TOKEN_SECRET=<secret for access tokens>
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_SECRET=<secret for refresh tokens>
REFRESH_TOKEN_EXPIRATION=7d
```

### Running the Server

```bash
npm start
# or for development
npm run dev
```

The server will start on `http://localhost:4000` by default.

## 📁 Project Structure

```
src/
├─ config/          # DB and Cloudinary configuration
├─ controllers/     # Request handlers
├─ middlewares/     # Auth, error handling, multer, etc.
├─ models/          # Mongoose schemas
├─ routes/          # API route definitions
├─ utils/           # Helpers (ApiError, apiResponse, asyncHandler)
├─ app.js           # Express app setup
└─ index.js         # Server entry point
```

## 📦 API Endpoints

### Auth

Authentication supports access tokens via `Authorization: Bearer <token>` and refresh tokens via cookies or request body. Protected routes use `authenticateUser`; role restrictions use `authorizeRoles(...)`.

- `POST /api/v1/auth/register`
  - Register a new user
  - Optional file upload: `profilePicture`
- `POST /api/v1/auth/login`
  - Authenticate with `{ email, password }`
  - Returns user data, access token, refresh token
- `POST /api/v1/auth/logout`
  - Logs out current user and clears auth cookies
  - Requires authentication
- `POST /api/v1/auth/refresh-token`
  - Exchange refresh token for new access/refresh tokens
  - No authentication required
- `POST /api/v1/auth/reset-password`
  - Update password with `{ oldPassword, newPassword, confirmPassword }`
  - Requires authentication
- `DELETE /api/v1/auth/delete-me`
  - Delete authenticated user
- `GET /api/v1/auth/get-me`
  - Get current authenticated user profile

### Users

- `GET /api/v1/users/`
- `GET /api/v1/users/:id`
- `PUT /api/v1/users/:id`
- `POST /api/v1/users/:id/avatar`
- `PATCH /api/v1/users/update-profile-picture`
- `PATCH /api/v1/users/update-user`

### Works

- `GET /api/v1/works/`
- `GET /api/v1/works/:workId`
- `POST /api/v1/works/`

### Testimonials

- `GET /api/v1/testimonials/`
- `POST /api/v1/testimonials/`
- `PUT /api/v1/testimonials/:id`
- `DELETE /api/v1/testimonials/:id`


> See route files in `src/routes` for full details on request parameters and middleware requirements.

## ✅ Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## 🧩 Utilities

- `fileUpload` helper for configuring Multer uploads
- `ApiError` and `apiResponse` for consistent responses
- `asyncHandler` to wrap asynchronous controllers

## 🌐 Deployment

Deploy to any Node-friendly host. Configure environment variables in the target environment and ensure MongoDB + Cloudinary are reachable.

## 📝 Contributing

Contributions and bug reports are welcome. Open issues or pull requests to improve the project.

## 📄 License

MIT License