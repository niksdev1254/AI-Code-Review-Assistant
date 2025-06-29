import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GOOGLE_GEMINI_API_KEY'];
const placeholderValues = [
  'your_supabase_url_here',
  'your_supabase_anon_key_here', 
  'your_supabase_service_role_key_here',
  'your_google_gemini_api_key_here'
];

const missingEnvVars = requiredEnvVars.filter(envVar => {
  const value = process.env[envVar];
  return !value || placeholderValues.includes(value);
});

if (missingEnvVars.length > 0) {
  console.error('❌ Missing or invalid environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\n📝 Please update your server/.env file with valid credentials');
  console.error('   Supabase: https://supabase.com/dashboard/project/[your-project]/settings/api');
  console.error('   Google Gemini: https://makersuite.google.com/app/apikey');
  console.error('\n🔧 To fix this:');
  console.error('   1. Get your Supabase credentials from your project dashboard');
  console.error('   2. Get your Google Gemini API key from Google AI Studio');
  console.error('   3. Replace the placeholder values in server/.env');
  console.error('\n⚠️  Server will not start until valid credentials are provided');
  process.exit(1);
}

// Initialize Supabase client
let supabase;
try {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  process.exit(1);
}

// Initialize Google Gemini AI
let genAI;
let model;
try {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log('✅ Google Gemini AI initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Google Gemini AI:', error.message);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    services: {
      supabase: '✅ Connected',
      gemini: '✅ Connected'
    }
  });
});

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Test Supabase connection
app.get('/api/supabase-test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1);
    if (error) {
      res.json({ status: 'connected', message: 'Supabase connected (no test table found)', error: error.message });
    } else {
      res.json({ status: 'connected', message: 'Supabase connected successfully', data });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Supabase connection failed', error: error.message });
  }
});

// Test Google Gemini AI
app.post('/api/gemini-test', async (req, res) => {
  try {
    const { prompt = "Hello, how are you?" } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      status: 'success', 
      message: 'Google Gemini AI working successfully',
      prompt,
      response: text
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Google Gemini AI test failed', 
      error: error.message 
    });
  }
});

// Code review endpoint using Gemini
app.post('/api/code-review', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const prompt = `Please review the following ${language} code and provide constructive feedback:

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Overall code quality assessment
2. Potential bugs or issues
3. Performance improvements
4. Best practices suggestions
5. Security considerations (if applicable)
6. Code style and readability improvements

Format your response in a clear, structured way.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const review = response.text();
    
    res.json({ 
      success: true,
      review,
      language,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Code review error:', error);
    res.status(500).json({ 
      error: 'Failed to generate code review',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 API test: http://localhost:${PORT}/api/test`);
  console.log(`🗄️  Supabase test: http://localhost:${PORT}/api/supabase-test`);
  console.log(`🤖 Gemini test: POST http://localhost:${PORT}/api/gemini-test`);
  console.log(`📝 Code review: POST http://localhost:${PORT}/api/code-review`);
});