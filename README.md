# Pastebin Lite

A minimal Pastebin-like service built using Next.js and Redis.

## Features
- Create pastes with optional TTL and view limits
- Retrieve pastes via API
- View pastes as HTML
- Redis-backed persistence
- Health check endpoint

## Tech Stack
- Next.js (Pages Router)
- Redis
- Node.js

## Setup
1. Install dependencies  
   npm install

2. Add environment variables  
   REDIS_URL=redis://localhost:6379

3. Run the app  
   npm run dev