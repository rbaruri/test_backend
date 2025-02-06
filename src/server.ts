import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { processFile } from './services/ocrService';

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Endpoint to handle syllabus upload
app.post('/api/upload-syllabus', upload.single('file'), (req, res) => {
  (async () => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await processFile(req.file.path);
    console.log('OCR Result:', result.text);

    res.json({
      message: 'File processed successfully',
      text: result.text
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
})();
});

export default app;
