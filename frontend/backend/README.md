# TrustChain-EMS Legal Knowledge Chatbot Backend

Backend API server for the Legal Knowledge Chatbot feature of TrustChain-EMS.

## Overview

This backend provides a REST API endpoint that integrates with Google's Gemini AI to provide general legal knowledge and educational information about:

- Digital evidence
- Chain of custody
- Evidence admissibility
- Procedural legal concepts

**⚠️ Important:** The chatbot is designed to provide educational information only and does not provide legal advice, verdicts, or judgments.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## API Endpoints

### POST /api/legal-chat

Send a legal question to the chatbot.

**Request Body:**

```json
{
  "role": "Police" | "General",
  "question": "What is chain of custody?"
}
```

**Response:**

```json
{
  "answer": "Chain of custody refers to the chronological documentation..."
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:3001/api/legal-chat \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Police",
    "question": "What is chain of custody?"
  }'
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "service": "TrustChain-EMS Legal Chatbot API"
}
```

## System Prompt & Safety Features

The backend uses a carefully crafted system prompt that:

- Explains legal concepts clearly and neutrally
- Refuses to provide legal advice or verdicts
- Includes automatic disclaimer in all responses
- Detects and handles unsafe requests (requests for advice, verdicts, etc.)

## Error Handling

The API includes comprehensive error handling for:

- Missing or invalid API keys
- Invalid request formats
- Gemini API errors
- Network issues

## Security Notes

- Never commit your `.env` file to version control
- Keep your Gemini API key secure
- The API uses CORS to allow requests from the frontend
- All responses include legal disclaimers

## Development

The server uses:

- **Express.js** for the web framework
- **@google/generative-ai** for Gemini AI integration
- **cors** for cross-origin resource sharing
- **dotenv** for environment variable management

## Troubleshooting

**Issue: "GEMINI_API_KEY not found"**

- Ensure your `.env` file exists and contains `GEMINI_API_KEY=your_key`
- Check that the `.env` file is in the `backend` directory

**Issue: CORS errors**

- Ensure the frontend is configured to make requests to the correct backend URL
- Check that CORS is properly configured in `server.js`

**Issue: API returns errors**

- Verify your Gemini API key is valid
- Check your internet connection
- Review server logs for detailed error messages
