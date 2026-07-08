"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FleetVehicle } from "@/lib/fleet";

type FormMode = { type: "add" } | { type: "edit"; vehicle: FleetVehicle } | null;

const listValue = (items: string[]) => items.join("\n");

const CheckIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>;

function payloadFromForm(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form));
}

function ImageFields({ initialImages }: { initialImages?: string[] }) {
  const [images, setImages] = useState(() => initialImages?.length ? initialImages : [""]);

  return <div className="image-fields">
    <div className="image-fields-header"><span>Zdjęcia</span><button type="button" onClick={() => setImages((current) => [...current, ""])}>Dodaj zdjęcie</button></div>
    {images.map((image, index) => <div className="image-field-row" key={index}>
      <div className="image-preview">{image.startsWith("/") ? <Image src={image} alt="" width={96} height={64}/> : <span>Brak zdjęcia</span>}</div>
      <label><span>Ścieżka zdjęcia</span><input value={image} onChange={(event) => setImages((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="/fleet/model/01.jpg"/></label>
      <button className="danger" type="button" onClick={() => setImages((current) => current.length === 1 ? [""] : current.filter((_, itemIndex) => itemIndex !== index))}>Usuń</button>
    </div>)}
    <input name="images" type="hidden" value={images.join("\n")} readOnly/>
  </div>;
}

function VehicleFields({ vehicle }: { vehicle?: FleetVehicle }) {
  return <>
    <label><span>Nazwa</span><input required name="name" defaultValue={vehicle?.name} placeholder="Toyota ProAce City"/></label>
    <label><span>ID / adres</span><input name="id" defaultValue={vehicle?.id} placeholder="toyota-proace-city"/></label>
    <label><span>Typ</span><input required name="type" defaultValue={vehicle?.type} placeholder="9 osób, SUV, Kontener"/></label>
    <label><span>Kategoria</span><select required name="category" defaultValue={vehicle?.category || "osobowe"}><option value="osobowe">Osobowe</option><option value="dostawcze">Dostawcze</option></select></label>
    <label><span>Rocznik</span><input required name="year" type="number" min="1990" max="2100" defaultValue={vehicle?.year || new Date().getFullYear()}/></label>
    <label><span>Cena / doba</span><input required name="dailyPrice" type="number" min="1" step="1" defaultValue={vehicle?.dailyPrice} placeholder="250"/></label>
    <label><span>Kolor tła</span><select name="tone" defaultValue={vehicle?.tone || "white"}><option value="white">Biały</option><option value="silver">Srebrny</option><option value="black">Czarny</option><option value="graphite">Grafit</option><option value="red">Czerwony</option></select></label>
    <label className="admin-notes"><span>Opis</span><textarea name="description" rows={4} defaultValue={vehicle?.description} placeholder="Krótki opis widoczny na stronie pojazdu."/></label>
    <label className="admin-notes"><span>Cechy</span><textarea name="features" rows={3} defaultValue={vehicle ? listValue(vehicle.features) : "Pełne ubezpieczenie\nKlimatyzacja"} placeholder="Jedna cecha w linii"/></label>
    <div className="admin-notes wide"><ImageFields initialImages={vehicle?.images}/></div>
  </>;
}

export function AdminFleetManager({ initialVehicles }: { initialVehicles: FleetVehicle[] }) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [message, setMessage] = useState("");
  const [formKey, setFormKey] = useState(0);

  const formTitle = useMemo(() => {
    if (!formMode) return "";
    return formMode.type === "add" ? "Dodaj auto" : `Edytuj ${formMode.vehicle.name}`;
  }, [formMode]);

  async function refreshVehicles() {
    const response = await fetch("/api/admin/fleet", { cache: "no-store" });
    if (response.status === 401) { router.replace("/admin/login"); return; }
    const result = (await response.json()) as { vehicles: FleetVehicle[] };
    setVehicles(result.vehicles);
  }

  async function submitVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formMode) return;
    setMessage("");
    const form = event.currentTarget;
    const url = formMode.type === "add" ? "/api/admin/fleet" : `/api/admin/fleet/${formMode.vehicle.id}`;
    const method = formMode.type === "add" ? "POST" : "PATCH";
    const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadFromForm(form)) });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) { setMessage(result.error || "Nie udało się zapisać pojazdu."); return; }
    form.reset();
    setFormMode(null);
    setFormKey((key) => key + 1);
    setMessage(formMode.type === "add" ? "Pojazd został dodany do floty." : "Zmiany w pojeździe zostały zapisane.");
    await refreshVehicles();
    router.refresh();
  }

  async function removeVehicle(vehicle: FleetVehicle) {
    if (!window.confirm(`Usunąć pojazd ${vehicle.name} z floty?`)) return;
    setMessage("");
    const response = await fetch(`/api/admin/fleet/${vehicle.id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setMessage(result.error || "Nie udało się usunąć pojazdu.");
      return;
    }
    setMessage("Pojazd został usunięty z floty.");
    await refreshVehicles();
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return <main className="admin-shell">
    <header className="admin-header"><div><span>CZĘSTO<strong>BUSY</strong></span><small>Panel administratora</small></div><div><Link href="/admin">Rezerwacje</Link><a href="/" target="_blank">Otwórz stronę</a><button onClick={logout} type="button">Wyloguj</button></div></header>
    <section className="admin-main">
      <div className="admin-title"><div><p>Zarządzanie flotą</p><h1>Flota</h1></div><div className="admin-title-actions"><button className="admin-primary" onClick={() => { setFormMode({ type: "add" }); setMessage(""); }} type="button">+ Dodaj auto</button><Link className="admin-primary secondary" href="/admin">Rezerwacje</Link></div></div>
      {message && <p className="admin-message" role="status">{message}</p>}

      {formMode && <section className="admin-create vehicle-create fleet-page-create"><div><p>{formMode.type === "add" ? "Nowy pojazd" : "Edycja pojazdu"}</p><h2>{formTitle}</h2><span>Ustaw cenę, opis, cechy i zdjęcia widoczne na stronie.</span></div><form className="vehicle-form" key={`${formMode.type}-${formMode.type === "edit" ? formMode.vehicle.id : "new"}-${formKey}`} onSubmit={submitVehicle}><VehicleFields vehicle={formMode.type === "edit" ? formMode.vehicle : undefined}/><div className="fleet-admin-actions form-actions"><button className="admin-primary" type="submit">{formMode.type === "add" ? "Dodaj pojazd" : "Zapisz zmiany"}</button><button type="button" onClick={() => setFormMode(null)}>Anuluj</button></div></form></section>}

      <section className="admin-list fleet-admin-page"><div className="admin-toolbar"><div><h2>Obecne pojazdy</h2><span>{vehicles.length} w flocie</span></div></div><div className="admin-fleet-grid">{vehicles.map((vehicle, index) => <article className="admin-fleet-card" key={vehicle.id}><div className={`admin-fleet-visual ${vehicle.tone} ${vehicle.images.length ? "has-photo" : ""}`}>{vehicle.images[0] ? <Image className="fleet-photo" src={vehicle.images[0]} alt={vehicle.name} fill sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw"/> : <div className="vehicle-silhouette"><i/><b/><b/></div>}<span className="fleet-index">{String(index + 1).padStart(2, "0")}</span><span className="fleet-type">{vehicle.type}</span></div><div className="admin-fleet-content"><p>Rok produkcji {vehicle.year}</p><h3>{vehicle.name}</h3><ul>{vehicle.features.slice(0, 2).map((feature) => <li key={feature}><CheckIcon/>{feature}</li>)}</ul><div className="admin-fleet-bottom"><p><small>Cena od</small><strong>{vehicle.dailyPrice} zł</strong><span>/ doba</span></p><div className="fleet-admin-actions"><button type="button" onClick={() => { setFormMode({ type: "edit", vehicle }); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edytuj</button><button className="danger" type="button" onClick={() => removeVehicle(vehicle)}>Usuń</button></div></div></div></article>)}</div></section>
    </section>
  </main>;
}
