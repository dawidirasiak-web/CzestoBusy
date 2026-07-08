import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "@/components/site-logo";

export const metadata: Metadata = {
  title: "Najczęstsze pytania | CzęstoBusy",
  description: "Odpowiedzi na najczęstsze pytania dotyczące rezerwacji i wynajmu pojazdów CzęstoBusy.",
};

const questions: Array<{ question: string; answer: ReactNode }> = [
  { question: "Jakie busy są dostępne w ofercie?", answer: <p>Oferujemy wynajem nowych busów 9-osobowych oraz samochodów dostawczych. Nasza flota obejmuje m.in. Toyota ProAce Verso 2025 oraz busy dostawcze typu L4H3.</p> },
  { question: "Jakie dokumenty są potrzebne do wynajmu?", answer: <><p>Do wynajmu wymagane są:</p><ul><li>ważne prawo jazdy,</li><li>dowód osobisty,</li><li>podpisanie umowy najmu.</li></ul></> },
  { question: "Od ilu lat można wynająć busa?", answer: <p>Najemca musi mieć ukończone minimum 23 lata oraz posiadać prawo jazdy od co najmniej 2 lat.</p> },
  { question: "Czy pobierana jest kaucja?", answer: <p>Tak. Wysokość kaucji ustalana jest indywidualnie w zależności od pojazdu i okresu najmu.</p> },
  { question: "Czy można wyjechać za granicę?", answer: <p>Tak, jednak wyjazd poza granice Polski wymaga wcześniejszej zgody Wynajmującego.</p> },
  { question: "Czy busy posiadają klimatyzację?", answer: <p>Tak - nasze busy są wyposażone w klimatyzację oraz nowoczesne systemy zwiększające komfort podróży.</p> },
  { question: "Czy obowiązuje limit kilometrów?", answer: <p>Tak. Limit kilometrów ustalany jest indywidualnie podczas zawierania umowy najmu.</p> },
  { question: "Czy mogę wynająć busa na dłuższy okres?", answer: <p>Tak. Oferujemy zarówno wynajem krótkoterminowy, jak i długoterminowy.</p> },
  { question: "Czy mogę zarezerwować pojazd telefonicznie?", answer: <p>Tak. Rezerwacji można dokonać telefonicznie lub poprzez formularz rezerwacji na stronie.</p> },
  { question: "Czy mogę odebrać lub oddać auto poza standardowymi godzinami?", answer: <p>W wielu przypadkach jest taka możliwość po wcześniejszym uzgodnieniu.</p> },
  { question: "Czy w pojazdach można palić?", answer: <p>Nie. W pojazdach obowiązuje całkowity zakaz palenia papierosów oraz e-papierosów.</p> },
  { question: "Co zrobić w przypadku awarii lub kolizji?", answer: <p>Należy niezwłocznie skontaktować się z nami telefonicznie oraz postępować zgodnie z instrukcjami przekazanymi przez Wynajmującego.</p> },
  { question: "Czy auta są ubezpieczone?", answer: <p>Tak. Wszystkie pojazdy posiadają wymagane ubezpieczenia OC oraz AC.</p> },
  { question: "Gdzie działacie?", answer: <p>Nasza wypożyczalnia znajduje się w Częstochowie, jednak istnieje możliwość indywidualnego ustalenia miejsca odbioru pojazdu.</p> },
  { question: "Jak mogę sprawdzić dostępność pojazdu?", answer: <p>Wybierz samochód z naszej floty i sprawdź jego kalendarz albo zadzwoń pod numer <a href="tel:+48883066661">883 066 661</a>.</p> },
];

export default function FaqPage() {
  return (
    <main className="legal-page faq-page">
      <header className="site-header header-clean"><SiteLogo/><nav aria-label="Nawigacja główna"><Link href="/#flota">Flota</Link><Link href="/#dlaczego-my">Dlaczego my</Link><a href="tel:+48883066661">Kontakt</a></nav></header>
      <section className="legal-hero"><Link href="/">← Wróć na stronę główną</Link><p className="eyebrow"><span/> Pomoc</p><h1>Najczęstsze<br/><em>pytania.</em></h1><p>Najważniejsze informacje dotyczące rezerwacji, dokumentów, płatności i użytkowania pojazdów.</p></section>
      <section className="faq-content">{questions.map(({ question, answer }, index) => <details key={question}><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><i aria-hidden="true">+</i></summary><div className="faq-answer">{answer}</div></details>)}</section>
      <footer><Link className="brand footer-brand" href="/"><span>CZĘSTO</span><strong>BUSY</strong></Link><FooterLinks/><p>© 2026 CzęstoBusy</p></footer>
    </main>
  );
}

function FooterLinks() {
  return <nav className="footer-links" aria-label="Dokumenty"><Link href="/regulamin">Regulamin</Link><Link href="/polityka-prywatnosci">Polityka prywatności</Link><Link href="/faq">FAQ</Link></nav>;
}
