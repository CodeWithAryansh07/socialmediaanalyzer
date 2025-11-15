# Social Media Content Analyzer 📱✨

A Next.js application that analyzes social media posts from uploaded PDF and image files, extracting text using OCR and providing AI-powered engagement improvement suggestions. Now with user authentication and upload history!

## Features

- **📄 PDF Text Extraction**: Upload PDF files and extract text while maintaining formatting
- **🖼️ OCR for Images**: Extract text from images using OCR.space API with automatic compression
- **🤖 AI-Powered Analysis**: Get intelligent suggestions using Google Gemini AI
- **💡 Engagement Insights**: Receive recommendations for hashtags, posting times, tone adjustments, and content improvements
- **👤 User Authentication**: Secure login and registration with NextAuth.js
- **💾 Upload History**: Save and view your analysis history in MongoDB
- **🎨 Modern UI**: Clean, responsive interface with drag-and-drop file upload
- **🌓 Dark Mode**: Full dark mode support
- **📋 Copy to Clipboard**: Easily copy extracted text and suggestions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js with JWT
- **Database**: MongoDB with Mongoose
- **PDF Processing**: pdf-parse
- **Image Processing**: Sharp (compression) + OCR.space API
- **AI Service**: Google Gemini API (gemini-pro)
- **File Upload**: react-dropzone

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Google Gemini API key (free tier available)
- MongoDB Atlas account (free tier available)

### Quick Setup

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
   - Set up MongoDB Atlas at [cloud.mongodb.com](https://cloud.mongodb.com/)
   - Generate a NextAuth secret (see [AUTH_SETUP.md](AUTH_SETUP.md))
   - Update `.env.local`:
```env
GEMINI_API_KEY=your_actual_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialmediaanalyzer
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Detailed Setup Guides

- **[AUTH_SETUP.md](AUTH_SETUP.md)** - Complete authentication and MongoDB setup guide
- **[FEATURES.md](FEATURES.md)** - Full feature list and technical details
- **[APPROACH.md](APPROACH.md)** - Technical implementation approach
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide for development

## Usage

### As Guest
1. **Upload a File**: Drag and drop or click to select a PDF or image file
2. **Text Extraction**: The app automatically extracts text from your file
3. **AI Analysis**: Google Gemini AI analyzes the content
4. **View Suggestions**: Review engagement improvements and recommendations

### As Registered User
1. **Sign Up**: Create an account with email and password
2. **Sign In**: Log in to access your dashboard
3. **Upload Files**: Same as guest, but uploads are saved automatically
4. **View History**: Access all your previous analyses in the dashboard
5. **Track Progress**: See your upload history with timestamps

## Project Structure

```
socialmediaanalyzer/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/  # NextAuth.js configuration
│   │   │   └── register/       # User registration endpoint
│   │   ├── extract-pdf/        # PDF text extraction endpoint
│   │   ├── extract-image/      # OCR image processing endpoint
│   │   ├── analyze/            # AI analysis endpoint
│   │   └── uploads/            # Upload save/fetch endpoints
│   ├── auth/
│   │   ├── signin/             # Sign in page
│   │   └── signup/             # Sign up page
│   ├── components/
│   │   ├── FileUploader.tsx    # Main upload and results component
│   │   └── Providers.tsx       # NextAuth session provider
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard with history
│   ├── models/
│   │   ├── User.ts             # User MongoDB model
│   │   └── Upload.ts           # Upload MongoDB model
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Home page
├── lib/
│   └── mongodb.ts              # MongoDB connection utility
├── types/
│   ├── pdf-parse.d.ts          # PDF parse type definitions
│   └── next-auth.d.ts          # NextAuth type definitions
├── public/
├── .env.local                  # Environment variables (gitignored)
├── AUTH_SETUP.md               # Authentication setup guide
├── FEATURES.md                 # Complete feature list
├── APPROACH.md                 # Technical approach
├── next.config.ts
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- **POST /api/auth/register** - User registration
- **POST /api/auth/[...nextauth]** - NextAuth.js authentication handlers

### File Processing
- **POST /api/extract-pdf** - Extracts text from PDF files
- **POST /api/extract-image** - OCR for images with automatic compression
- **POST /api/analyze** - AI analysis of extracted text

### User Data
- **GET /api/uploads** - Get user's upload history (authenticated)
- **POST /api/uploads/save** - Save analysis to database (authenticated)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `GEMINI_API_KEY`
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET` (generate a new one for production)
4. Deploy!

**Important**: Update MongoDB Atlas Network Access to allow connections from Vercel's IP addresses.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Application URL (http://localhost:3000 for dev) | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | Yes |

See [AUTH_SETUP.md](AUTH_SETUP.md) for detailed setup instructions.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
