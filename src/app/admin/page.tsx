import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listBookings } from "@/lib/bookings";
import { listFleet } from "@/lib/fleet";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel administracyjny", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const [bookings, vehicles] = await Promise.all([listBookings(), listFleet()]);
  return <AdminDashboard initialBookings={bookings} initialVehicles={vehicles}/>;
}
