export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://czestobusy.pl";

export const siteName = "CzęstoBusy";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
