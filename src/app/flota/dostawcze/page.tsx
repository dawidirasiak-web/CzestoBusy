import type { Metadata } from "next";
import { FleetCategoryPage } from "@/components/fleet-category-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Busy dostawcze | CzęstoBusy",
  description: "Zobacz busy dostawcze dostępne na wynajem w Częstochowie i zarezerwuj wybrany termin online.",
};

export default function CargoVehiclesPage() {
  return <FleetCategoryPage category="dostawcze"/>;
}
