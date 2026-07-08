import Link from "next/link";
import Image from "next/image";
import { ScrollVan } from "@/components/scroll-van";
import { FleetReveal } from "@/components/fleet-reveal";
import { SiteLogo } from "@/components/site-logo";
import { listFleet } from "@/lib/fleet";

export const dynamic = "force-dynamic";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
);

const JasnaGoraOutline = () => (
  <svg className="jasna-gora-outline" viewBox="0 0 720 520" role="img" aria-label="Nowoczesny kontur panoramy Jasnej Góry">
    <path className="landmark-halo" d="M78 410C136 410 158 400 205 400H272L288 378L304 400H340L350 369L367 390L382 376L393 398H423L431 355L441 345L446 306L455 296L458 250L468 238L472 177L479 164L485 108L492 91L498 108L504 164L511 177L515 238L525 250L528 296L537 306L542 345L552 355L560 398H584L598 380L612 398L626 376L640 398H680" />
    <path className="landmark-main" d="M30 418L88 404L138 407L168 391L198 407H266L287 369L307 403L338 403L348 360L367 382L382 365L397 398H426L430 347L441 337L445 297L454 287L457 244L467 231L470 170L478 158L483 103L490 86L496 103L501 158L509 170L512 231L522 244L525 287L534 297L538 337L549 347L554 398H582L598 372L613 397L628 368L642 396L658 377L690 404" />
    <path className="landmark-cross" d="M490 86V45M475 58H505" />
    <path className="landmark-base" d="M94 438H666" />
    <text x="360" y="480" textAnchor="middle">JASNA GÓRA · CZĘSTOCHOWA</text>
  </svg>
);

const VanIllustration = () => (
  <div className="van-photo-stage">
    <Image
      className="van-photo"
      src="/images/hero-van-real.png"
      alt="Realistyczny biały bus 9-osobowy widziany z boku"
      width={1859}
      height={846}
      priority
    />
    <Image className="van-wheel van-wheel-rear" src="/images/hero-van-wheel-rear.png" alt="" width={256} height={256} aria-hidden="true" />
    <Image className="van-wheel van-wheel-front" src="/images/hero-van-wheel-front.png" alt="" width={256} height={256} aria-hidden="true" />
  </div>
);

const features = [
  ["01", "Szybka rezerwacja", "Jeden telefon wystarczy, aby sprawdzić termin i zarezerwować wybrany pojazd."],
  ["02", "Jasne warunki", "Bez ukrytych opłat. Wszystkie zasady wynajmu poznajesz jeszcze przed odbiorem."],
  ["03", "Sprawne samochody", "Regularnie serwisowana i przygotowana flota, gotowa na krótkie i długie trasy."],
];

export default async function Home() {
  const fleet = await listFleet();

  return (
    <main id="top">
      <header className="site-header header-clean">
        <SiteLogo href="/#top" />
        <nav aria-label="Nawigacja główna">
          <a href="#flota">Flota</a><a href="#dlaczego-my">Dlaczego my</a><a href="tel:+48883066661">Kontakt</a>
        </nav>
      </header>

      <section className="hero" id="start">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Częstochowa i okolice</p>
          <h1>Dużo miejsca.<br/><em>Jeszcze więcej</em><br/>możliwości.</h1>
          <p className="hero-lead">Busy 9-osobowe i dostawcze na wyjazd, przeprowadzkę albo firmowe zlecenie. Prosto, szybko i bez zbędnych formalności.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#flota">Zobacz naszą flotę <ArrowIcon /></a>
          </div>
          <div className="hero-trust"><div><strong>9</strong><span>miejsc<br/>dla pasażerów</span></div><div><strong>24/7</strong><span>pomoc<br/>w trasie</span></div><div><strong>0</strong><span>ukrytych<br/>kosztów</span></div></div>
        </div>
        <div className="hero-visual">
          <JasnaGoraOutline />
          <ScrollVan><VanIllustration /></ScrollVan>
          <a className="availability availability-phone" href="tel:+48883066661"><span className="pulse"/><div><small>Dostępność · zadzwoń teraz</small><strong>883 066 661</strong></div></a>
          <p className="vertical-label">CZĘSTO BUSY · WYNAJEM ·</p>
        </div>
      </section>

      <section className="fleet section" id="flota">
        <div className="section-heading"><div><p className="eyebrow"><span /> Poznaj samochody</p><h2>Nasza<br/><em>flota</em></h2></div><p>Nowe, zadbane i regularnie serwisowane pojazdy. Wybierz model dopasowany do liczby pasażerów albo wielkości ładunku.</p></div>
        <FleetReveal>
          {fleet.map((car, index) => (
            <article className="fleet-card" id={car.id === "chery-tiggo-7" ? "flota-osobowe" : car.id === "toyota-proace-max" ? "flota-dostawcze" : undefined} key={car.name}>
              <div className={`fleet-visual ${car.tone} ${car.images.length ? "has-photo" : ""}`}>{car.images.length ? <Image className="fleet-photo" src={car.images[0]} alt={car.name} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" /> : <div className="vehicle-silhouette"><i/><b/><b/></div>}<span className="fleet-index">0{index + 1}</span><span className="fleet-type">{car.type}</span></div>
              <div className="fleet-content"><div><p>Rok produkcji {car.year}</p><h3>{car.name}</h3></div><ul>{car.features.slice(0, 2).map((feature) => <li key={feature}><CheckIcon/>{feature}</li>)}</ul><div className="fleet-bottom"><p><small>Cena od</small><strong>{car.dailyPrice} zł</strong><span>/ doba</span></p><a href={`/flota/${car.id}`} aria-label={`Zobacz i zarezerwuj ${car.name}`}><ArrowIcon/></a></div></div>
            </article>
          ))}
        </FleetReveal>
      </section>

      <section className="offer section" id="oferta">
        <div className="section-heading"><div><p className="eyebrow"><span /> Nasza oferta</p><h2>Wybierz busa<br/><em>do swojego planu</em></h2></div><p>Potrzebujesz wygodnego transportu dla grupy czy dużej przestrzeni ładunkowej? Mamy właściwy samochód.</p></div>
        <div className="vehicle-grid">
          <Link className="vehicle-card passenger" href="/flota/osobowe"><span className="card-number">01</span><div className="card-icon">9</div><p>Podróżuj razem</p><h3>Busy 9-osobowe i auta osobowe</h3><ul><li><CheckIcon/>Klimatyzacja</li><li><CheckIcon/>Wygodne fotele</li><li><CheckIcon/>Duży bagażnik</li></ul><span className="category-link">Zobacz busy i auta osobowe <ArrowIcon/></span></Link>
          <Link className="vehicle-card cargo" href="/flota/dostawcze"><span className="card-number">02</span><div className="cargo-shape"><span/></div><p>Przewieź więcej</p><h3>Busy dostawcze</h3><ul><li><CheckIcon/>Pojemna paka</li><li><CheckIcon/>Łatwy załadunek</li><li><CheckIcon/>Różne długości najmu</li></ul><span className="category-link">Zobacz auta dostawcze <ArrowIcon/></span></Link>
        </div>
      </section>

      <section className="why section" id="dlaczego-my">
        <div className="why-intro"><p className="eyebrow light"><span /> Bez komplikacji</p><h2>Wynajem, który<br/><em>po prostu działa.</em></h2><p>Szanujemy Twój czas. Dlatego cały proces jest krótki, przejrzysty i skupiony na tym, czego naprawdę potrzebujesz.</p></div>
        <div className="feature-list">{features.map(([number,title,text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <footer><Link className="brand footer-brand" href="/#top"><span>CZĘSTO</span><strong>BUSY</strong></Link><nav className="footer-links" aria-label="Dokumenty"><Link href="/regulamin">Regulamin</Link><Link href="/polityka-prywatnosci">Polityka prywatności</Link><Link href="/faq">FAQ</Link></nav><p>© 2026 CzęstoBusy</p></footer>
    </main>
  );
}
