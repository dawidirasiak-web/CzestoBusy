"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Booking } from "@/lib/bookings";
import type { FleetVehicle } from "@/lib/fleet";

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function AdminQuickBooking({ bookings, vehicles, onCreated }: { bookings: Booking[]; vehicles: FleetVehicle[]; onCreated: () => Promise<void> }) {
  const [vehicleId, setVehicleId] = useState<string>(vehicles[0]?.id || "");
  const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const today = toIsoDate(new Date());
  const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const bookedRanges = useMemo(() => bookings.filter((booking) => booking.vehicleId === vehicleId && booking.status === "confirmed").map((booking) => ({ startDate: booking.startDate, endDate: booking.endDate })), [bookings, vehicleId]);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: offset + days }, (_, index) => index < offset ? null : new Date(month.getFullYear(), month.getMonth(), index - offset + 1));

  function selectDate(date: string) {
    setMessage("");
    if (!startDate || endDate || date < startDate) { setStartDate(date); setEndDate(""); return; }
    if (bookedRanges.some((range) => range.startDate <= date && range.endDate >= startDate)) { setMessage("Wybrany zakres obejmuje zajety termin."); return; }
    setEndDate(date);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startDate || !endDate) { setMessage("Wybierz pierwszy i ostatni dzien rezerwacji."); return; }
    setPending(true);
    setMessage("");
    const form = event.currentTarget;
    const payload = { ...Object.fromEntries(new FormData(form)), vehicleId, startDate, endDate };
    const response = await fetch("/api/admin/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) { setMessage(result.error || "Nie udalo sie zapisac rezerwacji."); setPending(false); return; }
    form.reset();
    setStartDate("");
    setEndDate("");
    setMessage("Rezerwacja zostala zapisana.");
    setPending(false);
    await onCreated();
  }

  return <form className="admin-quick-form" onSubmit={submit}>
    <div className="quick-fields">
      <label>Pojazd<select value={vehicleId} onChange={(event) => { setVehicleId(event.target.value); setStartDate(""); setEndDate(""); }}>{vehicles.map((vehicle) => <option value={vehicle.id} key={vehicle.id}>{vehicle.name}</option>)}</select></label>
      <label>Imie (opcjonalnie)<input name="customerName" autoComplete="name"/></label>
      <label>Telefon (opcjonalnie)<input name="phone" type="tel" autoComplete="tel"/></label>
      <label>Kwota razem (opcjonalnie)<input name="customTotalPrice" type="number" min="0" step="1" inputMode="numeric" placeholder="Np. 1200"/></label>
    </div>
    <div className="quick-calendar-header"><div><strong>Wybierz termin</strong><span>Kliknij dzien odbioru, potem dzien zwrotu</span></div><div><button disabled={month <= currentMonth} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} type="button">{"<"}</button><strong>{new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(month)}</strong><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} type="button">{">"}</button></div></div>
    <div className="quick-weekdays">{["Pn", "Wt", "Sr", "Cz", "Pt", "So", "Nd"].map((day) => <span key={day}>{day}</span>)}</div>
    <div className="quick-days">{cells.map((date, index) => {
      if (!date) return <span key={`empty-${index}`}/>;
      const iso = toIsoDate(date);
      const booked = bookedRanges.some((range) => range.startDate <= iso && range.endDate >= iso);
      const selected = iso === startDate || iso === endDate;
      const inRange = Boolean(startDate && endDate && iso > startDate && iso < endDate);
      return <button className={`${booked ? "booked" : ""} ${selected ? "selected" : ""} ${inRange ? "in-range" : ""}`} disabled={booked || iso < today} key={iso} onClick={() => selectDate(iso)} type="button"><span>{date.getDate()}</span></button>;
    })}</div>
    <div className="quick-summary"><div><small>Od</small><strong>{startDate || "Wybierz dzien"}</strong></div><span>{"->"}</span><div><small>Do</small><strong>{endDate || "Wybierz dzien"}</strong></div></div>
    {message && <p className="quick-message" role="status">{message}</p>}
    <button className="admin-primary quick-submit" disabled={pending} type="submit">{pending ? "Zapisywanie..." : "Zapisz rezerwacje"}</button>
  </form>;
}
