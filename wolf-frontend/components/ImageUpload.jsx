"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";
import imageCompression from 'browser-image-compression';
import { Loader2, X } from "lucide-react";

export function ImageUpload({ endpoint = "imageUploader", value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);

  if (value) {
    return (
      <div className="relative h-48 w-full max-w-sm rounded-lg overflow-hidden border border-border">
        <img
          src={value}
          alt="Upload"
          className="object-cover w-full h-full"
        />
        <button
          onClick={() => onChange("")}
          className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full shadow-sm hover:bg-destructive/90 transition"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm border border-dashed border-border rounded-lg p-2 bg-card">
      <UploadDropzone
        endpoint={endpoint}
        onBeforeUploadBegin={async (files) => {
          setIsUploading(true);
          const compressedFiles = await Promise.all(
            files.map(async (file) => {
              const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
              };
              try {
                const compressedBlob = await imageCompression(file, options);
                return new File([compressedBlob], file.name, {
                  type: file.type,
                });
              } catch (error) {
                console.error("Compression error:", error);
                return file;
              }
            })
          );
          return compressedFiles;
        }}
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          onChange(res?.[0]?.url);
        }}
        onUploadError={(error) => {
          setIsUploading(false);
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}
