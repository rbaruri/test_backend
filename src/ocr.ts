import 'dotenv/config';
import { v1 as documentai } from '@google-cloud/documentai';
import { promises as fs } from 'fs';
import path from 'path';

const projectId: string = process.env.PROJECT_ID!;
const location: string = process.env.LOCATION!;
const processorId: string = process.env.PROCESSOR_ID!;
const keyFilePath: string = process.env.GOOGLE_APPLICATION_CREDENTIALS!;

// Instantiates a client with credentials
const client = new documentai.DocumentProcessorServiceClient({
  keyFilename: keyFilePath,
});

interface ProcessFileResult {
  text: string;
  savedPath: string;
}

async function processFile(filePath: string): Promise<ProcessFileResult> {
  const name: string = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  // Read the file into memory.
  const imageFile: Buffer = await fs.readFile(filePath);

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage: string = Buffer.from(imageFile).toString('base64');

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: 'application/pdf',
    },
  };

  // Recognizes text entities in the PDF document
  const [result] = await client.processDocument(request);
  const { document } = result;

  if (!document) {
    throw new Error('No document was returned from the API');
  }
  
  const { text } = document;

  // Extract shards from the text field
  const getText = (textAnchor: any): string => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return '';
    }

    const startIndex: number = textAnchor.textSegments[0].startIndex || 0;
    const endIndex: number = textAnchor.textSegments[0].endIndex;

    return text ? text.substring(startIndex, endIndex) : '';
  };

  // Read the text recognition output from the processor
  if (!document.pages || document.pages.length === 0) {
    throw new Error('No pages found in the document');
  }
  
  const [page1] = document.pages;
  const { paragraphs } = page1;

  const extractedText: string = paragraphs ? paragraphs.map((paragraph: any) => 
    getText(paragraph.layout.textAnchor)
  ).join('\n') : '';

  console.log('Extracted text from OCR:', extractedText);

  // Save the extracted text to a file
  const extractedTextDir = path.join(__dirname, 'extracted_text');
  await fs.mkdir(extractedTextDir, { recursive: true });
  const savedPath = path.join(extractedTextDir, `${path.basename(filePath)}.txt`);
  await fs.writeFile(savedPath, extractedText);

  // Clean up the uploaded file
  await fs.unlink(filePath);

  return {
    text: extractedText,
    savedPath
  };
}

export {
  processFile
};
