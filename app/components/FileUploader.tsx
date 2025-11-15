'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface AnalysisResult {
  extractedText: string;
  analysis: {
    summary: string;
    suggestions: string[];
    hashtags: string[];
    bestTimeToPost: string;
    toneRecommendations: string;
  };
}

interface FileUploaderProps {
  onUploadComplete?: () => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps = {}) {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Check for rejected files (file type or size issues)
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast.error('File is too large! Maximum size is 10MB', { duration: 4000 });
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        toast.error('Invalid file type! Please upload PDF or image files', { duration: 4000 });
      } else {
        toast.error('File rejected. Please try another file', { duration: 4000 });
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Additional client-side size check
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      toast.error(`File is too large! Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`, {
        duration: 5000,
      });
      return;
    }

    setError(null);
    setResult(null);
    setUploading(true);

    try {
      // Step 1: Extract text from file
      const formData = new FormData();
      formData.append('file', file);

      const extractEndpoint = file.type === 'application/pdf' 
        ? '/api/extract-pdf' 
        : '/api/extract-image';

      const extractResponse = await fetch(extractEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json();
        throw new Error(errorData.error || 'Failed to extract text');
      }

      toast.success('Text extracted successfully!');

      const { text } = await extractResponse.json();
      setUploading(false);
      setAnalyzing(true);

      // Step 2: Analyze the extracted text
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Failed to analyze text');
      }

      const analysis = await analyzeResponse.json();
      setResult({
        extractedText: text,
        analysis,
      });

      toast.success('🎉 Analysis complete!', {
        duration: 3000,
        icon: '✨',
      });

      // Step 3: Save to MongoDB if user is logged in
      if (session) {
        try {
          // Convert image to base64 if it's an image file
          let imageData: string | undefined;
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            imageData = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          }

          await fetch('/api/uploads/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type === 'application/pdf' ? 'pdf' : 'image',
              fileSize: file.size,
              imageData,
              extractedText: text,
              analysis,
            }),
          });
          
          // Trigger refresh of upload history
          if (onUploadComplete) {
            onUploadComplete();
          }
        } catch (saveError) {
          console.error('Failed to save upload:', saveError);
          toast.error('Failed to save to history', { duration: 2000 });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 4000 });
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  }, [session]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB in bytes
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        toast.error('File is too large! Maximum size is 10MB', { duration: 4000 });
      } else if (rejection?.errors[0]?.code === 'file-invalid-type') {
        toast.error('Invalid file type! Please upload PDF or image files', { duration: 4000 });
      }
    },
  });

  const { onClick, ...rootPropsWithoutOnClick } = getRootProps();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      duration: 2000,
      icon: '📋',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClick}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 scale-105'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg'
        } ${uploading || analyzing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <motion.div 
          className="space-y-4"
          animate={uploading || analyzing ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: uploading || analyzing ? Infinity : 0, duration: 1.5 }}
        >
          <motion.svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
            animate={isDragActive ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex gap-2">
                <motion.div
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                />
              </div>
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                Extracting text...
              </p>
            </motion.div>
          )}
          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                Analyzing content with AI...
              </p>
            </motion.div>
          )}
          {!uploading && !analyzing && (
            <>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isDragActive
                  ? 'Drop your file here'
                  : 'Drag & drop a PDF or image file'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to browse (PDF, PNG, JPG - max 10MB)
              </p>
            </>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
          >
            {/* Extracted Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Extracted Text
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(result.extractedText)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Copy
              </motion.button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {result.extractedText}
              </p>
            </div>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Social Media Analysis & Suggestions
            </h2>

            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Content Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {result.analysis.summary}
                </p>
              </div>

              {/* Engagement Suggestions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Engagement Improvements
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {result.analysis.suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {suggestion}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Hashtags */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Recommended Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.hashtags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer"
                      onClick={() => copyToClipboard(tag)}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Best Time to Post */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Best Time to Post
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {result.analysis.bestTimeToPost}
                </p>
              </div>

              {/* Tone Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Tone Recommendations
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {result.analysis.toneRecommendations}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Reset Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Analyze Another File
          </motion.button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
