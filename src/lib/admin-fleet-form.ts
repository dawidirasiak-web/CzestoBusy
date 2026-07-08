import type { FleetCategory, FleetVehicle } from "@/lib/fleet";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imagePattern = /^\/.+/;

function text(body: Record<string, unknown>, key: string) {
  return typeof body[key] === "string" ? body[key].trim() : "";
}

function parseList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function vehicleFromBody(body: Record<string, unknown>) {
  const name = text(body, "name");
  const id = text(body, "id") || slugify(name);
  const type = text(body, "type");
  const category = text(body, "category") as FleetCategory;
  const tone = text(body, "tone") || "white";
  const description = text(body, "description");
  const year = Number(body.year);
  const dailyPrice = Number(body.dailyPrice);
  const features = parseList(text(body, "features"));
  const images = parseList(text(body, "images"));

  if (name.length < 2 || type.length < 2 || !slugPattern.test(id)) return { error: "Uzupełnij nazwę, typ i poprawny identyfikator pojazdu." };
  if (category !== "osobowe" && category !== "dostawcze") return { error: "Wybierz kategorię pojazdu." };
  if (!Number.isInteger(year) || year < 1990 || year > 2100 || !Number.isFinite(dailyPrice) || dailyPrice <= 0) return { error: "Podaj poprawny rocznik i cenę za dobę." };
  if (images.some((image) => !imagePattern.test(image))) return { error: "Zdjęcia podaj jako ścieżki zaczynające się od /, np. /fleet/model/01.jpg." };

  return { vehicle: { id, name, type, category, year, dailyPrice, tone, description, features, images } satisfies FleetVehicle };
}
