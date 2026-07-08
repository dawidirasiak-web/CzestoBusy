import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";
import { listFleet } from "@/lib/fleet";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fleet = await listFleet();
  const staticRoutes = ["/", "/flota/osobowe", "/flota/dostawcze", "/regulamin", "/polityka-prywatnosci", "/faq"];

  return [
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route}`, lastModified: new Date() })),
    ...fleet.map((vehicle) => ({ url: `${siteUrl}/flota/${vehicle.id}`, lastModified: new Date() })),
  ];
}
