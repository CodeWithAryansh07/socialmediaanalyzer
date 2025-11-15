# Quick Start Guide

## Setup Instructions

### 1. Get Google Gemini API Key (FREE)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

1. Open `.env.local` file in the project root
2. Add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Testing the Application

### Test Files You Can Use:

1. **PDF Files**: Any PDF document with text content
2. **Images**: Screenshots of text, scanned documents (PNG, JPG, JPEG)

### Sample Test Workflow:

1. Upload a PDF or image containing social media post content
2. Wait for text extraction (PDF is fast, OCR takes ~10-30 seconds)
3. Review the AI analysis with:
   - Content summary
   - 5 engagement improvement suggestions
   - 5 relevant hashtags
   - Best time to post recommendations
   - Tone adjustments
4. Click "Copy" to copy extracted text to clipboard
5. Click "Analyze Another File" to start over

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your actual API key
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and add your `GEMINI_API_KEY` when asked for environment variables.

## Troubleshooting

### "API key not configured" error
- Make sure `.env.local` exists and contains `GEMINI_API_KEY`
- Restart the development server after adding the API key

### OCR is slow
- This is normal! Tesseract.js processes images client-side
- Typical processing time: 10-30 seconds for a standard screenshot
- For production, consider using cloud OCR services for faster processing

### PDF extraction fails
- Ensure the PDF contains actual text (not just images)
- For scanned PDFs (images), convert them to PNG/JPG and use the image upload instead

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `rm -rf .next ; npm run build`

## Features Checklist

- [x] PDF text extraction
- [x] Image OCR (Tesseract.js)
- [x] AI-powered analysis (Google Gemini)
- [x] Drag and drop file upload
- [x] Loading states during processing
- [x] Error handling
- [x] Copy to clipboard functionality
- [x] Dark mode support
- [x] Responsive design
- [x] Production-ready build

## Next Steps

1. **Customize Analysis**: Edit `app/api/analyze/route.ts` to modify the AI prompt
2. **Add More File Types**: Extend `FileUploader.tsx` to support DOCX, TXT, etc.
3. **Enhance UI**: Add file preview, history, or export to PDF
4. **Analytics**: Track usage with Vercel Analytics or Google Analytics

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review the terminal output for server errors
3. Ensure your Gemini API key is valid and has quota remaining
4. Check that all dependencies are installed correctly

Happy analyzing! 🚀
