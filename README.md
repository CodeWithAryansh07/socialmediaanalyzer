# Social Media Content Analyzer 📱✨

A Next.js application that analyzes social media posts from uploaded PDF and image files, extracting text using OCR and providing AI-powered engagement improvement suggestions.

## Features

- **📄 PDF Text Extraction**: Upload PDF files and extract text while maintaining formatting
- **🖼️ OCR for Images**: Extract text from scanned documents and images using Tesseract.js
- **🤖 AI-Powered Analysis**: Get intelligent suggestions using Google Gemini AI
- **💡 Engagement Insights**: Receive recommendations for hashtags, posting times, tone adjustments, and content improvements
- **🎨 Modern UI**: Clean, responsive interface with drag-and-drop file upload
- **🌓 Dark Mode**: Full dark mode support
- **📋 Copy to Clipboard**: Easily copy extracted text and suggestions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **PDF Processing**: pdf-parse
- **OCR Engine**: Tesseract.js
- **AI Service**: Google Gemini API (gemini-1.5-flash)
- **File Upload**: react-dropzone

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Google Gemini API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd socialmediaanalyzer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key to `.env.local`:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload a File**: Drag and drop or click to select a PDF or image file (PNG, JPG, JPEG)
2. **Text Extraction**: The app automatically extracts text from your file
3. **AI Analysis**: Google Gemini AI analyzes the content as a social media post
4. **View Suggestions**: Review engagement improvements, hashtags, posting times, and tone recommendations
5. **Copy & Export**: Copy extracted text or suggestions for use in your social media campaigns

## Project Structure

```
socialmediaanalyzer/
├── app/
│   ├── api/
│   │   ├── extract-pdf/      # PDF text extraction endpoint
│   │   ├── extract-image/    # OCR image processing endpoint
│   │   └── analyze/          # AI analysis endpoint
│   ├── components/
│   │   └── FileUploader.tsx  # Main upload and results component
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Home page
├── public/
├── .env.example              # Environment variables template
├── .env.local               # Your local environment variables (gitignored)
├── next.config.ts
├── package.json
└── README.md
```

## API Endpoints

### POST /api/extract-pdf
Extracts text from uploaded PDF files.

**Request**: FormData with `file` field (PDF)  
**Response**: `{ text: string }`

### POST /api/extract-image
Performs OCR on uploaded images to extract text.

**Request**: FormData with `file` field (PNG, JPG, JPEG)  
**Response**: `{ text: string }`

### POST /api/analyze
Analyzes extracted text and provides social media engagement suggestions.

**Request**: `{ text: string }`  
**Response**:
```json
{
  "summary": "Content summary",
  "suggestions": ["suggestion 1", "..."],
  "hashtags": ["#tag1", "#tag2", "..."],
  "bestTimeToPost": "Timing recommendation",
  "toneRecommendations": "Tone guidance"
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add the `GEMINI_API_KEY` environment variable in Vercel project settings
4. Deploy!

The app will automatically deploy on every push to your main branch.

## Technical Approach (200 words)

This application leverages Next.js 16's App Router for optimal performance and developer experience. The architecture follows a three-stage pipeline: upload, extraction, and analysis.

For file handling, react-dropzone provides an intuitive drag-and-drop interface with client-side validation. The extraction stage uses two specialized endpoints: pdf-parse for PDF files (server-side processing with node-canvas dependencies) and Tesseract.js for OCR on images, running in Node.js for faster processing compared to browser-based execution.

The AI analysis utilizes Google Gemini's gemini-1.5-flash model via their free tier API. The prompt engineering instructs the model to act as a social media expert, returning structured JSON with specific engagement metrics including hashtags, posting times, and tone recommendations. Error handling includes JSON parsing fallbacks to ensure reliability.

The UI implements progressive disclosure: users see loading states during extraction and analysis phases, with results displayed in organized sections. Tailwind CSS v4 provides responsive styling with dark mode support.

All file processing occurs in-memory without persistent storage, ensuring privacy and simplifying deployment. The Next.js API routes handle CORS automatically, and the serverless architecture scales efficiently on Vercel's platform.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes |

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
