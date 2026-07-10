import { readJsonFile, writeJsonFile } from "@/lib/json-store";

export type FleetCategory = "osobowe" | "dostawcze";

export type FleetVehicle = {
  id: string;
  name: string;
  type: string;
  category: FleetCategory;
  year: number;
  dailyPrice: number;
  tone: string;
  description: string;
  features: string[];
  images: string[];
};

function gallery(vehicleId: string, count: number, extension: "jpg" | "jpeg" = "jpg") {
  return Array.from({ length: count }, (_, index) => `/fleet/${vehicleId}/${String(index + 1).padStart(2, "0")}.${extension}`);
}

export const defaultFleet: FleetVehicle[] = [
  { id: "toyota-proace-business", name: "Toyota ProAce Business", type: "9 osób", category: "osobowe", year: 2025, dailyPrice: 250, tone: "black", description: "Komfortowy bus 9-osobowy na wspólne wyjazdy, delegacje i rodzinne trasy.", features: ["Pełne ubezpieczenie", "Klimatyzacja"], images: gallery("toyota-proace-business", 6) },
  { id: "toyota-proace", name: "Toyota ProAce", type: "9 osób", category: "osobowe", year: 2025, dailyPrice: 200, tone: "silver", description: "Przestronny bus 9-osobowy gotowy na krótkie i dłuższe podróże.", features: ["Pełne ubezpieczenie", "Klimatyzacja"], images: gallery("toyota-proace", 11) },
  { id: "chery-tiggo-7", name: "Chery Tiggo 7", type: "SUV", category: "osobowe", year: 2025, dailyPrice: 200, tone: "red", description: "Wygodny SUV na wyjazdy prywatne, firmowe i codzienny wynajem.", features: ["Pełne ubezpieczenie", "Klimatyzacja"], images: gallery("chery-tiggo-7", 5) },
  { id: "toyota-proace-max", name: "Toyota ProAce Max", type: "Dostawczy", category: "dostawcze", year: 2025, dailyPrice: 230, tone: "white", description: "Pojemny samochód dostawczy do transportu, przeprowadzek i pracy.", features: ["Pełne ubezpieczenie", "Łatwy załadunek"], images: gallery("toyota-proace-max", 7, "jpeg") },
  { id: "fiat-ducato-maxi", name: "Fiat Ducato MAXI", type: "Dostawczy", category: "dostawcze", year: 2025, dailyPrice: 250, tone: "graphite", description: "Duży dostawczak dla większego ładunku i elastycznych zleceń.", features: ["Pełne ubezpieczenie", "Duża przestrzeń"], images: gallery("fiat-ducato-maxi", 4) },
  { id: "fiat-ducato-maxi-hd", name: "Fiat Ducato MAXI HD", type: "Kontener", category: "dostawcze", year: 2026, dailyPrice: 270, tone: "white", description: "Kontener do przewozu większych rzeczy i zadań wymagających pojemnej zabudowy.", features: ["Pełne ubezpieczenie", "Kontener"], images: gallery("fiat-ducato-maxi-hd", 7, "jpeg") },
];

let writeQueue = Promise.resolve();

function normalizeVehicle(vehicle: FleetVehicle): FleetVehicle {
  return {
    ...vehicle,
    name: vehicle.name.trim(),
    type: vehicle.type.trim(),
    tone: vehicle.tone.trim() || "white",
    description: (vehicle.description || "Nowoczesny, regularnie serwisowany pojazd gotowy na Twoją trasę.").trim(),
    features: (vehicle.features?.length ? vehicle.features : ["Pełne ubezpieczenie", "Klimatyzacja"]).map((feature) => feature.trim()).filter(Boolean),
    images: (vehicle.images || []).map((image) => image.trim()).filter(Boolean),
  };
}

async function readFleetFile(): Promise<FleetVehicle[]> {
  const vehicles = await readJsonFile<FleetVehicle[]>("fleet.json", defaultFleet);
  return vehicles.map(normalizeVehicle);
}

async function saveFleet(vehicles: FleetVehicle[]) {
  await writeJsonFile("fleet.json", vehicles.map(normalizeVehicle));
}

export async function listFleet() {
  await writeQueue.catch(() => undefined);
  return readFleetFile();
}

export async function findVehicle(id: string) {
  const vehicles = await listFleet();
  return vehicles.find((vehicle) => vehicle.id === id);
}

export async function createVehicle(vehicle: FleetVehicle) {
  let result: FleetVehicle | null = null;
  const operation = writeQueue.catch(() => undefined).then(async () => {
    const vehicles = await readFleetFile();
    if (vehicles.some((item) => item.id === vehicle.id)) throw new Error("VEHICLE_EXISTS");
    result = normalizeVehicle(vehicle);
    await saveFleet([...vehicles, result]);
  });

  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}

export async function updateVehicle(id: string, vehicle: FleetVehicle) {
  let result: FleetVehicle | null = null;
  const operation = writeQueue.catch(() => undefined).then(async () => {
    const vehicles = await readFleetFile();
    const index = vehicles.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("VEHICLE_NOT_FOUND");
    if (vehicle.id !== id && vehicles.some((item) => item.id === vehicle.id)) throw new Error("VEHICLE_EXISTS");
    result = normalizeVehicle(vehicle);
    vehicles[index] = result;
    await saveFleet(vehicles);
  });

  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}

export async function deleteVehicle(id: string) {
  const operation = writeQueue.catch(() => undefined).then(async () => {
    const vehicles = await readFleetFile();
    const filtered = vehicles.filter((vehicle) => vehicle.id !== id);
    if (filtered.length === vehicles.length) throw new Error("VEHICLE_NOT_FOUND");
    await saveFleet(filtered);
  });

  writeQueue = operation.catch(() => undefined);
  await operation;
}

export async function reorderFleet(ids: string[]) {
  const operation = writeQueue.catch(() => undefined).then(async () => {
    const vehicles = await readFleetFile();
    if (ids.length !== vehicles.length || new Set(ids).size !== ids.length || ids.some((id) => !vehicles.some((vehicle) => vehicle.id === id))) {
      throw new Error("INVALID_FLEET_ORDER");
    }
    const byId = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
    await saveFleet(ids.map((id) => byId.get(id)!));
  });

  writeQueue = operation.catch(() => undefined);
  await operation;
}
