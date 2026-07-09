import type { Metadata } from "next";
import Link from "next/link";
import { HeaderSocials } from "@/components/header-socials";
import { SiteFooter } from "@/components/site-footer";
import { SiteLogo } from "@/components/site-logo";

export const metadata: Metadata = {
  title: "Regulamin wynajmu | CzęstoBusy",
  description: "Regulamin wynajmu pojazdów CzęstoBusy.",
};

const sections = [
  {
    title: "Postanowienia ogólne",
    content: <><p>Regulamin określa zasady wynajmu pojazdów oferowanych przez CzęstoBusy.</p><p>Wynajem pojazdu oznacza akceptację niniejszego regulaminu.</p><p>Wynajmujący oświadcza, że pojazdy posiadają aktualne badania techniczne oraz wymagane ubezpieczenia.</p></>,
  },
  {
    title: "Warunki wynajmu",
    content: <><p>Najemca zobowiązany jest:</p><ul><li>posiadać ważne prawo jazdy odpowiedniej kategorii,</li><li>mieć ukończone minimum 23 lata,</li><li>posiadać prawo jazdy od minimum 2 lat.</li></ul><p>Wynajmujący ma prawo odmówić wynajmu bez podania przyczyny.</p></>,
  },
  {
    title: "Rezerwacja i płatność",
    content: <><p>Rezerwacja pojazdu następuje telefonicznie, mailowo lub poprzez formularz kontaktowy.</p><p>Warunkiem wydania pojazdu jest:</p><ul><li>podpisanie umowy najmu,</li><li>okazanie wymaganych dokumentów,</li><li>dokonanie płatności za wynajem,</li><li>wpłata kaucji.</li></ul><p>Płatność za najem oraz kaucja pobierane są przed wydaniem pojazdu.</p><p>Wysokość kaucji ustalana jest indywidualnie.</p></>,
  },
  {
    title: "Użytkowanie pojazdu",
    content: <><p>Najemca zobowiązuje się do użytkowania pojazdu zgodnie z jego przeznaczeniem oraz zachowania należytej staranności.</p><p>Pojazdem mogą kierować wyłącznie osoby wskazane w umowie najmu.</p><p>Zabrania się:</p><ul><li>prowadzenia pojazdu pod wpływem alkoholu lub środków odurzających,</li><li>przekazywania pojazdu osobom trzecim bez zgody Wynajmującego,</li><li>udziału w wyścigach lub rajdach,</li><li>przewozu materiałów niebezpiecznych,</li><li>palenia tytoniu oraz e-papierosów w pojeździe,</li><li>używania pojazdu niezgodnie z przeznaczeniem.</li></ul><p>Wyjazd poza granice Polski wymaga wcześniejszej zgody Wynajmującego.</p></>,
  },
  {
    title: "GPS i monitoring",
    content: <><p>Wynajmujący zastrzega sobie prawo do monitorowania pojazdów za pomocą systemu GPS.</p><p>Najemca wyraża zgodę na monitoring lokalizacji pojazdu w czasie trwania najmu.</p></>,
  },
  {
    title: "Awarie, kolizje i szkody",
    content: <><p>W przypadku awarii, kolizji lub wypadku Najemca zobowiązany jest:</p><ul><li>niezwłocznie poinformować Wynajmującego,</li><li>zabezpieczyć pojazd,</li><li>wezwać Policję w przypadku kolizji lub wypadku,</li><li>sporządzić dokumentację zdarzenia.</li></ul><p>Zabrania się samodzielnego wykonywania napraw bez zgody Wynajmującego.</p><p>Najemca ponosi odpowiedzialność finansową za szkody powstałe z jego winy.</p><p>W przypadku szkody spowodowanej:</p><ul><li>prowadzeniem pod wpływem alkoholu,</li><li>rażącym naruszeniem przepisów,</li><li>użytkowaniem pojazdu niezgodnie z regulaminem,</li></ul><p>Najemca ponosi pełną odpowiedzialność za wszelkie koszty związane ze szkodą.</p></>,
  },
  {
    title: "Zwrot pojazdu",
    content: <><p>Najemca zobowiązany jest zwrócić pojazd:</p><ul><li>w ustalonym terminie,</li><li>w stanie niepogorszonym,</li><li>z takim samym poziomem paliwa,</li><li>z kompletnym wyposażeniem.</li></ul><p>Zwrot pojazdu po terminie bez wcześniejszego uzgodnienia może skutkować naliczeniem dodatkowych opłat.</p><p>W przypadku nadmiernego zabrudzenia pojazdu Wynajmujący może naliczyć opłatę za czyszczenie.</p><p>W przypadku naruszenia regulaminu mogą zostać naliczone dodatkowe opłaty zgodnie z <a href="https://czestobusy.pl/tabela-oplat/" rel="noreferrer" target="_blank">tabelą opłat</a>.</p></>,
  },
  {
    title: "Limity kilometrów",
    content: <><p>Dobowy limit kilometrów ustalany jest indywidualnie w umowie najmu.</p><p>Po przekroczeniu limitu Najemca zobowiązany jest do dopłaty zgodnie z obowiązującym cennikiem.</p></>,
  },
  {
    title: "Odpowiedzialność za opłaty",
    content: <><p>Najemca ponosi odpowiedzialność za:</p><ul><li>mandaty,</li><li>opłaty parkingowe,</li><li>opłaty drogowe,</li><li>inne należności powstałe podczas użytkowania pojazdu.</li></ul></>,
  },
  {
    title: "Dane osobowe",
    content: <><p>Dane osobowe przetwarzane są zgodnie z obowiązującymi przepisami prawa oraz <Link href="/polityka-prywatnosci">Polityką Prywatności</Link> dostępną na stronie internetowej.</p><p>Dane wykorzystywane są wyłącznie w celu realizacji umowy najmu oraz kontaktu z klientem.</p></>,
  },
  {
    title: "Postanowienia końcowe",
    content: <><p>W sprawach nieuregulowanych zastosowanie mają przepisy Kodeksu cywilnego.</p><p>Wszelkie spory rozstrzygane będą przez sąd właściwy dla siedziby Wynajmującego.</p><p>Wynajmujący zastrzega sobie prawo do zmiany regulaminu.</p></>,
  },
];

export default function TermsPage() {
  return (
    <main className="legal-page">
      <header className="site-header header-clean">
        <SiteLogo />
        <nav aria-label="Nawigacja główna"><Link href="/#flota">Flota</Link><Link href="/#dlaczego-my">Dlaczego my</Link><a href="tel:+48883066661">Kontakt</a></nav>
        <HeaderSocials />
      </header>

      <section className="legal-hero"><Link href="/">← Wróć na stronę główną</Link><p className="eyebrow"><span/> Dokumenty</p><h1>Regulamin<br/><em>CzęstoBusy</em></h1><p>Zasady rezerwacji, wynajmu, użytkowania oraz zwrotu pojazdów.</p></section>

      <article className="legal-content terms-content">
        {sections.map((section, index) => <section key={section.title}><span>§{index + 1}</span><div><h2>{section.title}</h2>{section.content}</div></section>)}
      </article>

      <SiteFooter />
    </main>
  );
}
