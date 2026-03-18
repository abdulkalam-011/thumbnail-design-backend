# Thumbnail Design API (Backend)

This repository contains the backend for the **Thumbnail Design** portfolio project. It's a Node.js/Express API that powers a portfolio site for showcasing design work, managing users, projects, testimonials, and category data.

## 🧱 Technology Stack

- **Node.js** & **Express** for server
- **MongoDB** (via Mongoose) for data storage
- **Cloudinary** for image storage
- **Multer** for handling file uploads

## 🚀 Features

- Authentication (register/login)
- CRUD operations for projects, works, testimonials, categories, and users
- File upload support for images
- Structured error handling and async utilities

## 🛠️ Getting Started

### Prerequisites

- Node.js (>=14)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for image hosting)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the root or set these variables in your environment:

```env
PORT=4000
MONGODB_URI=<your_mongo_connection_string>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

# JWT tokens
ACCESS_TOKEN_SECRET=<secret for access tokens>
ACCESS_TOKEN_EXPIRATION=15m           # e.g. 15m, 1h
REFRESH_TOKEN_SECRET=<secret for refresh tokens>
REFRESH_TOKEN_EXPIRATION=7d          # typically longer than access
```

### Running the Server

```bash
npm start
# or for development with nodemon
npm run dev
```

The server will start on `http://localhost:4000` by default.

## 📁 Project Structure

```
src/
├─ config/          # DB and cloudinary setup
├─ controllers/     # Request handlers
├─ middlewares/     # Custom middleware (auth, error handling, multer)
├─ models/          # Mongoose schemas
├─ routes/          # API routes
├─ utils/           # Helpers (ApiError, responses, asyncHandler)
├─ app.js           # Express app
└─ index.js         # Server entry point
```

## 📦 API Endpoints

### Auth
The authentication system supports browser‑friendly cookies as well as bearer tokens.  Access and
refresh tokens are stored in `httpOnly` cookies by default, but you can also send them via an
`Authorization: Bearer <token>` header (access) or in the request body (refresh).  The `authenticateUser`
middleware extracts the access token from whichever source is available and rejects the request
with `401` if it is missing, invalid or expired.

Protected routes can additionally restrict by role using the `authorizeRoles(...)` helper
(e.g. `authorizeRoles('admin')`).

Available endpoints:

- `POST /api/v1/auth/register` – register a new user.  You may upload a `profilePicture` file
  (handled by Multer) which is stored in Cloudinary.
- `POST /api/v1/auth/login` – authenticate with `{ email, password }`.  Returns user data as
  well as access/refresh tokens and sets the same tokens as cookies.
- `POST /api/v1/auth/logout` – logs the current user out, clears auth cookies.  Requires
  authentication.
- `POST /api/v1/auth/refresh-token` – exchange a valid refresh token (cookie or body) for a
  new access/refresh pair.  No authentication required; the token itself is validated.
- `POST /api/v1/auth/reset-password` – update your password.  Requires authentication and
  accepts `{ oldPassword, newPassword, confirmPassword }`.
- `DELETE /api/v1/auth/delete-me` – delete the authenticated user and clear auth cookies.
- `GET /api/v1/auth/get-me` – fetch the currently logged‑in user’s profile.

> Note: some earlier versions documented `/api/auth/refresh`; the current path is
> `/api/v1/auth/refresh-token`.


### Users
- `GET /api/v1/users/` (requires authenticated user with `user` role)
- `GET /api/v1/users/:id`
- `PUT /api/v1/users/:id`
- `POST /api/v1/users/:id/avatar`
- `PATCH /api/v1/users/update-profile-picture` (authenticated)
- `PATCH /api/v1/users/update-user` (authenticated)

### Works
- `GET /api/v1/works/`
- `POST /api/v1/works/`

> See route files in `src/routes` for details.
>
> The auth middleware supports header tokens and role-based checks; see `src/middlewares/auth.middleware.js`.

## ✅ Example Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## 🧩 Utilities

- `fileUpload` helper for Multer configuration
- `ApiError` and `apiResponse` for standardized error/response formats
- `asyncHandler` to wrap async controllers

## 🌐 Deployment

The app can be deployed to platforms like Heroku, Vercel (with serverless functions), or any Node-friendly host. Make sure environment variables are configured.

## 📝 Contributing

Feel free to open issues or pull requests if you spot bugs or want to enhance the project.

## 📄 License

MIT License


