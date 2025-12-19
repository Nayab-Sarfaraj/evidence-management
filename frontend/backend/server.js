import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({origin:"*"}));
app.use(express.json());

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG images are allowed.'));
    }
  },
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt for legal knowledge assistant
const SYSTEM_PROMPT = `You are a Legal Knowledge Assistant.

You may receive optional user-provided context.
The context is informational and may be incomplete or unverified.

Use the context ONLY to improve explanation and relevance.
Do NOT treat context as proven fact.
Do NOT give legal advice, verdicts, or judgments.
Do NOT comment on guilt or innocence.

If the question asks for legal advice or a decision, politely refuse.

Always explain in simple, neutral language.
Always include a legal disclaimer.

ADDITIONAL GUIDELINES:
- Provide GENERAL LEGAL KNOWLEDGE and educational information
- Explain legal concepts related to digital evidence, chain of custody, and evidence admissibility
- Clarify procedural legal concepts in a clear, neutral manner
- Use simple language that is accessible to all users
- Focus on procedural knowledge and general principles
- Use clear examples when explaining concepts, but avoid referencing specific real cases

STRICT LIMITATIONS:
- You MUST NOT provide legal advice
- You MUST NOT give verdicts, judgments, or opinions on guilt or innocence
- You MUST NOT comment on specific cases or make determinations
- You MUST NOT replace lawyers, judges, or legal counsel
- You MUST NOT provide recommendations on how to proceed with specific legal matters

RESPONSE FORMAT:
1. If asked for legal advice, politely refuse and explain: "I can only provide general educational information about legal concepts. For legal advice specific to your situation, please consult with a qualified attorney."
2. If asked about verdicts or judgments, respond: "I cannot provide verdicts or judgments. I can only explain general legal concepts and procedures."
3. Always maintain a neutral, educational tone
4. Always end your response with: "⚠️ Disclaimer: This information is for educational purposes only and does not constitute legal advice. Please consult with qualified legal counsel for advice specific to your situation."

Now, respond to the user's question:`;

// Vision-specific prompt for image analysis
const VISION_PROMPT = `You are a Legal Knowledge Assistant with vision capabilities.

Analyze the provided image for general visual characteristics only.

STRICT RULES FOR IMAGE ANALYSIS:
- Describe what is visible in the image (objects, scenes, text, etc.)
- Note quality issues: blur, lighting conditions, obstructions, resolution
- Explain general evidentiary considerations related to image quality
- Do NOT identify people or objects as specific individuals
- Do NOT perform face recognition or biometric identification
- Do NOT speculate beyond what is visible
- Do NOT make claims about guilt or innocence
- Do NOT provide legal advice or verdicts

OUTPUT FORMAT:
1. Clear description of visible content
2. Bullet-point observations (lighting, clarity, obstructions, quality)
3. General evidentiary considerations
4. End with disclaimer

Always include: "⚠️ This analysis is for general informational purposes only and does not constitute legal advice."`;

// Helper function to convert image buffer to base64 string (for Gemini Vision API)
const imageToBase64 = (buffer) => {
  return buffer.toString('base64');
};

// Legal chat endpoint - handles both JSON and multipart/form-data
app.post('/api/legal-chat', upload.single('image'), async (req, res) => {
  try {
    // Handle both JSON and multipart/form-data requests
    let role, question, context, imageFile;
    
    if (req.file) {
      // Multipart/form-data request (with image)
      role = req.body.role;
      question = req.body.question;
      context = req.body.context || null;
      imageFile = req.file;
    } else {
      // JSON request (text-only)
      ({ role, question, context } = req.body);
      imageFile = null;
    }

    // Validation
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'Question is required and must be a non-empty string',
      });
    }

    if (role && !['Police', 'General'].includes(role)) {
      return res.status(400).json({
        error: 'Role must be either "Police" or "General"',
      });
    }

    // Check for unsafe requests (requests for legal advice or verdicts)
    const unsafePatterns = [
      /should i|what should|what do you recommend|what do you think|what's your opinion/i,
      /is this legal|is this illegal|can i|am i allowed/i,
      /will i win|will i lose|what's the verdict|what's the judgment/i,
      /am i guilty|am i innocent|is he guilty|is she guilty/i,
      /tell me what to do|what should i do next|how should i proceed/i,
    ];

    const isUnsafeRequest = unsafePatterns.some((pattern) => pattern.test(question));

    if (isUnsafeRequest) {
      return res.json({
        answer: `I understand you're seeking guidance, but I can only provide general educational information about legal concepts. I cannot provide legal advice, recommendations, or opinions on specific situations.

For questions about:
- Whether something is legal or illegal in your specific case
- What you should do in a particular situation
- Verdicts, judgments, or determinations of guilt/innocence
- Recommendations on how to proceed

Please consult with a qualified attorney who can provide advice tailored to your specific circumstances.

⚠️ Disclaimer: This information is for educational purposes only and does not constitute legal advice. Please consult with qualified legal counsel for advice specific to your situation.`,
      });
    }

    // Get the model (use vision-capable model if image is present)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

    let answer;

    // If image is provided, use vision API
    if (imageFile) {
      // Convert image buffer to base64 string
      const imageBase64 = imageToBase64(imageFile.buffer);
      
      // Construct prompt with vision instructions
      let visionPrompt = `${VISION_PROMPT}\n\nUser Role: ${role || 'General'}\n`;
      
      // Add context if provided
      if (context && typeof context === 'string' && context.trim().length > 0) {
        visionPrompt += `\nOptional User-Provided Context (informational, may be incomplete or unverified):\n${context.trim()}\n`;
      }
      
      visionPrompt += `\nUser Question: ${question}`;

      // Prepare image part for Gemini Vision API
      const imagePart = {
        inlineData: {
          data: imageBase64, // Base64 string without data URI prefix
          mimeType: imageFile.mimetype,
        },
      };

      // Generate response with vision (pass array with prompt and image)
      const result = await model.generateContent([visionPrompt, imagePart]);
      const response = await result.response;
      answer = response.text();
    } else {
      // Text-only request
      // Construct the full prompt with optional context
      let fullPrompt = `${SYSTEM_PROMPT}\n\nUser Role: ${role || 'General'}\n`;
      
      // Add context if provided (context is optional and may be incomplete/unverified)
      if (context && typeof context === 'string' && context.trim().length > 0) {
        fullPrompt += `\nOptional User-Provided Context (informational, may be incomplete or unverified):\n${context.trim()}\n`;
      }
      
      fullPrompt += `\nUser Question: ${question}`;

      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      answer = response.text();
    }

    // Ensure disclaimer is present (add if not already there)
    if (!answer.includes('Disclaimer') && !answer.includes('disclaimer')) {
      if (imageFile) {
        answer += '\n\n⚠️ This analysis is for general informational purposes only and does not constitute legal advice.';
      } else {
        answer += '\n\n⚠️ Disclaimer: This information is for educational purposes only and does not constitute legal advice. Please consult with qualified legal counsel for advice specific to your situation.';
      }
    }

    res.json({
      answer: answer.trim(),
    });
  } catch (error) {
    console.error('Error in legal-chat endpoint:', error);

    // Handle multer errors (file upload errors)
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File size too large. Maximum size is 10MB.',
        });
      }
      return res.status(400).json({
        error: `File upload error: ${error.message}`,
      });
    }

    // Handle file validation errors
    if (error.message?.includes('Invalid file type')) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG, JPG, and PNG images are allowed.',
      });
    }

    // Handle specific Gemini API errors
    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({
        error: 'Gemini API key is missing or invalid. Please check your environment variables.',
      });
    }

    res.status(500).json({
      error: 'An error occurred while processing your request. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TrustChain-EMS Legal Chatbot API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TrustChain-EMS Legal Chatbot API running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
  }
});

