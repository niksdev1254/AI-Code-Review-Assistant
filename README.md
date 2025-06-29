# Code Review Application

A full-stack web application for AI-powered code review with the following stack:

## Tech Stack

- **Frontend**: React.js + Tailwind CSS + Monaco Editor
- **Backend**: Node.js + Express
- **Database & Auth**: Supabase
- **AI**: Google Gemini API

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json for workspace management
└── README.md
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Environment Setup

**IMPORTANT**: You must set up your environment variables before the server will start.

#### Get Supabase Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Settings > API**
4. Copy the following values:
   - **Project URL** (for `SUPABASE_URL`)
   - **Service Role Key** (for `SUPABASE_SERVICE_ROLE_KEY`)
   - **Anon Key** (for `SUPABASE_ANON_KEY`)

#### Get Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key or use an existing one
3. Copy the API key value

#### Configure Environment Files
1. **Server Environment**:
   - Copy `server/.env.example` to `server/.env`
   - Replace placeholder values with your actual credentials:
     ```env
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_ANON_KEY=your_actual_anon_key_here
     SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
     GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key_here
     PORT=3002
     ```

2. **Client Environment**:
   - Copy `client/.env.example` to `client/.env`
   - Add your credentials:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
     VITE_GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key_here
     ```

### 3. Development
```bash
npm run dev
```
This will start both client (port 5173) and server (port 3002) concurrently.

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Testing
- `GET /api/test` - Basic API test
- `GET /api/supabase-test` - Test Supabase connection
- `POST /api/gemini-test` - Test Google Gemini AI
  ```json
  {
    "prompt": "Hello, how are you?"
  }
  ```

### Code Review
- `POST /api/code-review` - AI-powered code review
  ```json
  {
    "code": "function example() { return 'hello'; }",
    "language": "javascript"
  }
  ```

## Environment Variables

### Client (.env)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key

### Server (.env)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Server port (default: 3002)

## Features

- **AI Code Review**: Get intelligent code analysis and suggestions using Google Gemini
- **Multi-language Support**: Review code in various programming languages
- **Real-time Feedback**: Instant code review results
- **Secure**: API keys handled server-side for security

## Troubleshooting

### "supabaseUrl is required" Error
This error occurs when the Supabase environment variables are missing or still set to placeholder values. Make sure you've:
1. Created the `server/.env` file from the example
2. Replaced all placeholder values with actual credentials from your Supabase dashboard
3. Restarted the development server after making changes

### Getting API Keys
1. **Supabase**: Visit [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Google Gemini**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)

### Testing the Setup
1. Start the server: `npm run dev`
2. Check health: `GET http://localhost:3002/health`
3. Test Gemini: `POST http://localhost:3002/api/gemini-test`
4. Test code review: `POST http://localhost:3002/api/code-review`