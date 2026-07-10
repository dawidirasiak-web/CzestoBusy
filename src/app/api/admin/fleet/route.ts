import { isAdminAuthenticated } from "@/lib/admin-auth";
import { vehicleFromBody } from "@/lib/admin-fleet-form";
import { createVehicle, listFleet, reorderFleet } from "@/lib/fleet";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });
  return Response.json({ vehicles: await listFleet() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  const parsed = vehicleFromBody(body);
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });

  try {
    const created = await createVehicle(parsed.vehicle);
    return Response.json({ vehicle: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "VEHICLE_EXISTS") return Response.json({ error: "Pojazd z takim identyfikatorem już istnieje." }, { status: 409 });
    console.error("Vehicle creation failed", error);
    return Response.json({ error: "Nie udało się zapisać pojazdu." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;
  if (!body || !Array.isArray(body.ids) || body.ids.some((id) => typeof id !== "string")) {
    return Response.json({ error: "Nieprawidłowa kolejność pojazdów." }, { status: 400 });
  }
  try {
    await reorderFleet(body.ids as string[]);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Nie udało się zapisać kolejności floty." }, { status: 400 });
  }
}
