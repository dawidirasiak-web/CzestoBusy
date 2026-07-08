import { isAdminAuthenticated } from "@/lib/admin-auth";
import { vehicleFromBody } from "@/lib/admin-fleet-form";
import { deleteVehicle, updateVehicle } from "@/lib/fleet";

export const runtime = "nodejs";

type RouteProps = { params: Promise<{ vehicleId: string }> };

export async function PATCH(request: Request, { params }: RouteProps) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });
  const { vehicleId } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  const parsed = vehicleFromBody(body);
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });

  try {
    const vehicle = await updateVehicle(vehicleId, parsed.vehicle);
    return Response.json({ vehicle });
  } catch (error) {
    if (error instanceof Error && error.message === "VEHICLE_NOT_FOUND") return Response.json({ error: "Nie znaleziono pojazdu." }, { status: 404 });
    if (error instanceof Error && error.message === "VEHICLE_EXISTS") return Response.json({ error: "Pojazd z takim identyfikatorem już istnieje." }, { status: 409 });
    console.error("Vehicle update failed", error);
    return Response.json({ error: "Nie udało się zapisać zmian." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });
  const { vehicleId } = await params;

  try {
    await deleteVehicle(vehicleId);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "VEHICLE_NOT_FOUND") return Response.json({ error: "Nie znaleziono pojazdu." }, { status: 404 });
    console.error("Vehicle delete failed", error);
    return Response.json({ error: "Nie udało się usunąć pojazdu." }, { status: 500 });
  }
}
