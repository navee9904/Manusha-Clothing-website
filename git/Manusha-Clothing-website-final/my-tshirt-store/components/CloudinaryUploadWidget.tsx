"use client";

import Script from "next/script";
import { useState } from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, string | undefined>,
        callback: (error: unknown, result: { event: string; info?: { secure_url?: string } }) => void,
      ) => { open: () => void };
    };
  }
}

export function CloudinaryUploadWidget({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  function openWidget() {
    if (!window.cloudinary || !cloudName || !uploadPreset) {
      toast.error("Cloudinary widget env is missing");
      return;
    }

    window.cloudinary
      .createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: "local,camera,url",
          folder: "tshirt-store",
        },
        (error, result) => {
          if (error) toast.error("Upload failed");
          if (result.event === "success" && result.info?.secure_url) {
            onUploaded(result.info.secure_url);
            toast.success("Image uploaded");
          }
        },
      )
      .open();
  }

  async function uploadFallback(file: File) {
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!data.url) return toast.error(data.error || "Upload failed");
    onUploaded(data.url);
    toast.success("Image uploaded");
  }

  return (
    <div className="flex gap-2">
      <Script src="https://upload-widget.cloudinary.com/latest/global/all.js" strategy="lazyOnload" />
      <button type="button" onClick={openWidget} className="border border-black px-4 py-2 text-center font-bold uppercase">
        Upload widget
      </button>
      <label className="cursor-pointer border border-black px-4 py-2 text-center font-bold uppercase">
        {uploading ? "Uploading" : "File"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFallback(e.target.files[0])} />
      </label>
    </div>
  );
}
