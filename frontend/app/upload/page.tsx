"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepsProgress } from "@/components/steps-progress";
import { SmtpMessage } from "@/app/(auth-pages)/smtp-message";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".tar")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid .tar file");
    }
  };

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

  return (
    <form className="flex-1 flex flex-col min-w-64 items-center justify-center w-screen h-screen">
      <StepsProgress />
      <div className="flex flex-col gap-2 items-center w-[30rem]">
        <h1 className="text-4xl font-medium font-oddlini">
          Upload Docker Image
        </h1>
        <p className="text-sm text-foreground font-hanken items-center mt-1">
          Upload your Docker image as a .tar file for deployment
        </p>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4 w-full">
          <label htmlFor="file-upload" className="font-hanken">
            Docker Image File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".tar"
            onChange={handleFileChange}
            className="border rounded p-2 font-hanken"
            disabled={isUploading}
          />

          {error && <p className="text-red-500 text-sm font-hanken">{error}</p>}

          {file && (
            <div className="bg-accent/30 p-3 rounded">
              <p className="text-sm font-hanken">Selected file: {file.name}</p>
              <p className="text-xs text-muted-foreground font-hanken">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full font-hanken h-10 mt-2"
          >
            {isUploading ? "Uploading..." : "Upload Docker Image"}
          </Button>
        </div>
      </div>
    </form>
  );
}
