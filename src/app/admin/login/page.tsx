import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = { title: "Logowanie administratora", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  return <main className="admin-login-page"><section><Link className="admin-login-brand" href="/"><span>CZĘSTO</span><strong>BUSY</strong><small>Panel administratora</small></Link><div><p>Bezpieczne logowanie</p><h1>Zarządzaj rezerwacjami</h1><span>Zaloguj się, aby obsługiwać rezerwacje internetowe i telefoniczne.</span></div><AdminLoginForm/></section></main>;
}
