import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Image file is required" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "mono-tee/products" });

  return NextResponse.json({ url: result.secure_url });
}

