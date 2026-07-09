import Link from "next/link";

export function SiteFooter({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <footer>
      <Link className="brand footer-brand" href={homeHref}>
        <span>CZĘSTO</span>
        <strong>BUSY</strong>
      </Link>
      <nav className="footer-links" aria-label="Dokumenty">
        <Link href="/regulamin">Regulamin</Link>
        <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
        <Link href="/faq">FAQ</Link>
      </nav>
      <p style={{ fontSize: "10px" }}>
        © 2026 CzęstoBusy
        <br />
        <span style={{ textTransform: "none", letterSpacing: ".6px" }}>
          Wykonanie strony: Dawid Irasiak{" "}
          <a href="https://dav.it" target="_blank" rel="noopener noreferrer">
            dav.it
          </a>
        </span>
      </p>
    </footer>
  );
}
