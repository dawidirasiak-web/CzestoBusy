import { readJsonFile, writeJsonFile } from "@/lib/json-store";

export type Booking = {
  id: string;
  vehicleId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  customerName: string;
  email: string;
  phone: string;
  notes: string;
  totalDays: number;
  totalPrice: number;
  status: "confirmed" | "cancelled";
  source: "online" | "phone";
  createdAt: string;
};

let writeQueue = Promise.resolve();

async function readBookings(): Promise<Booking[]> {
  return readJsonFile<Booking[]>("bookings.json", []);
}

export async function getBookedRanges(vehicleId: string) {
  await writeQueue.catch(() => undefined);
  const bookings = await readBookings();
  return bookings
    .filter((booking) => booking.vehicleId === vehicleId && booking.status === "confirmed")
    .map(({ startDate, endDate }) => ({ startDate, endDate }));
}

export async function listBookings() {
  await writeQueue.catch(() => undefined);
  const bookings = await readBookings();
  return bookings.sort((a, b) => a.startDate.localeCompare(b.startDate) || b.createdAt.localeCompare(a.createdAt));
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  let updated: Booking | null = null;
  const operation = writeQueue.catch(() => undefined).then(async () => {
    const bookings = await readBookings();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) throw new Error("BOOKING_NOT_FOUND");

    if (status === "confirmed") {
      const booking = bookings[index];
      const conflicts = bookings.some((item, itemIndex) => itemIndex !== index && item.vehicleId === booking.vehicleId && item.status === "confirmed" && item.startDate <= booking.endDate && item.endDate >= booking.startDate);
      if (conflicts) throw new Error("BOOKING_CONFLICT");
    }

    bookings[index] = { ...bookings[index], status };
    await saveBookings(bookings);
    updated = bookings[index];
  });
  writeQueue = operation.catch(() => undefined);
  await operation;
  return updated;
}

export async function deleteBooking(id: string) {
  const operation = writeQueue.catch(() => undefined).then(async () => {
    const bookings = await readBookings();
    const filtered = bookings.filter((booking) => booking.id !== id);
    if (filtered.length === bookings.length) throw new Error("BOOKING_NOT_FOUND");
    await saveBookings(filtered);
  });
  writeQueue = operation.catch(() => undefined);
  await operation;
}

async function saveBookings(bookings: Booking[]) {
  await writeJsonFile("bookings.json", bookings);
}

export async function createBooking(booking: Booking) {
  let result: Booking | null = null;

  const operation = writeQueue.catch(() => undefined).then(async () => {
    const bookings = await readBookings();
    const conflicts = bookings.some(
      (item) =>
        item.vehicleId === booking.vehicleId &&
        item.status === "confirmed" &&
        item.startDate <= booking.endDate &&
        item.endDate >= booking.startDate,
    );

    if (conflicts) throw new Error("BOOKING_CONFLICT");

    await saveBookings([...bookings, booking]);
    result = booking;
  });

  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}
