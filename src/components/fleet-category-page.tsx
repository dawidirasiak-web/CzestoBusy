import Image from "next/image";
import Link from "next/link";
import { listFleet } from "@/lib/fleet";
import { SiteLogo } from "@/components/site-logo";

const ArrowIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>;

type Category = "osobowe" | "dostawcze";

const content = {
  osobowe: {
    label: "Podróżuj razem",
    title: <>Busy 9-osobowe<br/><em>i auta osobowe</em></>,
    description: "Busy dla większej grupy oraz wygodne samochody osobowe na rodzinny wyjazd, delegację lub wspólną podróż.",
    benefits: ["Do 9 osób", "Klimatyzacja", "Komfortowe wnętrze"],
  },
  dostawcze: {
    label: "Przewieź więcej",
    title: <>Busy<br/><em>dostawcze</em></>,
    description: "Pojemne pojazdy do przeprowadzki, transportu towaru i codziennej pracy. Różne typy zabudowy i długości najmu.",
    benefits: ["Duża przestrzeń", "Łatwy załadunek", "Elastyczny wynajem"],
  },
};

export async function FleetCategoryPage({ category }: { category: Category }) {
  const fleet = await listFleet();
  const vehicles = fleet.filter((vehicle) => vehicle.category === category);
  const page = content[category];

  return (
    <main className="category-page">
      <header className="site-header header-clean"><SiteLogo/><nav aria-label="Nawigacja główna"><Link href="/#flota">Flota</Link><Link href="/#dlaczego-my">Dlaczego my</Link><a href="tel:+48883066661">Kontakt</a></nav></header>

      <section className="category-hero"><div><Link className="back-link" href="/#oferta">← Wróć do oferty</Link><p className="eyebrow"><span/> {page.label}</p><h1>{page.title}</h1><p>{page.description}</p></div><div className="category-benefits">{page.benefits.map((benefit, index) => <div key={benefit}><span>0{index + 1}</span><strong>{benefit}</strong></div>)}</div></section>

      <section className="category-fleet section"><div className="section-heading"><div><p className="eyebrow"><span/> Dostępne pojazdy</p><h2>Wybierz<br/><em>swój model</em></h2></div><p>Kliknij wybrany samochód, aby zobaczyć pełną galerię, sprawdzić kalendarz i dokonać rezerwacji.</p></div><div className="fleet-grid">{vehicles.map((car, index) => <article className="fleet-card" key={car.id}><div className={`fleet-visual ${car.tone} ${car.images.length ? "has-photo" : ""}`}>{car.images.length ? <Image className="fleet-photo" src={car.images[0]} alt={car.name} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"/> : <div className="vehicle-silhouette"><i/><b/><b/></div>}<span className="fleet-index">0{index + 1}</span><span className="fleet-type">{car.type}</span></div><div className="fleet-content"><div><p>Rok produkcji {car.year}</p><h3>{car.name}</h3></div><ul>{car.features.slice(0, 2).map((feature) => <li key={feature}><CheckIcon/>{feature}</li>)}</ul><div className="fleet-bottom"><p><small>Cena od</small><strong>{car.dailyPrice} zł</strong><span>/ doba</span></p><Link href={`/flota/${car.id}`} aria-label={`Zobacz i zarezerwuj ${car.name}`}><ArrowIcon/></Link></div></div></article>)}</div></section>

      <footer><Link className="brand footer-brand" href="/"><span>CZĘSTO</span><strong>BUSY</strong></Link><nav className="footer-links" aria-label="Dokumenty"><Link href="/regulamin">Regulamin</Link><Link href="/polityka-prywatnosci">Polityka prywatności</Link><Link href="/faq">FAQ</Link></nav><p>© 2026 CzęstoBusy</p></footer>
    </main>
  );
}
