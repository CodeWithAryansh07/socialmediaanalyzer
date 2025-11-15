import FileUploader from './components/FileUploader';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Social Media Content Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload PDF or image files to extract text and get AI-powered suggestions
            to improve your social media engagement.
          </p>
        </header>

        <FileUploader />

        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Google Gemini AI • Supports PDF & Image (OCR) analysis</p>
        </footer>
      </div>
    </div>
  );
}
