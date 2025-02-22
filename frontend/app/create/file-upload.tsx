"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileIcon, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.name.endsWith(".tar")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid .tar file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/x-tar": [".tar"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      console.log("File selected:", file.name);
      // TODO: Add AWS ECR upload logic here
    } catch (err) {
      setError("Error uploading file");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-end p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-medium font-oddlini mb-3">
            Upload Docker Image
          </h1>
          <p className="text-sm text-muted-foreground font-hanken">
            Upload your Docker image as a .tar file for deployment
          </p>
        </div>

        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out cursor-pointer",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50",
              file && "border-primary/50 bg-primary/5",
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              <UploadCloud
                className={cn(
                  "h-12 w-12 text-gray-400",
                  isDragActive && "text-primary",
                  file && "text-primary",
                )}
              />
              {!file && (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 font-hanken">
                    {isDragActive
                      ? "Drop the file here"
                      : "Drag and drop your .tar file here"}
                  </p>
                  <p className="text-xs text-gray-500 font-hanken mt-1">
                    or click to select a file
                  </p>
                </div>
              )}
              {file && (
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 w-full max-w-md">
                  <FileIcon className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate font-hanken">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 font-hanken">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-hanken text-center">
              {error}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full font-hanken h-11"
          >
            {isUploading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Uploading...
              </>
            ) : (
              "Upload Docker Image"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
