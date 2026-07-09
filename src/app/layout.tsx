import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { absoluteUrl, siteName, siteUrl } from "@/lib/site-config";
import "./globals.css";
import "./fleet.css";
import "./booking.css";
import "./vehicle.css";
import "./landmark.css";
import "./categories.css";
import "./header.css";
import "./legal.css";
import "./gallery.css";
import "./motion.css";
import "./category-page.css";
import "./offer-mobile.css";
import "./admin.css";
import "./reveal.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

const barlow = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "CzęstoBusy | Wynajem busów 9-osobowych i dostawczych",
    template: "%s | CzęstoBusy",
  },
  description:
    "Wynajem zadbanych busów 9-osobowych i dostawczych. Proste zasady, elastyczne terminy i szybka rezerwacja.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: absoluteUrl("/"),
    siteName,
    title: "CzęstoBusy | Wynajem busów 9-osobowych i dostawczych",
    description:
      "Wynajem zadbanych busów 9-osobowych i dostawczych w Częstochowie i okolicach.",
    images: [{ url: "/images/share-logo.png", width: 1200, height: 630, alt: "Logo CzęstoBusy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CzęstoBusy | Wynajem busów 9-osobowych i dostawczych",
    description:
      "Wynajem zadbanych busów 9-osobowych i dostawczych w Częstochowie i okolicach.",
    images: ["/images/share-logo.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/images/czestobusy-logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${manrope.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
