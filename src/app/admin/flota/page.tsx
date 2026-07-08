import { redirect } from "next/navigation";
import { AdminFleetManager } from "@/components/admin-fleet-manager";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listFleet } from "@/lib/fleet";

export const dynamic = "force-dynamic";
export const metadata = { title: "Flota - panel administracyjny", robots: { index: false, follow: false } };

export default async function AdminFleetPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <AdminFleetManager initialVehicles={await listFleet()}/>;
}
