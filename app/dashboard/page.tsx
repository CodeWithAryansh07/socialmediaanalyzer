'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FileUploader from '../components/FileUploader';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Upload {
  _id: string;
  fileName: string;
  fileType: string;
  extractedText: string;
  analysis: {
    summary?: string;
    suggestions?: string[];
    hashtags?: string[];
  };
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const response = await fetch('/api/uploads');
        if (response.ok) {
          const data = await response.json();
          setUploads(data.uploads);
        }
      } catch (error) {
        console.error('Failed to fetch uploads:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUploads();
    }
  }, [session, refreshTrigger]);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Skeleton 
              width={200} 
              height={30} 
              baseColor="#1f2937"
              highlightColor="#374151"
            />
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton 
            height={300} 
            className="mb-8" 
            baseColor="#1f2937"
            highlightColor="#374151"
          />
          <Skeleton 
            count={3} 
            height={150} 
            className="mb-4" 
            baseColor="#1f2937"
            highlightColor="#374151"
          />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {session.user.name}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-shadow"
          >
            Sign Out
          </motion.button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Uploader Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload New File</h2>
          <FileUploader onUploadComplete={handleUploadComplete} />
        </div>

        {/* Upload History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Upload History</h2>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton 
                height={150} 
                className="rounded-lg" 
                baseColor="#1f2937"
                highlightColor="#374151"
              />
              <Skeleton 
                height={150} 
                className="rounded-lg" 
                baseColor="#1f2937"
                highlightColor="#374151"
              />
              <Skeleton 
                height={150} 
                className="rounded-lg" 
                baseColor="#1f2937"
                highlightColor="#374151"
              />
            </div>
          ) : uploads.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No uploads yet. Upload your first file above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploads.map((upload, index) => (
                <motion.div
                  key={upload._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{upload.fileName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(upload.createdAt).toLocaleDateString()} at{' '}
                        {new Date(upload.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {upload.fileType}
                    </span>
                  </div>

                  {upload.analysis?.summary && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Summary</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{upload.analysis.summary}</p>
                    </div>
                  )}

                  {upload.analysis?.suggestions && upload.analysis.suggestions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggestions</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {upload.analysis.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {upload.analysis?.hashtags && upload.analysis.hashtags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Hashtags</h4>
                      <div className="flex flex-wrap gap-2">
                        {upload.analysis.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
