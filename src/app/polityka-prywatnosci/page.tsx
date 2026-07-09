import type { Metadata } from "next";
import Link from "next/link";
import { HeaderSocials } from "@/components/header-socials";
import { SiteFooter } from "@/components/site-footer";
import { SiteLogo } from "@/components/site-logo";

export const metadata: Metadata = {
  title: "Polityka prywatności | CzęstoBusy",
  description: "Polityka prywatności i plików cookies serwisu CzęstoBusy.",
};

const sections = [
  {
    title: "Informacje ogólne",
    content: <><p>Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych oraz wykorzystywania plików cookies w związku z korzystaniem ze strony internetowej CzęstoBusy.</p><p>Administratorem danych osobowych jest:</p><address><strong>CzęstoBusy</strong><br/>Częstochowa<br/>E-mail: <a href="mailto:kontakt@czestobusy.pl">kontakt@czestobusy.pl</a><br/>Telefon: <a href="tel:+48883066661">883 066 661</a></address></>,
  },
  {
    title: "Zakres zbieranych danych",
    content: <><p>Podczas korzystania ze strony mogą być zbierane następujące dane:</p><ul><li>imię i nazwisko,</li><li>numer telefonu,</li><li>adres e-mail,</li><li>adres IP,</li><li>dane przesyłane przez formularz rezerwacji.</li></ul><p>Podanie danych jest dobrowolne, jednak może być niezbędne do kontaktu lub realizacji usługi.</p></>,
  },
  {
    title: "Cel przetwarzania danych",
    content: <><p>Dane osobowe przetwarzane są w celu:</p><ul><li>kontaktu z klientem,</li><li>realizacji rezerwacji i wynajmu pojazdów,</li><li>obsługi zapytań,</li><li>wystawiania dokumentów księgowych,</li><li>poprawy działania strony internetowej.</li></ul></>,
  },
  {
    title: "Podstawa prawna przetwarzania danych",
    content: <><p>Dane przetwarzane są zgodnie z:</p><ul><li>art. 6 ust. 1 lit. b RODO - realizacja umowy,</li><li>art. 6 ust. 1 lit. f RODO - uzasadniony interes administratora,</li><li>art. 6 ust. 1 lit. a RODO - zgoda użytkownika.</li></ul></>,
  },
  {
    title: "Udostępnianie danych",
    content: <><p>Dane mogą być przekazywane podmiotom współpracującym z Administratorem wyłącznie w zakresie niezbędnym do realizacji usług, np.:</p><ul><li>księgowości,</li><li>hostingowi strony,</li><li>operatorom poczty e-mail.</li></ul><p>Administrator nie sprzedaje danych osobowych osobom trzecim.</p></>,
  },
  {
    title: "Okres przechowywania danych",
    content: <><p>Dane przechowywane są:</p><ul><li>przez okres realizacji usługi,</li><li>przez czas wymagany przepisami prawa,</li><li>do momentu cofnięcia zgody lub wniesienia sprzeciwu.</li></ul></>,
  },
  {
    title: "Prawa użytkownika",
    content: <><p>Każda osoba ma prawo do:</p><ul><li>dostępu do swoich danych,</li><li>poprawiania danych,</li><li>usunięcia danych,</li><li>ograniczenia przetwarzania,</li><li>wniesienia sprzeciwu,</li><li>wniesienia skargi do Prezesa UODO.</li></ul></>,
  },
  {
    title: "Pliki cookies",
    content: <><p>Strona korzysta z plików cookies w celu:</p><ul><li>prawidłowego działania strony,</li><li>analizy ruchu na stronie,</li><li>poprawy jakości usług.</li></ul><p>Cookies mogą być wykorzystywane przez:</p><ul><li>Google Analytics,</li><li>narzędzia reklamowe Google,</li><li>Facebook Pixel (jeśli zostanie wdrożony).</li></ul><p>Użytkownik może zarządzać plikami cookies poprzez ustawienia swojej przeglądarki internetowej.</p></>,
  },
  {
    title: "Zabezpieczenie danych",
    content: <p>Administrator stosuje odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych przed utratą, nieuprawnionym dostępem lub modyfikacją.</p>,
  },
  {
    title: "Zmiany polityki prywatności",
    content: <><p>Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności.</p><p>Aktualna wersja dokumentu publikowana jest na stronie internetowej.</p></>,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <header className="site-header header-clean">
        <SiteLogo />
        <nav aria-label="Nawigacja główna"><Link href="/#flota">Flota</Link><Link href="/#dlaczego-my">Dlaczego my</Link><a href="tel:+48883066661">Kontakt</a></nav>
        <HeaderSocials />
      </header>

      <section className="legal-hero"><Link href="/">← Wróć na stronę główną</Link><p className="eyebrow"><span/> Dokumenty</p><h1>Polityka prywatności<br/><em>i plików cookies</em></h1><p>Jasne zasady dotyczące danych osobowych i korzystania z serwisu CzęstoBusy.</p></section>

      <article className="legal-content">
        {sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2>{section.content}</div></section>)}
      </article>

      <SiteFooter />
    </main>
  );
}
