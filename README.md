# VideoTube Backend API

Express + MongoDB backend for a YouTube-like app with modules for users, videos, playlists, subscriptions, tweets, likes, and comments.

## Features

- JWT-based authentication with HTTP-only cookies
- User profile management with avatar and cover image uploads
- Video publishing and publish-state toggling
- Playlist CRUD and playlist-video management
- Channel subscription and subscriber listing
- Tweet CRUD
- Like toggles for videos, comments, and tweets
- Comment CRUD with paginated video comments

## Tech Stack

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT and bcrypt
- Multer (disk upload)
- Cloudinary (media hosting)
- Cookie Parser and CORS

## Project Structure

```text
Backend/
  public/
    uploads/
  src/
    app.js
    index.js
    constant.js
    controllers/
      comment.controller.js
      like.controller.js
      playlist.controller.js
      subscription.controller.js
      tweet.controller.js
      user.controller.js
      video.controller.js
    db/
      index.js
    middlewares/
      auth.middleware.js
      multer.middleware.js
    models/
      comment.models.js
      like.models.js
      playlist.models.js
      subscription.models.js
      tweet.models.js
      user.models.js
      video.models.js
    routes/
      comment.route.js
      like.route.js
      playlist.route.js
      subscription.route.js
      tweet.route.js
      user.routes.js
      video.route.js
    utils/
      ApiError.js
      ApiResponse.js
      asyncHandler.js
      cloudinary.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection (Atlas or local)
- Cloudinary account

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in project root and configure:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:

- Database name is appended internally as `videotube`.
- Uploaded files are temporarily stored in `public/uploads` before Cloudinary upload.

## Run Locally

```bash
npm run dev
```

Default server URL:

```text
http://localhost:5000
```

## Scripts

- `npm run dev`: start development server using nodemon and dotenv

## API Base URL

All routes are mounted under:

```text
/api/v1
```

## Authentication

- Protected routes use JWT middleware.
- Access token is read from:
  - Cookie: `accessToken`
  - Header: `Authorization: Bearer <token>`
- Login sets `accessToken` and `refreshToken` cookies.

## Route Map

### User routes (`/api/v1/user`)

Public:

- `POST /register`
- `POST /login`

Protected:

- `POST /logout`
- `PUT /change-password`
- `GET /current-user`
- `PATCH /update-profile`
- `PATCH /avatar`
- `PUT /cover-image`
- `GET /c/:username`
- `POST /c/history/:videoId`
- `GET /c/history`

### Video routes (`/api/v1/video`) [all protected]

- `GET /`
- `POST /` (multipart fields: `videoFile`, `thumbnail`)
- `GET /:videoId`
- `PATCH /:videoId`
- `DELETE /:videoId`
- `PATCH /toggle/publish/:videoId`

### Playlist routes (`/api/v1/playlist`) [all protected]

- `POST /`
- `GET /:playlistId`
- `PATCH /:playlistId`
- `DELETE /:playlistId`
- `PATCH /add/:videoId/:playlistId`
- `PATCH /remove/:videoId/:playlistId`
- `GET /user/:userId`

### Subscription routes (`/api/v1/subscription`) [all protected]

- `GET /c/:channelId`
- `POST /c/:channelId`
- `GET /u/:subscriberId`

### Tweet routes (`/api/v1/tweet`) [all protected]

- `POST /`
- `GET /user/:userId`
- `PATCH /:tweetId`
- `DELETE /:tweetId`

### Like routes (`/api/v1/like`) [all protected]

- `POST /toggle/v/:videoId`
- `POST /toggle/c/:commentId`
- `POST /toggle/t/:tweetId`
- `GET /videos`

### Comment routes (`/api/v1/comment`) [all protected]

- `GET /:videoId`
- `POST /:videoId`
- `PATCH /c/:commentId`
- `DELETE /c/:commentId`

## Response Format

API responses use shared wrappers:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Operation successful",
  "success": true
}
```

Errors are thrown with `ApiError` and handled by async wrapper logic.

## Security Notes

- Never commit `.env` or credentials.
- Use HTTPS in production.
- Set cookie `secure` options according to environment and deployment setup.
