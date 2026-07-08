import { createBooking, type Booking } from "@/lib/bookings";
import { findVehicle } from "@/lib/fleet";

export const runtime = "nodejs";

type BookingRequest = {
  vehicleId?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  pickupTime?: unknown;
  returnTime?: unknown;
  customerName?: unknown;
  email?: unknown;
  phone?: unknown;
  notes?: unknown;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s-]{7,17}$/;

export async function POST(request: Request) {
  let body: BookingRequest;
  try {
    body = (await request.json()) as BookingRequest;
  } catch {
    return Response.json({ error: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  const vehicleId = typeof body.vehicleId === "string" ? body.vehicleId : "";
  const vehicle = await findVehicle(vehicleId);
  const startDate = typeof body.startDate === "string" ? body.startDate : "";
  const endDate = typeof body.endDate === "string" ? body.endDate : "";
  const pickupTime = typeof body.pickupTime === "string" ? body.pickupTime : "";
  const returnTime = typeof body.returnTime === "string" ? body.returnTime : "";
  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : "";
  const today = new Date().toISOString().slice(0, 10);

  if (!vehicle || !datePattern.test(startDate) || !datePattern.test(endDate) || startDate < today || endDate < startDate) {
    return Response.json({ error: "Wybierz pojazd i prawidłowy termin rezerwacji." }, { status: 400 });
  }
  if (!timePattern.test(pickupTime) || !timePattern.test(returnTime)) {
    return Response.json({ error: "Wybierz godzinę odbioru i zwrotu." }, { status: 400 });
  }
  if (customerName.length < 3 || !emailPattern.test(email) || !phonePattern.test(phone)) {
    return Response.json({ error: "Uzupełnij poprawne dane kontaktowe." }, { status: 400 });
  }

  const millisecondsPerDay = 86_400_000;
  const totalDays = Math.max(1, Math.ceil((Date.parse(endDate) - Date.parse(startDate)) / millisecondsPerDay) + 1);
  const booking: Booking = {
    id: `CB-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    vehicleId,
    vehicleName: vehicle.name,
    startDate,
    endDate,
    pickupTime,
    returnTime,
    customerName,
    email,
    phone,
    notes,
    totalDays,
    totalPrice: totalDays * vehicle.dailyPrice,
    status: "confirmed",
    source: "online",
    createdAt: new Date().toISOString(),
  };

  try {
    await createBooking(booking);
  } catch (error) {
    if (error instanceof Error && error.message === "BOOKING_CONFLICT") {
      return Response.json({ error: "Ten pojazd jest już zarezerwowany w wybranym terminie. Wybierz inne daty lub samochód." }, { status: 409 });
    }
    console.error("Booking creation failed", error);
    return Response.json({ error: "Nie udało się zapisać rezerwacji. Spróbuj ponownie." }, { status: 500 });
  }

  return Response.json({ booking: { id: booking.id, vehicleName: booking.vehicleName, totalDays, totalPrice: booking.totalPrice } }, { status: 201 });
}
