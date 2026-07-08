"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Booking } from "@/lib/bookings";
import type { FleetVehicle } from "@/lib/fleet";
import { AdminQuickBooking } from "@/components/admin-quick-booking";

const formatDate = (date: string) => new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`));

export function AdminDashboard({ initialBookings, initialVehicles }: { initialBookings: Booking[]; initialVehicles: FleetVehicle[] }) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const visibleBookings = useMemo(() => bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter || (filter === "upcoming" && booking.status === "confirmed" && booking.endDate >= today);
    const query = search.toLowerCase();
    return matchesFilter && (!query || `${booking.id} ${booking.customerName} ${booking.phone} ${booking.vehicleName}`.toLowerCase().includes(query));
  }), [bookings, filter, search, today]);

  const active = bookings.filter((booking) => booking.status === "confirmed" && booking.endDate >= today).length;
  const phone = bookings.filter((booking) => (booking.source || "online") === "phone").length;
  const online = bookings.filter((booking) => (booking.source || "online") === "online").length;

  async function refreshBookings() {
    const response = await fetch("/api/admin/bookings", { cache: "no-store" });
    if (response.status === 401) { router.replace("/admin/login"); return; }
    const result = (await response.json()) as { bookings: Booking[] };
    setBookings(result.bookings);
  }

  async function changeStatus(booking: Booking) {
    const status = booking.status === "confirmed" ? "cancelled" : "confirmed";
    setMessage("");
    const response = await fetch(`/api/admin/bookings/${booking.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) { setMessage(result.error || "Nie udało się zmienić statusu."); return; }
    await refreshBookings();
  }

  async function removeBooking(booking: Booking) {
    if (!window.confirm(`Usunąć rezerwację ${booking.id}? Tej operacji nie można cofnąć.`)) return;
    const response = await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
    if (response.ok) await refreshBookings();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return <main className="admin-shell">
    <header className="admin-header"><div><span>CZĘSTO<strong>BUSY</strong></span><small>Panel administratora</small></div><div><a href="/" target="_blank">Otwórz stronę</a><button onClick={logout} type="button">Wyloguj</button></div></header>
    <section className="admin-main">
      <div className="admin-title"><div><p>Rezerwacje</p><h1>Panel zarządzania</h1></div><div className="admin-title-actions"><button className="admin-primary" onClick={() => { setShowBookingForm(!showBookingForm); setMessage(""); }} type="button">{showBookingForm ? "Zamknij" : "+ Rezerwacja"}</button><Link className="admin-primary secondary" href="/admin/flota">Flota</Link></div></div>
      <div className="admin-stats"><article><span>Aktywne i przyszłe</span><strong>{active}</strong></article><article><span>Rezerwacje online</span><strong>{online}</strong></article><article><span>Rezerwacje telefoniczne</span><strong>{phone}</strong></article><article><span>Pojazdy we flocie</span><strong>{initialVehicles.length}</strong></article></div>

      {showBookingForm && <section className="admin-create quick-create"><div><p>Nowa rezerwacja</p><h2>Rezerwacja</h2><span>Wybierz auto i termin. Imię oraz telefon możesz uzupełnić opcjonalnie.</span></div><AdminQuickBooking bookings={bookings} vehicles={initialVehicles} onCreated={refreshBookings}/></section>}

      {message && <p className="admin-message" role="status">{message}</p>}
      <section className="admin-list"><div className="admin-toolbar"><div><h2>Wszystkie rezerwacje</h2><span>{visibleBookings.length} wyników</span></div><div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Szukaj klienta, telefonu, auta..."/><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Wszystkie</option><option value="upcoming">Aktywne i przyszłe</option><option value="confirmed">Potwierdzone</option><option value="cancelled">Anulowane</option></select></div></div>
        <div className="booking-table"><div className="booking-row booking-head"><span>Rezerwacja</span><span>Klient</span><span>Pojazd i termin</span><span>Kwota</span><span>Status</span><span>Akcje</span></div>{visibleBookings.map((booking) => <article className="booking-row" key={booking.id}><div data-label="Rezerwacja"><strong>{booking.id}</strong><small>{(booking.source || "online") === "phone" ? "Panel admina" : "Online"}</small></div><div data-label="Klient"><strong>{booking.customerName}</strong>{booking.phone && <a href={`tel:${booking.phone}`}>{booking.phone}</a>}{booking.email && <a href={`mailto:${booking.email}`}>{booking.email}</a>}</div><div data-label="Pojazd i termin"><strong>{booking.vehicleName}</strong><span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>{booking.notes && <small>{booking.notes}</small>}</div><div data-label="Kwota"><strong>{booking.totalPrice} zł</strong><small>{booking.totalDays} dni</small></div><div data-label="Status"><span className={`booking-status ${booking.status}`}>{booking.status === "confirmed" ? "Potwierdzona" : "Anulowana"}</span></div><div className="booking-actions" data-label="Akcje"><button onClick={() => changeStatus(booking)} type="button">{booking.status === "confirmed" ? "Anuluj" : "Przywróć"}</button><button className="danger" onClick={() => removeBooking(booking)} type="button">Usuń</button></div></article>)}{visibleBookings.length === 0 && <p className="admin-empty">Brak rezerwacji spełniających wybrane kryteria.</p>}</div>
      </section>
    </section>
  </main>;
}
