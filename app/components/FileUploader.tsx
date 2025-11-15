'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

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

export default function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        } ${uploading || analyzing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {uploading && (
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              Extracting text...
            </p>
          )}
          {analyzing && (
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              Analyzing content with AI...
            </p>
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
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          {/* Extracted Text */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Extracted Text
              </h2>
              <button
                onClick={() => copyToClipboard(result.extractedText)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {result.extractedText}
              </p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
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
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Engagement Improvements
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {result.analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hashtags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Recommended Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

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
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Analyze Another File
          </button>
        </div>
      )}
    </div>
  );
}
