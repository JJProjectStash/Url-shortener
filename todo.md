# URL Shortener Project - MVP Todo List

## Project Structure

- Backend (Node.js + Express) - Separate folder
- Frontend (React + Shadcn-UI) - Separate folder
- MongoDB setup script

## Backend Files (backend/)

1. **package.json** - Dependencies (express, mongoose, cors, dotenv, rate-limiter-flexible)
2. **server.js** - Main Express server setup
3. **models/Url.js** - MongoDB schema for URL storage
4. **routes/urlRoutes.js** - API endpoints for URL operations
5. **utils/hashMap.js** - Hash Map implementation for O(1) lookups
6. **utils/rateLimiter.js** - Queue-based rate limiting
7. **.env.example** - Environment variables template
8. **README.md** - Backend setup instructions

## Frontend Files (frontend/)

1. **src/App.tsx** - Main application component
2. **src/components/UrlShortener.tsx** - URL shortening form
3. **src/components/UrlList.tsx** - Display shortened URLs
4. **src/components/Analytics.tsx** - Click analytics display
5. **src/services/api.ts** - API service for backend calls

## MongoDB Setup

1. **setup-mongodb.js** - Script to initialize MongoDB with collections and indexes

## Data Structures Used

- Hash Map: O(1) lookup for short code → long URL mapping
- Queue: Rate limiting implementation to prevent abuse

## Implementation Order

1. Create backend structure with Express server
2. Implement MongoDB models with proper indexing
3. Create Hash Map utility for URL lookups
4. Implement Queue-based rate limiter
5. Build API endpoints (shorten, redirect, analytics)
6. Create frontend with React + Shadcn-UI
7. Create MongoDB setup script
