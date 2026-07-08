import type { Metadata } from "next";
import { FleetCategoryPage } from "@/components/fleet-category-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Busy 9-osobowe i samochody osobowe | CzęstoBusy",
  description: "Zobacz busy 9-osobowe i samochody osobowe dostępne na wynajem w Częstochowie oraz zarezerwuj termin online.",
};

export default function PassengerVehiclesPage() {
  return <FleetCategoryPage category="osobowe"/>;
}
