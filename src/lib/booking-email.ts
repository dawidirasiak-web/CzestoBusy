import nodemailer from "nodemailer";
import type { Booking } from "@/lib/bookings";

const ownerEmail = process.env.BOOKING_NOTIFICATION_EMAIL || "kontakt@czestobusy.pl";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

function bookingDetails(booking: Booking) {
  const notes = booking.notes ? `<tr><td style="padding:6px 12px 6px 0;color:#666">Uwagi</td><td style="padding:6px 0">${escapeHtml(booking.notes)}</td></tr>` : "";
  return `<table style="border-collapse:collapse;font:14px Arial,sans-serif;color:#111">
    <tr><td style="padding:6px 12px 6px 0;color:#666">Numer</td><td style="padding:6px 0"><strong>${escapeHtml(booking.id)}</strong></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Pojazd</td><td style="padding:6px 0">${escapeHtml(booking.vehicleName)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Odbiór</td><td style="padding:6px 0">${booking.startDate}, ${booking.pickupTime}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Zwrot</td><td style="padding:6px 0">${booking.endDate}, ${booking.returnTime}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Cena szacunkowa</td><td style="padding:6px 0"><strong>${booking.totalPrice} zł</strong></td></tr>${notes}
  </table>`;
}

export function isBookingEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export async function sendBookingEmails(booking: Booking) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT || "465");
  if (!host || !user || !pass || !Number.isInteger(port)) throw new Error("SMTP_NOT_CONFIGURED");

  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  const from = `CzęstoBusy <${user}>`;
  const details = bookingDetails(booking);

  await Promise.all([
    transporter.sendMail({
      from, to: ownerEmail, replyTo: booking.email,
      subject: `Nowa rezerwacja ${booking.id} — ${booking.vehicleName}`,
      text: `Nowa rezerwacja ${booking.id}\nKlient: ${booking.customerName}\nE-mail: ${booking.email}\nTelefon: ${booking.phone}\nPojazd: ${booking.vehicleName}\nOdbiór: ${booking.startDate}, ${booking.pickupTime}\nZwrot: ${booking.endDate}, ${booking.returnTime}\nCena szacunkowa: ${booking.totalPrice} zł\nUwagi: ${booking.notes || "brak"}`,
      html: `<div style="font:14px Arial,sans-serif;color:#111"><h1>Nowa rezerwacja</h1>${details}<h2>Dane klienta</h2><p>${escapeHtml(booking.customerName)}<br>${escapeHtml(booking.email)}<br>${escapeHtml(booking.phone)}</p></div>`,
    }),
    transporter.sendMail({
      from, to: booking.email, replyTo: ownerEmail,
      subject: `Potwierdzenie rezerwacji ${booking.id} — CzęstoBusy`,
      text: `Dziękujemy za rezerwację w CzęstoBusy.\nNumer: ${booking.id}\nPojazd: ${booking.vehicleName}\nOdbiór: ${booking.startDate}, ${booking.pickupTime}\nZwrot: ${booking.endDate}, ${booking.returnTime}\nCena szacunkowa: ${booking.totalPrice} zł\n\nSkontaktujemy się z Tobą, aby ustalić szczegóły odbioru.`,
      html: `<div style="font:14px Arial,sans-serif;color:#111"><h1>Rezerwacja potwierdzona</h1><p>Dzień dobry ${escapeHtml(booking.customerName)},</p><p>dziękujemy za rezerwację w CzęstoBusy.</p>${details}<p>Skontaktujemy się z Tobą, aby ustalić szczegóły odbioru.</p><p><strong>CzęstoBusy</strong><br>883 066 661<br>${ownerEmail}</p></div>`,
    }),
  ]);
}
