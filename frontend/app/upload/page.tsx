'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.tar')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid .tar file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      console.log('File selected:', file.name);
      // TODO: Add AWS ECR upload logic here
    } catch (err) {
      setError('Error uploading file');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 items-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Upload Docker Image</h1>
        
        <div className="bg-accent/50 rounded-lg p-6 mb-6">
          <p className="text-sm mb-2">
            Upload your Docker image as a .tar file. This will be used to deploy your application.
          </p>
          <p className="text-xs text-muted-foreground">
            Only .tar files are accepted
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".tar"
              onChange={handleFileChange}
              className="border rounded p-2"
              disabled={isUploading}
            />
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            {file && (
              <div className="bg-accent/30 p-3 rounded">
                <p className="text-sm">Selected file: {file.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full md:w-auto"
            >
              {isUploading ? 'Uploading...' : 'Upload Docker Image'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 