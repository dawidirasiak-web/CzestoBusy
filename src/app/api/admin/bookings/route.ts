import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createBooking, listBookings, type Booking } from "@/lib/bookings";
import { findVehicle } from "@/lib/fleet";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });
  return Response.json({ bookings: await listBookings() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Brak autoryzacji." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Nieprawidlowe dane formularza." }, { status: 400 });
  }

  const text = (key: string) => typeof body[key] === "string" ? body[key].trim() : "";
  const vehicle = await findVehicle(text("vehicleId"));
  const startDate = text("startDate");
  const endDate = text("endDate");
  const customerName = text("customerName") || "Rezerwacja administracyjna";
  const phone = text("phone");
  const pickupTime = "09:00";
  const returnTime = "09:00";
  const customTotalPriceText = text("customTotalPrice");
  const customTotalPrice = customTotalPriceText ? Number(customTotalPriceText) : null;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const timePattern = /^\d{2}:\d{2}$/;

  if (!vehicle || !datePattern.test(startDate) || !datePattern.test(endDate) || endDate < startDate) {
    return Response.json({ error: "Wybierz pojazd i prawidlowy termin." }, { status: 400 });
  }
  if (!timePattern.test(pickupTime) || !timePattern.test(returnTime)) {
    return Response.json({ error: "Nieprawidlowe godziny rezerwacji." }, { status: 400 });
  }
  if (customTotalPrice !== null && (!Number.isFinite(customTotalPrice) || customTotalPrice < 0)) {
    return Response.json({ error: "Podaj prawidlowa kwote rezerwacji." }, { status: 400 });
  }

  const totalDays = Math.max(1, Math.ceil((Date.parse(endDate) - Date.parse(startDate)) / 86_400_000) + 1);
  const booking: Booking = {
    id: `CB-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    startDate,
    endDate,
    pickupTime,
    returnTime,
    customerName,
    email: "",
    phone,
    notes: "",
    totalDays,
    totalPrice: customTotalPrice ?? totalDays * vehicle.dailyPrice,
    status: "confirmed",
    source: "phone",
    createdAt: new Date().toISOString(),
  };

  try {
    await createBooking(booking);
  } catch (error) {
    if (error instanceof Error && error.message === "BOOKING_CONFLICT") {
      return Response.json({ error: "Pojazd jest juz zajety w wybranym terminie." }, { status: 409 });
    }
    console.error("Admin booking creation failed", error);
    return Response.json({ error: "Nie udalo sie zapisac rezerwacji." }, { status: 500 });
  }
  return Response.json({ booking }, { status: 201 });
}
