import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteBooking, updateBookingStatus, type Booking } from "@/lib/bookings";

export const runtime = "nodejs";

type RouteProps = { params: Promise<{ bookingId: string }> };

export async function PATCH(request: Request, { params }: RouteProps) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });
  const { bookingId } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: unknown };
  if (body.status !== "confirmed" && body.status !== "cancelled") return Response.json({ error: "Nieprawidłowy status." }, { status: 400 });

  try {
    const booking = await updateBookingStatus(bookingId, body.status as Booking["status"]);
    return Response.json({ booking });
  } catch (error) {
    if (error instanceof Error && error.message === "BOOKING_CONFLICT") return Response.json({ error: "Nie można potwierdzić: termin koliduje z inną rezerwacją." }, { status: 409 });
    if (error instanceof Error && error.message === "BOOKING_NOT_FOUND") return Response.json({ error: "Nie znaleziono rezerwacji." }, { status: 404 });
    return Response.json({ error: "Nie udało się zmienić statusu." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });
  const { bookingId } = await params;
  try { await deleteBooking(bookingId); return Response.json({ success: true }); }
  catch (error) {
    if (error instanceof Error && error.message === "BOOKING_NOT_FOUND") return Response.json({ error: "Nie znaleziono rezerwacji." }, { status: 404 });
    return Response.json({ error: "Nie udało się usunąć rezerwacji." }, { status: 500 });
  }
}
