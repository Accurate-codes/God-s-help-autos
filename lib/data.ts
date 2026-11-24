/**
 * Typed mock data layer for the God's Help Autos demo.
 * Everything here is SAMPLE DATA. Names and phone numbers are placeholders.
 * The store (lib/store.tsx) copies this seed into localStorage so that admin
 * changes show up on the public site and in the customer portal.
 */
import { COMPANY, DEFAULT_ESTIMATOR } from "./config";
import {
  STAGES,
  type Activity,
  type Car,
  type Customer,
  type DB,
  type Inquiry,
  type Invoice,
  type Notification,
  type Shipment,
  type ShipmentDoc,
  type StageEvent,
} from "./types";

export const DB_VERSION = 4;

/** Fixed "today" for deterministic sample data. */
export const DEMO_TODAY = "2026-11-24T10:00:00.000Z";

const DAY = 86_400_000;
export function daysFrom(base: string, days: number) {
  return new Date(new Date(base).getTime() + days * DAY).toISOString();
}
const ago = (d: number) => daysFrom(DEMO_TODAY, -d);
const ahead = (d: number) => daysFrom(DEMO_TODAY, d);

/* ------------------------------------------------------------------ */
/* Images: generic, unbranded placeholder renders in /public/cars      */
/* ------------------------------------------------------------------ */
export const CAR_COLORS = ["white", "silver", "black", "navy", "red", "grey", "champagne", "blue", "green"] as const;
export type CarColor = (typeof CAR_COLORS)[number];

export function carImages(color: CarColor) {
  return ["a", "b", "c", "d"].map((a) => `/cars/${color}-${a}.jpg`);
}
export const carImage = (color: CarColor, angle: "a" | "b" | "c" | "d" = "a") => `/cars/${color}-${angle}.jpg`;

/* ------------------------------------------------------------------ */
/* Customers                                                            */
/* ------------------------------------------------------------------ */
const customerRows: [string, string, string, string][] = [
  ["Chinedu Okafor", "0803 555 0101", "customer@demo.com", "Lagos"],
  ["Adaeze Nwosu", "0805 555 0102", "adaeze.n@example.com", "Anambra"],
  ["Babatunde Adeyemi", "0802 555 0103", "tunde.adeyemi@example.com", "Oyo"],
  ["Ngozi Eze", "0806 555 0104", "ngozi.eze@example.com", "Abuja (FCT)"],
  ["Emeka Obi", "0809 555 0105", "emeka.obi@example.com", "Rivers"],
  ["Funmilayo Bakare", "0813 555 0106", "funmi.bakare@example.com", "Lagos"],
  ["Ibrahim Musa", "0807 555 0107", "ibrahim.musa@example.com", "Kano"],
  ["Oluwaseun Akinola", "0816 555 0108", "seun.akinola@example.com", "Ogun"],
  ["Chioma Uche", "0814 555 0109", "chioma.uche@example.com", "Enugu"],
  ["Tunde Bello", "0810 555 0110", "tunde.bello@example.com", "Lagos"],
  ["Aisha Abdullahi", "0812 555 0111", "aisha.a@example.com", "Abuja (FCT)"],
  ["Kelechi Nnamdi", "0818 555 0112", "kelechi.n@example.com", "Imo"],
  ["Yetunde Ogunleye", "0817 555 0113", "yetunde.o@example.com", "Oyo"],
  ["Segun Oyelaran", "0811 555 0114", "segun.o@example.com", "Lagos"],
];

export const seedCustomers: Customer[] = customerRows.map(([name, phone, email, state], i) => ({
  id: `c${i + 1}`,
  name,
  phone,
  email,
  state,
  createdAt: ago(320 - i * 19),
}));

/* ------------------------------------------------------------------ */
/* Shipments                                                            */
/* ------------------------------------------------------------------ */
const STAGE_GAP = [0, 4, 5, 6, 30, 2, 5, 3, 3]; // days between consecutive stages

const VESSELS = ["MV Atlantic Horizon", "MV Ocean Majesty", "MV Gulf Pioneer", "MV Sea Venture", "MV Grand Lagos Express"];

function stageNote(stage: number, s: { originPort: string; vessel: string; destinationPort: string; destinationState: string; auction: string }) {
  switch (stage) {
    case 0:
      return `Vehicle purchased (${s.auction}). Payment confirmed and title requested.`;
    case 1:
      return `Picked up by our carrier and en route to ${s.originPort}.`;
    case 2:
      return `Received at ${s.originPort} terminal. Export docs filed.`;
    case 3:
      return `Loaded on ${s.vessel}. Sailing to Lagos.`;
    case 4:
      return `${s.vessel} berthed at ${s.destinationPort} Port, Lagos.`;
    case 5:
      return "Documents submitted to Nigeria Customs Service for assessment.";
    case 6:
      return "Import duty paid. Payment receipt and release papers issued.";
    case 7:
      return `Released from ${s.destinationPort} terminal. Final inspection done.`;
    case 8:
      return `Delivered to customer in ${s.destinationState}. Keys handed over.`;
    default:
      return "";
  }
}

type ShipRow = {
  n: number;
  c: number; // customer index (1-based)
  make: string;
  model: string;
  year: number;
  color: (typeof CAR_COLORS)[number];
  country: Shipment["originCountry"];
  port: string;
  dest: string;
  stage: number;
  lastDaysAgo: number; // days since the current stage was reached
  total: number;
  paidPct: number;
  vin: string;
  auction?: string;
};

const shipRows: ShipRow[] = [
  { n: 12, c: 1, make: "Toyota", model: "Camry SE", year: 2020, color: "white", country: "USA", port: "Port of Baltimore", dest: "Lagos", stage: 3, lastDaysAgo: 6, total: 18_400_000, paidPct: 0.7, vin: "4T1G11AK5LU312845", auction: "Copart, Baltimore MD" },
  { n: 18, c: 1, make: "Lexus", model: "RX 350", year: 2019, color: "black", country: "USA", port: "Port of Houston", dest: "Lagos", stage: 5, lastDaysAgo: 1, total: 31_750_000, paidPct: 0.85, vin: "2T2BZMCA8KC174320", auction: "IAAI, Houston TX" },
  { n: 7, c: 1, make: "Honda", model: "Accord Sport", year: 2018, color: "grey", country: "USA", port: "Port Newark, New Jersey", dest: "Lagos", stage: 8, lastDaysAgo: 40, total: 14_900_000, paidPct: 1, vin: "1HGCV1F34JA081256", auction: "Manheim, New Jersey" },
  { n: 21, c: 2, make: "Toyota", model: "Highlander XLE", year: 2019, color: "silver", country: "USA", port: "Port of Baltimore", dest: "Anambra", stage: 4, lastDaysAgo: 2, total: 27_300_000, paidPct: 0.6, vin: "5TDJZRFH3KS620194" },
  { n: 22, c: 3, make: "Toyota", model: "Corolla LE", year: 2020, color: "blue", country: "USA", port: "Port of Houston", dest: "Oyo", stage: 1, lastDaysAgo: 2, total: 12_800_000, paidPct: 0.5, vin: "5YFEPRAE6LP047821" },
  { n: 23, c: 4, make: "Mercedes-Benz", model: "GLE 350", year: 2020, color: "black", country: "Belgium", port: "Port of Antwerp", dest: "Abuja (FCT)", stage: 3, lastDaysAgo: 12, total: 52_600_000, paidPct: 0.75, vin: "4JGFB4KB2LA118652" },
  { n: 24, c: 5, make: "Lexus", model: "ES 350", year: 2019, color: "champagne", country: "USA", port: "Port Newark, New Jersey", dest: "Rivers", stage: 6, lastDaysAgo: 1, total: 29_100_000, paidPct: 0.9, vin: "58ABZ1B17KU041937" },
  { n: 25, c: 6, make: "Ford", model: "Edge SEL", year: 2018, color: "red", country: "Canada", port: "Port of Halifax", dest: "Lagos", stage: 2, lastDaysAgo: 3, total: 13_950_000, paidPct: 0.5, vin: "2FMPK3J95JBB60417" },
  { n: 26, c: 7, make: "Toyota", model: "Camry XSE", year: 2021, color: "red", country: "USA", port: "Port of Baltimore", dest: "Kano", stage: 0, lastDaysAgo: 1, total: 21_600_000, paidPct: 0.4, vin: "4T1K61AK1MU530982" },
  { n: 27, c: 8, make: "Honda", model: "CR-V EX", year: 2019, color: "silver", country: "USA", port: "Port of Houston", dest: "Ogun", stage: 7, lastDaysAgo: 1, total: 19_400_000, paidPct: 1, vin: "2HKRW2H54KH628413" },
  { n: 28, c: 9, make: "Mercedes-Benz", model: "C300", year: 2019, color: "white", country: "Germany", port: "Port of Bremerhaven", dest: "Anambra", stage: 4, lastDaysAgo: 4, total: 26_900_000, paidPct: 0.65, vin: "WDDWF8DB4KR471209" },
  { n: 29, c: 10, make: "Toyota", model: "Sienna XLE", year: 2018, color: "grey", country: "USA", port: "Port Newark, New Jersey", dest: "Lagos", stage: 8, lastDaysAgo: 9, total: 17_200_000, paidPct: 1, vin: "5TDYZ3DC9JS914562" },
  { n: 30, c: 11, make: "Lexus", model: "RX 350 F Sport", year: 2021, color: "navy", country: "Canada", port: "Port of Halifax", dest: "Abuja (FCT)", stage: 3, lastDaysAgo: 18, total: 44_800_000, paidPct: 0.8, vin: "2T2YZMDA4MC281736" },
  { n: 31, c: 12, make: "Toyota", model: "Highlander", year: 2017, color: "black", country: "USA", port: "Port of Houston", dest: "Imo", stage: 5, lastDaysAgo: 2, total: 21_300_000, paidPct: 0.7, vin: "5TDJZRFH1HS409823" },
  { n: 32, c: 13, make: "Toyota", model: "Corolla S", year: 2019, color: "white", country: "USA", port: "Port of Baltimore", dest: "Oyo", stage: 8, lastDaysAgo: 15, total: 11_900_000, paidPct: 1, vin: "2T1BURHE0KC193648" },
  { n: 33, c: 14, make: "Ford", model: "Edge Titanium", year: 2019, color: "blue", country: "USA", port: "Port Newark, New Jersey", dest: "Lagos", stage: 2, lastDaysAgo: 1, total: 16_400_000, paidPct: 0.45, vin: "2FMPK4K97KBC21873" },
  { n: 34, c: 2, make: "Lexus", model: "ES 350", year: 2020, color: "silver", country: "USA", port: "Port of Houston", dest: "Anambra", stage: 1, lastDaysAgo: 1, total: 32_500_000, paidPct: 0.5, vin: "58ADZ1B10LU063214" },
  { n: 35, c: 4, make: "Toyota", model: "RAV4 XLE", year: 2021, color: "green", country: "Canada", port: "Port of Halifax", dest: "Abuja (FCT)", stage: 6, lastDaysAgo: 2, total: 28_700_000, paidPct: 0.9, vin: "2T3P1RFV5MC152876" },
  { n: 36, c: 5, make: "Honda", model: "Accord EX-L", year: 2019, color: "black", country: "USA", port: "Port of Baltimore", dest: "Rivers", stage: 7, lastDaysAgo: 2, total: 17_800_000, paidPct: 1, vin: "1HGCV1F51KA019374" },
  { n: 37, c: 6, make: "Mercedes-Benz", model: "GLE 450", year: 2021, color: "white", country: "Germany", port: "Port of Bremerhaven", dest: "Lagos", stage: 4, lastDaysAgo: 1, total: 61_200_000, paidPct: 0.7, vin: "4JGFB5KB7MA390218" },
  { n: 38, c: 7, make: "Toyota", model: "Camry LE", year: 2018, color: "silver", country: "USA", port: "Port of Houston", dest: "Kano", stage: 8, lastDaysAgo: 24, total: 13_600_000, paidPct: 1, vin: "4T1B11HK5JU641290" },
  { n: 39, c: 8, make: "Lexus", model: "RX 350", year: 2018, color: "champagne", country: "USA", port: "Port Newark, New Jersey", dest: "Ogun", stage: 0, lastDaysAgo: 0, total: 26_400_000, paidPct: 0.3, vin: "2T2BZMCA6JC160482" },
  { n: 40, c: 9, make: "Toyota", model: "Venza LE", year: 2021, color: "navy", country: "USA", port: "Port of Baltimore", dest: "Enugu", stage: 3, lastDaysAgo: 3, total: 24_900_000, paidPct: 0.6, vin: "JTEAAAAH8MJ048261" },
  { n: 41, c: 10, make: "Ford", model: "Explorer XLT", year: 2019, color: "grey", country: "USA", port: "Port of Houston", dest: "Lagos", stage: 5, lastDaysAgo: 3, total: 22_100_000, paidPct: 0.75, vin: "1FM5K8D84KGA36190" },
  { n: 42, c: 11, make: "Honda", model: "Pilot EX-L", year: 2018, color: "red", country: "Canada", port: "Port of Halifax", dest: "Abuja (FCT)", stage: 2, lastDaysAgo: 2, total: 19_900_000, paidPct: 0.5, vin: "5FNYF6H59JB072813" },
  { n: 43, c: 3, make: "Mercedes-Benz", model: "C300 4MATIC", year: 2020, color: "grey", country: "Belgium", port: "Port of Antwerp", dest: "Oyo", stage: 8, lastDaysAgo: 4, total: 30_800_000, paidPct: 1, vin: "W1KWF8EB3LR582014" },
  { n: 44, c: 13, make: "Toyota", model: "Highlander Hybrid", year: 2020, color: "blue", country: "USA", port: "Port Newark, New Jersey", dest: "Oyo", stage: 1, lastDaysAgo: 3, total: 33_900_000, paidPct: 0.5, vin: "5TDBBRCH3LS502381" },
];

const DOC_BY_STAGE: [number, ShipmentDoc["type"], string][] = [
  [0, "Invoice", "Purchase Invoice"],
  [1, "Title", "Vehicle Title"],
  [3, "Bill of Lading", "Bill of Lading"],
  [5, "Customs Papers", "Customs Assessment (SGD)"],
  [6, "Customs Papers", "Duty Payment Receipt"],
];

function buildShipment(r: ShipRow, idx: number): Shipment {
  const vessel = VESSELS[idx % VESSELS.length];
  const destinationPort: Shipment["destinationPort"] = idx % 3 === 0 ? "Apapa" : "Tin Can Island";
  const ctx = { originPort: r.port, vessel, destinationPort, destinationState: r.dest, auction: r.auction ?? (r.country === "USA" ? "Copart auction" : "dealer purchase") };

  // walk backwards from the current stage date
  const dates: string[] = [];
  let t = r.lastDaysAgo;
  for (let s = r.stage; s >= 0; s--) {
    dates[s] = ago(t);
    t += STAGE_GAP[s];
  }
  const history: StageEvent[] = [];
  for (let s = 0; s <= r.stage; s++) history.push({ stage: s, date: dates[s], note: stageNote(s, ctx) });

  // ETA: projected delivery date
  let remaining = 0;
  for (let s = r.stage + 1; s < STAGES.length; s++) remaining += STAGE_GAP[s];
  const eta = r.stage === 8 ? dates[8] : ahead(Math.max(1, remaining - r.lastDaysAgo));

  const documents: ShipmentDoc[] = DOC_BY_STAGE.filter(([s]) => s <= r.stage).map(([s, type, name], i) => ({
    id: `d${r.n}-${i}`,
    type,
    name: `${name}: GHA-2026-${String(r.n).padStart(4, "0")}.pdf`,
    date: dates[s],
  }));

  const photos = r.stage >= 1 ? [carImage(r.color, "a"), carImage(r.color, "b"), carImage(r.color, "c"), ...(r.stage >= 4 ? [carImage(r.color, "d")] : [])] : [carImage(r.color, "a")];

  return {
    id: `GHA-2026-${String(r.n).padStart(4, "0")}`,
    vin: r.vin,
    customerId: `c${r.c}`,
    make: r.make,
    model: r.model,
    year: r.year,
    color: r.color,
    image: carImage(r.color, "a"),
    originCountry: r.country,
    originPort: r.port,
    destinationPort,
    destinationState: r.dest,
    stage: r.stage,
    history,
    vessel: r.stage >= 3 ? vessel : "To be assigned",
    container: r.stage >= 2 ? `GHAU ${(310000 + r.n * 7919).toString().slice(0, 6)}-${r.n % 10}` : "Pending",
    eta,
    photos,
    documents,
    totalNGN: r.total,
    paidNGN: Math.round((r.total * r.paidPct) / 1000) * 1000,
    createdAt: dates[0],
  };
}

export const seedShipments: Shipment[] = shipRows.map(buildShipment);

/* ------------------------------------------------------------------ */
/* Cars for sale                                                        */
/* ------------------------------------------------------------------ */
type CarRow = Omit<Car, "id" | "images" | "status" | "createdAt" | "description"> & { colorKey: CarColor; description?: string };

const carRows: CarRow[] = [
  { make: "Toyota", model: "Camry", trim: "SE", year: 2020, mileage: 41_200, price: 24_500_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "Sedan", transmission: "Automatic", fuel: "Petrol", engine: "2.5L 4-cylinder", color: "Super White", colorKey: "white", featured: true },
  { make: "Lexus", model: "RX 350", trim: "F Sport", year: 2021, mileage: 28_600, price: 68_000_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "SUV", transmission: "Automatic", fuel: "Petrol", engine: "3.5L V6", color: "Caviar Black", colorKey: "black", featured: true },
  { make: "Toyota", model: "Highlander", trim: "XLE", year: 2019, mileage: 52_300, price: 38_500_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "SUV", transmission: "Automatic", fuel: "Petrol", engine: "3.5L V6", color: "Celestial Silver", colorKey: "silver", featured: true },
  { make: "Mercedes-Benz", model: "GLE 350", trim: "4MATIC", year: 2020, mileage: 33_900, price: 78_000_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "SUV", transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", color: "Obsidian Black", colorKey: "navy", featured: true },
  { make: "Lexus", model: "ES 350", trim: "Luxury", year: 2019, mileage: 46_100, price: 42_000_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "Sedan", transmission: "Automatic", fuel: "Petrol", engine: "3.5L V6", color: "Champagne", colorKey: "champagne", featured: true },
  { make: "Toyota", model: "Corolla", trim: "LE", year: 2020, mileage: 38_700, price: 19_800_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "Sedan", transmission: "Automatic", fuel: "Petrol", engine: "1.8L 4-cylinder", color: "Blue Crush", colorKey: "blue", featured: true },
  { make: "Honda", model: "Accord", trim: "Sport 2.0T", year: 2019, mileage: 49_800, price: 23_500_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "Sedan", transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", color: "Radiant Red", colorKey: "red", featured: false },
  { make: "Mercedes-Benz", model: "C300", trim: "AMG Line", year: 2019, mileage: 41_500, price: 36_500_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "Sedan", transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", color: "Polar White", colorKey: "white", featured: false },
  { make: "Ford", model: "Edge", trim: "SEL", year: 2017, mileage: 88_400, price: 15_500_000, condition: "Nigerian Used", location: "Ojodu Berger, Lagos", bodyType: "Crossover", transmission: "Automatic", fuel: "Petrol", engine: "2.0L EcoBoost", color: "Magnetic Grey", colorKey: "grey", featured: false },
  { make: "Toyota", model: "Sienna", trim: "XLE", year: 2016, mileage: 104_000, price: 18_900_000, condition: "Nigerian Used", location: "Ojodu Berger, Lagos", bodyType: "Minivan", transmission: "Automatic", fuel: "Petrol", engine: "3.5L V6", color: "Predawn Grey", colorKey: "grey", featured: false },
  { make: "Toyota", model: "RAV4", trim: "XLE Hybrid", year: 2022, mileage: 21_300, price: 45_000_000, condition: "Foreign Used", location: "Arriving Dec (in transit)", bodyType: "Crossover", transmission: "Automatic", fuel: "Hybrid", engine: "2.5L Hybrid", color: "Army Green", colorKey: "green", featured: true },
  { make: "Lexus", model: "GX 460", trim: "Premium", year: 2016, mileage: 97_200, price: 52_000_000, condition: "Nigerian Used", location: "Ojodu Berger, Lagos", bodyType: "SUV", transmission: "Automatic", fuel: "Petrol", engine: "4.6L V8", color: "Starfire Pearl", colorKey: "white", featured: false },
  { make: "Toyota", model: "Hilux", trim: "Adventure", year: 2025, mileage: 0, price: 75_000_000, condition: "Brand New", location: "Ojodu Berger, Lagos", bodyType: "Pickup", transmission: "Automatic", fuel: "Diesel", engine: "2.8L Turbo Diesel", color: "Silver Metallic", colorKey: "silver", featured: false },
  { make: "Toyota", model: "Venza", trim: "XLE", year: 2014, mileage: 121_500, price: 13_800_000, condition: "Nigerian Used", location: "Ojodu Berger, Lagos", bodyType: "Crossover", transmission: "Automatic", fuel: "Petrol", engine: "2.7L 4-cylinder", color: "Cosmic Grey", colorKey: "grey", featured: false },
  { make: "Honda", model: "CR-V", trim: "EX-L", year: 2020, mileage: 36_400, price: 32_000_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "SUV", transmission: "Automatic", fuel: "Petrol", engine: "1.5L Turbo", color: "Lunar Silver", colorKey: "silver", featured: false },
  { make: "Kia", model: "Sportage", trim: "EX", year: 2025, mileage: 0, price: 58_000_000, condition: "Brand New", location: "Ojodu Berger, Lagos", bodyType: "SUV", transmission: "Automatic", fuel: "Petrol", engine: "2.5L 4-cylinder", color: "Deep Navy", colorKey: "navy", featured: false },
  { make: "Mercedes-Benz", model: "GLE 450", trim: "AMG Line", year: 2021, mileage: 26_800, price: 92_000_000, condition: "Foreign Used", location: "Ojodu Berger, Lagos", bodyType: "SUV", transmission: "Automatic", fuel: "Petrol", engine: "3.0L Turbo I6", color: "Selenite Grey", colorKey: "black", featured: false },
  { make: "Toyota", model: "Camry", trim: "LE", year: 2018, mileage: 64_900, price: 17_200_000, condition: "Nigerian Used", location: "Ojodu Berger, Lagos", bodyType: "Sedan", transmission: "Automatic", fuel: "Petrol", engine: "2.5L 4-cylinder", color: "Ruby Flare", colorKey: "red", featured: false },
];

function defaultDescription(c: CarRow) {
  const cond =
    c.condition === "Brand New"
      ? "Brand new with full manufacturer warranty."
      : c.condition === "Foreign Used"
        ? "Freshly imported (tokunbo), with a clean title and verified mileage. Duty fully paid and cleared."
        : "Nigerian used, one careful owner, with full service history and all papers complete.";
  return `${c.year} ${c.make} ${c.model} ${c.trim} in ${c.color}. ${cond} Inspected by the God's Help Autos team. Test drives are available at our Ojodu Berger yard, open 24 hours.`;
}

export const seedCars: Car[] = carRows.map(({ colorKey, ...c }, i) => ({
  ...c,
  id: `car-${String(i + 1).padStart(3, "0")}`,
  images: carImages(colorKey),
  status: "available",
  description: c.description ?? defaultDescription({ ...c, colorKey }),
  createdAt: ago(1 + i * 3),
}));

/* ------------------------------------------------------------------ */
/* Inquiries (admin inbox)                                              */
/* ------------------------------------------------------------------ */
export const seedInquiries: Inquiry[] = [
  { id: "q1", kind: "quote", name: "Obinna Chukwu", phone: "0803 555 0201", originCountry: "USA", originPort: "Port of Baltimore", vehicle: "Toyota Camry 2021", vin: "4T1G11AK2MU401928", service: "Shipping + Clearing + Delivery", destination: "Anambra", message: "I won this car on Copart. How soon can you ship it?", status: "new", createdAt: ago(0.1) },
  { id: "q2", kind: "enquiry", name: "Folake Adebayo", phone: "0805 555 0202", vehicle: "Lexus RX 350 F Sport 2021", carId: "car-002", message: "Is the RX 350 still available? Can I come and see it this weekend?", status: "new", createdAt: ago(0.3) },
  { id: "q3", kind: "quote", name: "Musa Garba", phone: "0806 555 0203", originCountry: "Canada", originPort: "Port of Halifax", vehicle: "Honda Pilot 2019", service: "Clearing only", destination: "Abuja (FCT)", status: "new", createdAt: ago(0.9) },
  { id: "q4", kind: "quote", name: "Grace Ekpo", phone: "0807 555 0204", originCountry: "USA", originPort: "Port of Houston", vehicle: "Lexus ES 350 2020", service: "Auction buying + Shipping + Clearing", destination: "Rivers", message: "Please help me find a clean ES 350 under $18k.", status: "contacted", createdAt: ago(2) },
  { id: "q5", kind: "enquiry", name: "Samuel Ojo", phone: "0808 555 0205", vehicle: "Toyota Highlander XLE 2019", carId: "car-003", message: "What's your best price for the Highlander?", status: "contacted", createdAt: ago(3) },
  { id: "q6", kind: "quote", name: "Blessing Okon", phone: "0809 555 0206", originCountry: "Belgium", originPort: "Port of Antwerp", vehicle: "Mercedes-Benz C300 2019", service: "Shipping + Clearing + Delivery", destination: "Lagos", status: "converted", createdAt: ago(9) },
];

/* ------------------------------------------------------------------ */
/* Invoices                                                             */
/* ------------------------------------------------------------------ */
function invoicesFor(shipments: Shipment[]): Invoice[] {
  const out: Invoice[] = [];
  let n = 1040;
  shipments.forEach((s, i) => {
    const deposit = Math.round(s.totalNGN * 0.5);
    const balance = s.totalNGN - deposit;
    out.push({
      id: `inv-${n}`,
      number: `INV-${n++}`,
      customerId: s.customerId,
      shipmentId: s.id,
      items: [
        { description: `Deposit: ${s.year} ${s.make} ${s.model} (vehicle + shipping)`, amount: deposit },
      ],
      status: s.paidNGN >= deposit ? "paid" : "unpaid",
      issuedAt: s.createdAt,
      dueAt: daysFrom(s.createdAt, 7),
      paidAt: s.paidNGN >= deposit ? daysFrom(s.createdAt, 2) : undefined,
    });
    if (s.stage >= 4 || i % 4 === 0) {
      const paid = s.paidNGN >= s.totalNGN;
      out.push({
        id: `inv-${n}`,
        number: `INV-${n++}`,
        customerId: s.customerId,
        shipmentId: s.id,
        items: [
          { description: "Customs duty & port charges", amount: Math.round(balance * 0.7) },
          { description: "Clearing agency fee & delivery", amount: balance - Math.round(balance * 0.7) },
        ],
        status: paid ? "paid" : "unpaid",
        issuedAt: s.history[Math.min(s.stage, 4)].date,
        dueAt: daysFrom(s.history[Math.min(s.stage, 4)].date, 10),
        paidAt: paid ? s.history[s.stage].date : undefined,
      });
    }
  });
  return out;
}

export const seedInvoices: Invoice[] = invoicesFor(seedShipments);

/* ------------------------------------------------------------------ */
/* Notifications & activity                                             */
/* ------------------------------------------------------------------ */
export const seedNotifications: Notification[] = seedShipments
  .filter((s) => s.customerId === "c1")
  .flatMap((s) =>
    s.history.slice(-2).map((h, i) => ({
      id: `n-${s.id}-${h.stage}`,
      customerId: s.customerId,
      shipmentId: s.id,
      title: `${s.make} ${s.model}: ${STAGES[h.stage]}`,
      body: h.note,
      date: h.date,
      read: i === 0 || s.stage === 8,
    })),
  )
  .sort((a, b) => b.date.localeCompare(a.date));

export const seedActivity: Activity[] = ([
  ...seedShipments
    .filter((s) => s.history[s.stage] && new Date(s.history[s.stage].date) > new Date(ago(4)))
    .map((s) => ({
      id: `a-${s.id}`,
      text: `${s.id} (${s.year} ${s.make} ${s.model}) moved to ${STAGES[s.stage]}`,
      date: s.history[s.stage].date,
      kind: "stage" as const,
    })),
  { id: "a-q1", text: "New quote request from Obinna Chukwu (Toyota Camry 2021)", date: ago(0.1), kind: "inquiry" },
  { id: "a-q2", text: "Folake Adebayo enquired about the Lexus RX 350 F Sport", date: ago(0.3), kind: "inquiry" },
  { id: "a-p1", text: "Payment of ₦4,500,000 received from Ngozi Eze", date: ago(1.2), kind: "payment" },
] as Activity[]).sort((a, b) => b.date.localeCompare(a.date));

/** Historical monthly figures for charts (last 11 months before the current one). */
export const monthlyHistory = [
  { month: "Dec", shipments: 14, revenue: 182_000_000 },
  { month: "Jan", shipments: 11, revenue: 151_000_000 },
  { month: "Feb", shipments: 13, revenue: 176_000_000 },
  { month: "Mar", shipments: 17, revenue: 228_000_000 },
  { month: "Apr", shipments: 16, revenue: 214_000_000 },
  { month: "May", shipments: 19, revenue: 262_000_000 },
  { month: "Jun", shipments: 18, revenue: 249_000_000 },
  { month: "Jul", shipments: 22, revenue: 301_000_000 },
  { month: "Aug", shipments: 21, revenue: 296_000_000 },
  { month: "Sep", shipments: 24, revenue: 338_000_000 },
  { month: "Oct", shipments: 26, revenue: 365_000_000 },
];

export const STATS = {
  carsDelivered: 1200,
  years: 12,
  states: 28,
  rating: COMPANY.rating,
};

export const TESTIMONIALS = [
  { name: "Customer name", location: "Lekki, Lagos", car: "Toyota Camry 2020", text: "They handled everything from the Copart auction to my gate in Lekki. I could track my car at every stage, and clearing was quick." },
  { name: "Customer name", location: "Wuse, Abuja", car: "Lexus RX 350", text: "Honest pricing and no hidden charges at the port. The team picked up my calls any time, day or night." },
  { name: "Customer name", location: "Onitsha, Anambra", car: "Toyota Highlander", text: "This is my third car through God's Help Autos. Clearing at Tin Can took days, not weeks. Highly recommended." },
];

export function createSeed(): DB {
  return {
    version: DB_VERSION,
    shipments: structuredClone(seedShipments),
    customers: structuredClone(seedCustomers),
    cars: structuredClone(seedCars),
    inquiries: structuredClone(seedInquiries),
    invoices: structuredClone(seedInvoices),
    notifications: structuredClone(seedNotifications),
    activity: structuredClone(seedActivity),
    company: {
      name: COMPANY.name,
      phone: COMPANY.phone,
      email: COMPANY.email,
      address: COMPANY.address,
      hours: COMPANY.hours,
    },
    estimator: structuredClone(DEFAULT_ESTIMATOR),
  };
}

export const DEMO_TRACKING_IDS = ["GHA-2026-0012", "GHA-2026-0018", "GHA-2026-0021", "GHA-2026-0007"];

export const NIGERIAN_STATES = [
  "Abia", "Abuja (FCT)", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export const ORIGIN_PORTS = [
  { country: "USA", ports: ["Port of Baltimore", "Port of Houston", "Port Newark, New Jersey", "Port of Savannah", "Port of Jacksonville"] },
  { country: "Canada", ports: ["Port of Halifax", "Port of Montreal", "Port of Toronto"] },
  { country: "Belgium", ports: ["Port of Antwerp"] },
  { country: "Germany", ports: ["Port of Bremerhaven", "Port of Hamburg"] },
  { country: "UK", ports: ["Port of Southampton", "Port of Tilbury"] },
];

export const SERVICES_LIST = [
  "Shipping + Clearing + Delivery",
  "Shipping only",
  "Clearing only",
  "Delivery / Forwarding only",
  "Auction buying + Shipping + Clearing",
  "Buy a car from your stock",
];
