import { isAdminAuthenticated } from "@/lib/admin-auth";
import { writeBinaryFile } from "@/lib/json-store";

export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });

  const formData = await request.formData();
  const files = formData.getAll("images").filter((item): item is File => item instanceof File);
  if (!files.length) return Response.json({ error: "Wybierz co najmniej jedno zdjęcie." }, { status: 400 });
  if (files.length > 10) return Response.json({ error: "Jednorazowo możesz dodać maksymalnie 10 zdjęć." }, { status: 400 });

  const uploaded: string[] = [];
  for (const file of files) {
    const extension = allowedTypes.get(file.type);
    if (!extension) return Response.json({ error: "Dozwolone formaty zdjęć: JPG, PNG i WebP." }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return Response.json({ error: `Plik ${file.name} jest większy niż 8 MB.` }, { status: 400 });

    const fileName = `${crypto.randomUUID()}.${extension}`;
    await writeBinaryFile(fileName, Buffer.from(await file.arrayBuffer()));
    uploaded.push(`/api/fleet-images/${fileName}`);
  }

  return Response.json({ images: uploaded }, { status: 201 });
}
