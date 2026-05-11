import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let image: string | null = null;

  if (request.headers.get("content-type")?.includes("application/json")) {
    const body = await request.json();
    image = typeof body.image === "string" ? body.image : null;
  } else {
    const formData = await request.formData();
    const file = formData.get("file");
    if (file instanceof File) {
      const bytes = Buffer.from(await file.arrayBuffer());
      image = `data:${file.type};base64,${bytes.toString("base64")}`;
    }
  }

  if (!image) return NextResponse.json({ error: "Image file is required" }, { status: 400 });

  try {
    const result = await cloudinary.uploader.upload(image, { folder: "tshirt-store" });
    return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
