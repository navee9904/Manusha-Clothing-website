"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await response.json();

        if (!response.ok || !data.url) {
          toast.error(data.error || "Upload failed");
          return;
        }

        onUpload(data.url);
        toast.success("Image uploaded");
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Could not read image");
    };
  };

  return (
    <label className="cursor-pointer border border-black px-4 py-2 text-center font-bold uppercase">
      {uploading ? "Uploading" : "Upload image"}
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </label>
  );
}
