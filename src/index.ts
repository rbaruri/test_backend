import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { promises as fs } from 'fs';
import * as ocr from './ocr';
import { sendMessageToGPT } from './aigen';
import 'dotenv/config';

// Add multer file type to Express.Request
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File
    }
  }
}

interface ConsoleStyles {
  success: string;
  error: string;
  info: string;
  warning: string;
}

// Add console styling
const consoleStyles: ConsoleStyles = {
  success: '\x1b[32m%s\x1b[0m',    // Green
  error: '\x1b[31m%s\x1b[0m',      // Red
  info: '\x1b[36m%s\x1b[0m',       // Cyan
  warning: '\x1b[33m%s\x1b[0m'     // Yellow
};

// Create required directories
async function createRequiredDirectories() {
  const dirs = ['uploads', 'src/extracted_text'];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Serve extracted text files statically
app.use('/extracted_text', express.static(path.join(__dirname, 'extracted_text')));

// File upload and OCR endpoint
app.post('/api/ocr', upload.single('file'), async (req: Request, res: Response): Promise<void> => { 
  try {
    if (!req.file) {
      console.log(consoleStyles.error, '❌ No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const startDate = req.body.startDate || new Date().toISOString();
    const endDate = req.body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Process the file with OCR
    console.log(consoleStyles.info, '\n📄 Processing file with OCR...');
    const result = await ocr.processFile(req.file.path);
    console.log(consoleStyles.success, '✅ OCR processing complete');
    console.log(consoleStyles.info, '\n📝 Extracted Text:');
    console.log(result.text);
    
    // Generate AI learning path
    console.log(consoleStyles.info, '\n🤖 Generating AI learning path...');
    let aiResponse = await sendMessageToGPT(result.text, startDate, endDate);
    console.log(consoleStyles.success, '✅ AI learning path generated');
    console.log(consoleStyles.info, '\n🤖 AI Response:');
    console.log(aiResponse);

    // Validate AI response
    let parsedAiResponse;
    try {
      if (!aiResponse) {
        throw new Error('AI response is null');
      }
      
      parsedAiResponse = JSON.parse(aiResponse);
      if (!parsedAiResponse.modules || !Array.isArray(parsedAiResponse.modules)) {
        throw new Error('Invalid AI response structure');
      }

      // Display quiz questions for each module
      console.log(consoleStyles.info, '\n📝 Quiz Questions by Module:');
      parsedAiResponse.modules.forEach((module: any) => {
        console.log(consoleStyles.success, `\n📚 Module ${module.id}: ${module.title}`);
        console.log('Description:', module.description);
        
        if (module.quiz && module.quiz.questions) {
          module.quiz.questions.forEach((q: any, index: number) => {
            console.log(consoleStyles.info, `\nQuestion ${index + 1}: ${q.question}`);
            console.log('Options:');
            q.options.forEach((option: string, optIndex: number) => {
              const prefix = option === q.correctAnswer ? '✅' : '  ';
              console.log(`${prefix} ${optIndex + 1}. ${option}`);
            });
            console.log(consoleStyles.success, `Correct Answer: ${q.correctAnswer}`);
          });
        }
      });

      // Update the AI response with the new resources
      aiResponse = JSON.stringify(parsedAiResponse);
      console.log(consoleStyles.success, '✅ Updated AI response with study materials');

    } catch (parseError: unknown) {
      const err = parseError as Error;
      console.log(consoleStyles.error, `❌ Error parsing AI response: ${err.message}`);
      res.status(500).json({ error: 'Failed to generate learning path' });
      return;
    }
    
    // Convert the saved path to a URL
    const savedUrl = `/extracted_text/${path.basename(result.savedPath)}`;
    
    res.json({ 
      result: result.text,
      savedUrl: savedUrl,
      aiResponse: aiResponse
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(consoleStyles.error, `❌ Error processing file: ${err.message}`);
    res.status(500).json({ 
      error: 'Failed to process file',
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;

// Initialize server
async function startServer() {
  try {
    await createRequiredDirectories();
    app.listen(PORT, () => {
      console.log(consoleStyles.success, `\n✅ Server running on port ${PORT}`);
      console.log(consoleStyles.info, '\nAvailable endpoint:');
      console.log('- POST /api/ocr: Upload and process syllabus');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
