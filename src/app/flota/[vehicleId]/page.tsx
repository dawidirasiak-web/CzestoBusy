import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReservationForm } from "@/components/reservation-form";
import { HeaderSocials } from "@/components/header-socials";
import { SiteFooter } from "@/components/site-footer";
import { SiteLogo } from "@/components/site-logo";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { getBookedRanges } from "@/lib/bookings";
import { findVehicle, listFleet } from "@/lib/fleet";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ vehicleId: string }> };

export async function generateStaticParams() {
  const fleet = await listFleet();
  return fleet.map((vehicle) => ({ vehicleId: vehicle.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vehicleId } = await params;
  const vehicle = await findVehicle(vehicleId);
  return vehicle ? { title: `${vehicle.name} | Rezerwacja CzęstoBusy`, description: `Sprawdź dostępność i zarezerwuj ${vehicle.name} online.` } : {};
}

export default async function VehiclePage({ params }: PageProps) {
  const { vehicleId } = await params;
  const vehicle = await findVehicle(vehicleId);
  if (!vehicle) notFound();
  const bookedRanges = await getBookedRanges(vehicle.id);

  return (
    <main className="vehicle-page">
      <header className="site-header vehicle-header header-clean">
        <SiteLogo />
        <nav aria-label="Nawigacja główna"><Link href="/#flota">Flota</Link><a href="#kalendarz">Kalendarz</a><Link href="/#kontakt">Kontakt</Link></nav>
        <HeaderSocials />
      </header>

      <section className="vehicle-hero">
        <div className="vehicle-hero-copy"><Link className="back-link" href="/#flota">← Wróć do floty</Link><p className="eyebrow"><span/> {vehicle.type} · rocznik {vehicle.year}</p><h1>{vehicle.name}</h1><p>{vehicle.description}</p><div className="vehicle-price"><small>Cena wynajmu od</small><strong>{vehicle.dailyPrice} zł</strong><span>/ doba</span></div><a className="button button-primary" href="#kalendarz">Sprawdź dostępność ↓</a></div>
        <VehicleGallery images={vehicle.images} name={vehicle.name} type={vehicle.type} tone={vehicle.tone}/>
      </section>

      <section className="vehicle-benefits">{vehicle.features.slice(0, 3).map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><strong>{feature}</strong><small>{index === 0 ? "Atut wybranego pojazdu" : "Informacja o wyposażeniu i wynajmie"}</small></div>)}</section>

      <section className="vehicle-reservation section" id="kalendarz"><div className="reservation-heading"><p className="eyebrow"><span/> Kalendarz rezerwacji</p><h2>Wybierz wolny<br/><em>termin.</em></h2><p>Czerwone dni są już zajęte. Wybierz pierwszy i ostatni dzień wynajmu, a następnie uzupełnij dane.</p></div><ReservationForm vehicle={vehicle} bookedRanges={bookedRanges}/></section>

      <SiteFooter />
    </main>
  );
}
