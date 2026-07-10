"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { FleetVehicle } from "@/lib/fleet";

type BookedRange = { startDate: string; endDate: string };
type Confirmation = { id: string; vehicleName: string; totalDays: number; totalPrice: number; warning?: string };

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CalendarMonth({ month, bookedRanges, startDate, endDate, onSelect }: { month: Date; bookedRanges: BookedRange[]; startDate: string; endDate: string; onSelect: (date: string) => void }) {
  const monthName = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(month);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = toIsoDate(new Date());
  const cells = Array.from({ length: offset + daysInMonth }, (_, index) => index < offset ? null : new Date(month.getFullYear(), month.getMonth(), index - offset + 1));

  return (
    <div className="calendar-month">
      <h4>{monthName}</h4>
      <div className="weekdays">{["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-days">
        {cells.map((date, index) => {
          if (!date) return <span className="empty-day" key={`empty-${index}`} />;
          const iso = toIsoDate(date);
          const booked = bookedRanges.some((range) => range.startDate <= iso && range.endDate >= iso);
          const past = iso < today;
          const selected = iso === startDate || iso === endDate;
          const inRange = Boolean(startDate && endDate && iso > startDate && iso < endDate);
          return <button aria-label={`${iso}${booked ? ", termin zajęty" : ""}`} className={`${booked ? "booked" : ""} ${selected ? "selected" : ""} ${inRange ? "in-range" : ""}`} disabled={booked || past} key={iso} onClick={() => onSelect(iso)} type="button"><span>{date.getDate()}</span>{booked && <i />}</button>;
        })}
      </div>
    </div>
  );
}

export function ReservationForm({ vehicle, bookedRanges }: { vehicle: FleetVehicle; bookedRanges: BookedRange[] }) {
  const [visibleMonth, setVisibleMonth] = useState(() => { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), 1); });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const estimate = useMemo(() => {
    if (!vehicle || !startDate || !endDate) return null;
    const days = Math.max(1, Math.ceil((Date.parse(endDate) - Date.parse(startDate)) / 86_400_000) + 1);
    return { days, price: days * vehicle.dailyPrice };
  }, [vehicle, startDate, endDate]);

  function selectDate(date: string) {
    setError("");
    if (!startDate || endDate || date < startDate) {
      setStartDate(date);
      setEndDate("");
      return;
    }
    const crossesBooking = bookedRanges.some((range) => range.startDate <= date && range.endDate >= startDate);
    if (crossesBooking) {
      setError("Wybrany zakres obejmuje zajęty termin. Wybierz inny przedział dat.");
      return;
    }
    setEndDate(date);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startDate || !endDate) { setError("Wybierz na kalendarzu dzień odbioru i dzień zwrotu."); return; }
    setPending(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = (await response.json()) as { booking?: Confirmation; error?: string; warning?: string };
      if (!response.ok || !result.booking) throw new Error(result.error || "Nie udało się utworzyć rezerwacji.");
      setConfirmation({ ...result.booking, warning: result.warning });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Nie udało się utworzyć rezerwacji.");
    } finally {
      setPending(false);
    }
  }

  if (confirmation) {
    return <div className="reservation-success" role="status"><span>✓</span><p className="eyebrow">Rezerwacja potwierdzona</p><h3>Dziękujemy!</h3><p>Twój numer rezerwacji:</p><strong>{confirmation.id}</strong><dl><div><dt>Pojazd</dt><dd>{confirmation.vehicleName}</dd></div><div><dt>Liczba dni</dt><dd>{confirmation.totalDays}</dd></div><div><dt>Razem</dt><dd>{confirmation.totalPrice} zł</dd></div></dl><p className="success-note">{confirmation.warning || "Potwierdzenie wysłaliśmy na podany adres e-mail. Skontaktujemy się z Tobą, aby ustalić szczegóły odbioru."}</p></div>;
  }

  const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  return (
    <form className="reservation-form vehicle-booking-form" onSubmit={handleSubmit}>
      <input name="vehicleId" type="hidden" value={vehicle.id} /><input name="startDate" type="hidden" value={startDate} /><input name="endDate" type="hidden" value={endDate} />
      <div className="form-step"><span>01</span><div><h3>Wybierz termin</h3><p>Kliknij dzień odbioru, a następnie dzień zwrotu.</p></div></div>
      <div className="calendar-toolbar"><div><span className="legend-free"><i/>Dostępny</span><span className="legend-booked"><i/>Zajęty</span><span className="legend-selected"><i/>Twój termin</span></div><div><button disabled={visibleMonth <= currentMonth} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} type="button" aria-label="Poprzedni miesiąc">←</button><button onClick={() => setVisibleMonth(nextMonth)} type="button" aria-label="Następny miesiąc">→</button></div></div>
      <div className="availability-calendar"><CalendarMonth month={visibleMonth} bookedRanges={bookedRanges} startDate={startDate} endDate={endDate} onSelect={selectDate}/><CalendarMonth month={nextMonth} bookedRanges={bookedRanges} startDate={startDate} endDate={endDate} onSelect={selectDate}/></div>
      <div className="selected-dates"><div><small>Odbiór</small><strong>{startDate || "Wybierz datę"}</strong></div><span>→</span><div><small>Zwrot</small><strong>{endDate || "Wybierz datę"}</strong></div></div>

      <div className="form-step"><span>02</span><div><h3>Godziny i dane</h3><p>Uzupełnij dane potrzebne do potwierdzenia rezerwacji.</p></div></div>
      <div className="booking-fields"><label>Godzina odbioru<input required type="time" name="pickupTime" defaultValue="09:00" /></label><label>Godzina zwrotu<input required type="time" name="returnTime" defaultValue="09:00" /></label><label>Imię i nazwisko<input required name="customerName" autoComplete="name" placeholder="Jan Kowalski" minLength={3} /></label><label>Numer telefonu<input required type="tel" name="phone" autoComplete="tel" placeholder="+48 000 000 000" pattern="[+0-9][0-9 -]{7,17}" /></label><label>Adres e-mail<input required type="email" name="email" autoComplete="email" placeholder="jan@example.com" /></label><label>Uwagi (opcjonalnie)<input name="notes" placeholder="Np. wyjazd zagraniczny" maxLength={1000} /></label></div>
      <label className="consent"><input required type="checkbox" /><span>Akceptuję regulamin wynajmu i wyrażam zgodę na kontakt w sprawie rezerwacji.</span></label>
      {error && <p className="reservation-error" role="alert">{error}</p>}
      <div className="reservation-submit"><div>{estimate ? <><small>Szacunkowa cena za {estimate.days} {estimate.days === 1 ? "dzień" : "dni"}</small><strong>{estimate.price} zł</strong></> : <small>Wybierz pełny termin, aby poznać cenę</small>}<span>Ostateczna kwota zależy od warunków wynajmu.</span></div><button className="button button-primary" disabled={pending} type="submit">{pending ? "Sprawdzamy termin..." : "Potwierdzam rezerwację"}</button></div>
    </form>
  );
}
