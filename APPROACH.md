# Technical Approach - Social Media Content Analyzer

## Overview
This application leverages Next.js 16's App Router for optimal performance and developer experience. The architecture follows a three-stage pipeline: upload, extraction, and analysis.

## Architecture

### File Upload & Handling
For file handling, react-dropzone provides an intuitive drag-and-drop interface with client-side validation. Files are validated for type (PDF, PNG, JPG, JPEG) and size (max 10MB) before processing begins.

### Text Extraction
The extraction stage uses two specialized endpoints:
- **PDF Processing**: `pdf-parse` library for PDF files with server-side processing
- **OCR Processing**: Tesseract.js for images, running in Node.js for faster processing compared to browser-based execution

Both endpoints convert uploaded files to buffers and process them server-side, ensuring better performance and security.

### AI Analysis
The AI analysis utilizes Google Gemini's `gemini-1.5-flash` model via their free tier API. The prompt engineering instructs the model to act as a social media expert, returning structured JSON with specific engagement metrics including:
- Content summary
- 5 actionable engagement suggestions
- 5 relevant hashtags
- Optimal posting time recommendations
- Tone and style recommendations

Error handling includes JSON parsing fallbacks to ensure reliability even when the AI response is malformed.

### User Interface
The UI implements progressive disclosure: users see loading states during extraction and analysis phases, with results displayed in organized sections. Tailwind CSS v4 provides responsive styling with dark mode support. Key features include:
- Real-time loading indicators
- Error messages with actionable feedback
- Copy-to-clipboard functionality for extracted text
- Clean, organized display of analysis results

### Data Privacy & Storage
All file processing occurs in-memory without persistent storage, ensuring user privacy and simplifying deployment. Files are processed and immediately discarded after text extraction.

### Deployment Architecture
The Next.js API routes handle CORS automatically, and the serverless architecture scales efficiently on Vercel's platform. Environment variables manage API keys securely, with clear setup instructions provided.

## Technology Choices

- **Next.js 16**: Latest features, App Router for better performance
- **Google Gemini API**: Free tier, excellent JSON output, fast response times
- **Tesseract.js**: Open-source OCR, no API limits or costs
- **pdf-parse**: Lightweight, server-side PDF processing
- **react-dropzone**: Industry-standard drag-and-drop library
- **Tailwind CSS v4**: Utility-first styling with minimal bundle size

## Performance Considerations

- Server-side processing for both PDF and OCR reduces client load
- Streaming responses where possible
- Optimistic UI updates with loading states
- Efficient re-renders using React best practices
- No unnecessary dependencies

---

**Word Count**: 198 words (Technical Approach section)
