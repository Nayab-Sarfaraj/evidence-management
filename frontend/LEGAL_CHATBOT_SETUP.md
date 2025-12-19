# Legal Knowledge Chatbot - Setup Guide

Complete setup instructions for the TrustChain-EMS Legal Knowledge Chatbot.

## 🎯 Overview

The Legal Knowledge Chatbot is a GenAI-powered assistant that provides general legal information about digital evidence, chain of custody, and evidence admissibility. It is designed for police officers and general users as an educational tool.

**⚠️ Important:** The chatbot provides educational information only and does not provide legal advice, verdicts, or judgments.

## 📋 Prerequisites

- Node.js v18+ installed
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Quick Start

### Step 1: Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

5. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Step 2: Frontend Setup

1. Navigate to the frontend root directory (if not already there):

```bash
cd ..
```

2. Install dependencies (if not already installed):

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port Vite assigns)

### Step 3: Test the Chatbot

1. Open your browser and navigate to `http://localhost:5173`
2. Look for the floating chat button in the bottom-right corner
3. Click the button to open the chat window
4. Try asking: "What is chain of custody?"

## 🏗️ Architecture

### Frontend Components

- **LegalChatbot.tsx**: Main chatbot component with:
  - Floating button (bottom-right)
  - Chat window with smooth animations
  - Message display (user messages right-aligned, AI messages left-aligned)
  - Quick question suggestions
  - Legal disclaimer banner
  - Input field with send button

### Backend API

- **server.js**: Express server with:
  - POST `/api/legal-chat`: Main chat endpoint
  - GET `/health`: Health check endpoint
  - Gemini AI integration
  - Safety filters for unsafe requests
  - Comprehensive error handling

## 📡 API Usage

### Endpoint: POST /api/legal-chat

**Request:**

```json
{
  "role": "Police",
  "question": "What makes digital evidence admissible?"
}
```

**Response:**

```json
{
  "answer": "Digital evidence is generally admissible when it meets several criteria..."
}
```

**Example with curl:**

```bash
curl -X POST http://localhost:3001/api/legal-chat \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Police",
    "question": "What is chain of custody?"
  }'
```

## 🎨 Features

### Frontend Features

- ✅ Floating chatbot button with smooth animations
- ✅ Professional legal/gov-tech design using Tailwind CSS
- ✅ Responsive chat window
- ✅ Quick question suggestions
- ✅ Visible legal disclaimer
- ✅ Loading states and error handling
- ✅ Auto-scroll to latest messages
- ✅ Keyboard shortcuts (Enter to send)

### Backend Features

- ✅ Gemini AI integration
- ✅ System prompt with legal constraints
- ✅ Automatic disclaimer in responses
- ✅ Safety filters for unsafe requests
- ✅ Role-based context (Police/General)
- ✅ Comprehensive error handling
- ✅ CORS configuration for frontend

## 🔒 Safety & Ethics

The chatbot includes multiple safety mechanisms:

1. **System Prompt**: Carefully crafted to avoid legal advice
2. **Pattern Detection**: Detects requests for advice, verdicts, or judgments
3. **Automatic Disclaimers**: Every response includes a legal disclaimer
4. **Politeness**: Refuses unsafe requests politely with explanations

## 🐛 Troubleshooting

### Backend Issues

**"GEMINI_API_KEY not found"**

- Check that `.env` file exists in `backend/` directory
- Verify the API key is correctly set: `GEMINI_API_KEY=your_key`

**Port already in use**

- Change `PORT` in `.env` to a different port (e.g., 3002)
- Update frontend API URL in `LegalChatbot.tsx` if needed

**CORS errors**

- Ensure backend is running before starting frontend
- Check that backend URL in frontend matches backend port

### Frontend Issues

**Chatbot not appearing**

- Check browser console for errors
- Verify backend is running and accessible
- Check network tab for API call failures

**Messages not sending**

- Verify backend is running on correct port
- Check browser console for CORS or network errors
- Ensure API URL in `LegalChatbot.tsx` matches backend port

## 📝 Code Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── LegalChatbot.tsx    # Chatbot component
│   └── App.tsx                  # App with chatbot integration
└── backend/
    ├── server.js                # Express server
    ├── package.json             # Backend dependencies
    ├── .env.example             # Environment template
    └── README.md                # Backend documentation
```

## 🔧 Customization

### Change User Role

In `src/pages/LegalChatbotPage.tsx`, modify the default role:

```tsx
const [userRole, setUserRole] = useState<"Police" | "General">("General");
```

### Change Backend URL

In `src/components/LegalChatbot.tsx`, update the fetch URL:

```tsx
const response = await fetch('http://localhost:YOUR_PORT/api/legal-chat', {
```

### Modify System Prompt

Edit the `SYSTEM_PROMPT` constant in `backend/server.js` to adjust the chatbot's behavior.

## 📚 Example Questions

The chatbot can answer questions like:

- "What is chain of custody?"
- "What makes digital evidence admissible?"
- "Common reasons evidence is rejected"
- "Explain the difference between direct and circumstantial evidence"
- "What is the best evidence rule?"

## ⚖️ Legal Disclaimer

This chatbot is designed for educational purposes only. It:

- ✅ Provides general legal information
- ✅ Explains legal concepts
- ❌ Does NOT provide legal advice
- ❌ Does NOT give verdicts or judgments
- ❌ Does NOT replace legal counsel

Always consult with qualified attorneys for legal advice specific to your situation.

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review backend logs for error messages
3. Verify all environment variables are set correctly
4. Ensure both frontend and backend are running

---

**Built for TrustChain-EMS - Securing justice with blockchain technology.**
