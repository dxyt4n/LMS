"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endPoint: string;
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    try {
      const filePath = `public/${file.name}`;
      const { data, error } = await supabase.storage
        .from("Group5")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("Group5").getPublicUrl(filePath);

      if (!publicUrl) throw new Error("Failed to get public URL");

      setPreviewUrl(publicUrl);
      onChange(publicUrl);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition">
        <p className="text-gray-500 text-sm">
          {previewUrl ? "Edit Image" : "Add photo (Click or drag and drop)"}
        </p>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {fileName && <p className="text-gray-600 text-sm">📂 {fileName}</p>}

      {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}

      {previewUrl && (
        <div className="border rounded-lg p-2 w-30 h-40 flex items-center justify-center">
          <Image
            src={previewUrl}
            alt="Uploaded Image"
            objectFit="cover"
            width={250}
            height={300}
            className="rounded-md"
          />
        </div>
      )}
    </div>
  );
};
