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
PORT=5000
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

The server will start on `http://localhost:5000` by default.

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
- `POST /api/auth/register` – create user
- `POST /api/auth/login` – authenticate user
- `POST /api/auth/refresh` – exchange a valid refresh token for a new access token (middleware `verifyRefreshToken`)

Routes use the `authenticateUser` middleware which reads an access token from a cookie or
an `Authorization: Bearer <token>` header; a 401 is returned if no token or it is invalid/expired.

Protected endpoints can further restrict by role using the `authorizeRoles(...)` helper
(such as `authorizeRoles('admin')`).

### Users
- CRUD under `/api/users`

### Works / Projects / Testimonials / Categories
- Standard RESTful routes (`GET`, `POST`, `PUT`, `DELETE`) under `/api/works`, `/api/projects`, etc.

> See route files in `src/routes` for details.
>
> The auth middleware now supports header tokens and role-based checks; see `src/middlewares/auth.middleware.js`.

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


