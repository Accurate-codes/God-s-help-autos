import type { EstimatorConfig } from "./config";

export const STAGES = [
  "Purchased",
  "Picked Up",
  "At Origin Port",
  "On Vessel",
  "Arrived Lagos",
  "Customs Clearing",
  "Duty Paid",
  "Released",
  "Delivered",
] as const;

export type StageName = (typeof STAGES)[number];

export type StageEvent = { stage: number; date: string; note: string };

export type DocType = "Bill of Lading" | "Title" | "Invoice" | "Customs Papers" | "Other";

export type ShipmentDoc = { id: string; name: string; type: DocType; date: string };

export type Shipment = {
  id: string; // tracking ID e.g. GHA-2026-0012
  vin: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  image: string;
  originCountry: "USA" | "Canada" | "Belgium" | "Germany" | "UK";
  originPort: string;
  destinationPort: "Apapa" | "Tin Can Island";
  destinationState: string;
  stage: number; // 0..8
  history: StageEvent[];
  vessel: string;
  container: string;
  eta: string;
  photos: string[];
  documents: ShipmentDoc[];
  totalNGN: number;
  paidNGN: number;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  createdAt: string;
};

export type Condition = "Foreign Used" | "Nigerian Used" | "Brand New";
export type BodyType = "Sedan" | "SUV" | "Minivan" | "Pickup" | "Crossover";

export type Car = {
  id: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  price: number;
  condition: Condition;
  location: string;
  bodyType: BodyType;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  engine: string;
  color: string;
  images: string[];
  featured: boolean;
  status: "available" | "sold";
  description: string;
  createdAt: string;
};

export type InquiryStatus = "new" | "contacted" | "converted";

export type Inquiry = {
  id: string;
  kind: "quote" | "enquiry";
  name: string;
  phone: string;
  originCountry?: string;
  originPort?: string;
  vehicle: string; // make / model / year
  vin?: string;
  service?: string;
  destination?: string;
  message?: string;
  carId?: string;
  status: InquiryStatus;
  createdAt: string;
};

export type InvoiceItem = { description: string; amount: number };

export type Invoice = {
  id: string;
  number: string;
  customerId: string;
  shipmentId?: string;
  items: InvoiceItem[];
  status: "paid" | "unpaid";
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
};

export type Notification = {
  id: string;
  customerId: string;
  shipmentId?: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
};

export type Activity = {
  id: string;
  text: string;
  date: string;
  kind: "stage" | "payment" | "inquiry" | "inventory" | "invoice" | "customer";
};

export type CompanySettings = {
  name: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
};

export type DB = {
  version: number;
  shipments: Shipment[];
  customers: Customer[];
  cars: Car[];
  inquiries: Inquiry[];
  invoices: Invoice[];
  notifications: Notification[];
  activity: Activity[];
  company: CompanySettings;
  estimator: EstimatorConfig;
};
