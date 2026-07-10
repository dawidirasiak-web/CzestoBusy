import { readBinaryFile } from "@/lib/json-store";

export const runtime = "nodejs";

type RouteProps = { params: Promise<{ fileName: string }> };

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { fileName } = await params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(fileName)) return new Response(null, { status: 404 });

  try {
    const image = await readBinaryFile(fileName);
    const extension = fileName.split(".").pop() || "jpg";
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": contentTypes[extension],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
