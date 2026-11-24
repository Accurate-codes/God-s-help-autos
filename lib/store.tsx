"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { createSeed, DB_VERSION } from "./data";
import { STAGES, type Car, type Customer, type DB, type Inquiry, type Invoice, type Shipment, type ShipmentDoc } from "./types";
import { uid } from "./utils";
import { naira } from "./format";

const KEY = "gha-demo-db";
const SESSION_KEY = "gha-demo-session";

export type Session = { role: "customer"; customerId: string; email: string } | { role: "admin"; email: string } | null;

type Store = {
  db: DB;
  hydrated: boolean;
  session: Session;
  login: (email: string, password: string, role: "customer" | "admin") => boolean;
  logout: () => void;
  reset: () => void;
  // shipments
  advanceStage: (id: string, note: string, toStage?: number) => void;
  updateShipment: (id: string, patch: Partial<Shipment>) => void;
  addShipmentPhoto: (id: string, src: string) => void;
  addShipmentDoc: (id: string, doc: Omit<ShipmentDoc, "id" | "date">) => void;
  // cars
  saveCar: (car: Car) => void;
  deleteCar: (id: string) => void;
  // inquiries
  addInquiry: (i: Omit<Inquiry, "id" | "status" | "createdAt">) => void;
  setInquiryStatus: (id: string, status: Inquiry["status"]) => void;
  convertInquiry: (id: string) => string | null;
  // invoices
  createInvoice: (inv: Omit<Invoice, "id" | "number" | "issuedAt" | "status">) => void;
  markInvoicePaid: (id: string) => void;
  // customers
  addCustomer: (c: Omit<Customer, "id" | "createdAt">) => Customer;
  // notifications
  markNotificationsRead: (customerId: string) => void;
  // settings
  updateSettings: (patch: Partial<Pick<DB, "company" | "estimator">>) => void;
};

const Ctx = createContext<Store | null>(null);

function now() {
  return new Date().toISOString();
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => createSeed());
  const [session, setSession] = useState<Session>(null);
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(true);

  // Load from localStorage after mount (keeps SSR markup deterministic)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DB;
        if (parsed.version === DB_VERSION) setDb(parsed);
      }
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setSession(JSON.parse(s));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
      toast.error("Browser storage is full. Try “Reset demo data” in the banner.");
    }
  }, [db, hydrated]);

  // Sync across tabs (e.g. admin in one tab, portal in another)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          skipSave.current = true;
          setDb(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === SESSION_KEY) setSession(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (d: DB) => DB) => setDb((d) => fn(d)), []);

  const persistSession = (s: Session) => {
    setSession(s);
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  };

  const login: Store["login"] = (email, password, role) => {
    const e = email.trim().toLowerCase();
    if (role === "customer" && e === "customer@demo.com" && password === "demo123") {
      persistSession({ role: "customer", customerId: "c1", email: e });
      return true;
    }
    if (role === "admin" && e === "admin@demo.com" && password === "admin123") {
      persistSession({ role: "admin", email: e });
      return true;
    }
    return false;
  };

  const logout = () => persistSession(null);

  const reset = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    skipSave.current = true;
    setDb(createSeed());
  };

  const advanceStage: Store["advanceStage"] = (id, note, toStage) =>
    update((d) => {
      const s = d.shipments.find((x) => x.id === id);
      if (!s) return d;
      const next = Math.min(STAGES.length - 1, toStage ?? s.stage + 1);
      if (next <= s.stage) return d;
      const date = now();
      const events = [];
      for (let st = s.stage + 1; st <= next; st++) {
        events.push({ stage: st, date, note: st === next ? note || `${STAGES[st]}.` : `${STAGES[st]}.` });
      }
      const updated: Shipment = { ...s, stage: next, history: [...s.history, ...events] };
      return {
        ...d,
        shipments: d.shipments.map((x) => (x.id === id ? updated : x)),
        notifications: [
          {
            id: uid("n"),
            customerId: s.customerId,
            shipmentId: s.id,
            title: `${s.make} ${s.model}: ${STAGES[next]}`,
            body: note || `Your car has moved to “${STAGES[next]}”.`,
            date,
            read: false,
          },
          ...d.notifications,
        ],
        activity: [{ id: uid("a"), text: `${s.id} (${s.year} ${s.make} ${s.model}) moved to ${STAGES[next]}`, date, kind: "stage" as const }, ...d.activity],
      };
    });

  const updateShipment: Store["updateShipment"] = (id, patch) =>
    update((d) => ({ ...d, shipments: d.shipments.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const addShipmentPhoto: Store["addShipmentPhoto"] = (id, src) =>
    update((d) => ({ ...d, shipments: d.shipments.map((x) => (x.id === id ? { ...x, photos: [...x.photos, src] } : x)) }));

  const addShipmentDoc: Store["addShipmentDoc"] = (id, doc) =>
    update((d) => ({
      ...d,
      shipments: d.shipments.map((x) => (x.id === id ? { ...x, documents: [...x.documents, { ...doc, id: uid("d"), date: now() }] } : x)),
    }));

  const saveCar: Store["saveCar"] = (car) =>
    update((d) => {
      const exists = d.cars.some((c) => c.id === car.id);
      return {
        ...d,
        cars: exists ? d.cars.map((c) => (c.id === car.id ? car : c)) : [car, ...d.cars],
        activity: [
          { id: uid("a"), text: `${exists ? "Updated" : "Added"} ${car.year} ${car.make} ${car.model} in inventory${car.status === "sold" ? " (sold)" : ""}`, date: now(), kind: "inventory" as const },
          ...d.activity,
        ],
      };
    });

  const deleteCar: Store["deleteCar"] = (id) => update((d) => ({ ...d, cars: d.cars.filter((c) => c.id !== id) }));

  const addInquiry: Store["addInquiry"] = (i) =>
    update((d) => ({
      ...d,
      inquiries: [{ ...i, id: uid("q"), status: "new", createdAt: now() }, ...d.inquiries],
      activity: [
        { id: uid("a"), text: i.kind === "quote" ? `New quote request from ${i.name} (${i.vehicle})` : `${i.name} enquired about the ${i.vehicle}`, date: now(), kind: "inquiry" as const },
        ...d.activity,
      ],
    }));

  const setInquiryStatus: Store["setInquiryStatus"] = (id, status) =>
    update((d) => ({ ...d, inquiries: d.inquiries.map((q) => (q.id === id ? { ...q, status } : q)) }));

  const convertInquiry: Store["convertInquiry"] = (id) => {
    const q = db.inquiries.find((x) => x.id === id);
    if (!q) return null;
    const year = Number((q.vehicle.match(/(19|20)\d{2}/) || [])[0]) || 2020;
    const rest = q.vehicle.replace(/(19|20)\d{2}/, "").trim();
    const [make, ...modelParts] = rest.split(" ");
    const max = Math.max(...db.shipments.map((s) => Number(s.id.split("-")[2]) || 0));
    const newId = `GHA-2026-${String(max + 1).padStart(4, "0")}`;
    const date = now();
    update((d) => {
      const digits = (p: string) => p.replace(/\D/g, "");
      let customer = d.customers.find((c) => digits(c.phone) === digits(q.phone));
      const customers = [...d.customers];
      if (!customer) {
        customer = { id: uid("c"), name: q.name, phone: q.phone, email: "", state: q.destination ?? "Lagos", createdAt: date };
        customers.push(customer);
      }
      const shipment: Shipment = {
        id: newId,
        vin: q.vin || "Pending",
        customerId: customer.id,
        make: make || "Vehicle",
        model: modelParts.join(" ") || "",
        year,
        color: "silver",
        image: "/cars/silver-a.jpg",
        originCountry: (["USA", "Canada", "Belgium", "Germany", "UK"].includes(q.originCountry ?? "") ? q.originCountry : "USA") as Shipment["originCountry"],
        originPort: q.originPort || "Port of Baltimore",
        destinationPort: "Tin Can Island",
        destinationState: q.destination || "Lagos",
        stage: 0,
        history: [{ stage: 0, date, note: "Shipment created from quote request. Awaiting vehicle purchase confirmation." }],
        vessel: "To be assigned",
        container: "Pending",
        eta: new Date(Date.now() + 60 * 86_400_000).toISOString(),
        photos: ["/cars/silver-a.jpg"],
        documents: [],
        totalNGN: 0,
        paidNGN: 0,
        createdAt: date,
      };
      return {
        ...d,
        customers,
        shipments: [shipment, ...d.shipments],
        inquiries: d.inquiries.map((x) => (x.id === id ? { ...x, status: "converted" } : x)),
        activity: [{ id: uid("a"), text: `Quote from ${q.name} converted to shipment ${newId}`, date, kind: "stage" as const }, ...d.activity],
      };
    });
    return newId;
  };

  const createInvoice: Store["createInvoice"] = (inv) =>
    update((d) => {
      const max = Math.max(1000, ...d.invoices.map((i) => Number(i.number.split("-")[1]) || 0));
      const number = `INV-${max + 1}`;
      const total = inv.items.reduce((a, b) => a + b.amount, 0);
      const cust = d.customers.find((c) => c.id === inv.customerId);
      return {
        ...d,
        invoices: [{ ...inv, id: uid("inv"), number, issuedAt: now(), status: "unpaid" }, ...d.invoices],
        shipments: inv.shipmentId ? d.shipments.map((s) => (s.id === inv.shipmentId ? { ...s, totalNGN: s.totalNGN + total } : s)) : d.shipments,
        activity: [{ id: uid("a"), text: `Invoice ${number} (${naira(total)}) created for ${cust?.name ?? "customer"}`, date: now(), kind: "invoice" as const }, ...d.activity],
      };
    });

  const markInvoicePaid: Store["markInvoicePaid"] = (id) =>
    update((d) => {
      const inv = d.invoices.find((i) => i.id === id);
      if (!inv || inv.status === "paid") return d;
      const total = inv.items.reduce((a, b) => a + b.amount, 0);
      const cust = d.customers.find((c) => c.id === inv.customerId);
      const date = now();
      return {
        ...d,
        invoices: d.invoices.map((i) => (i.id === id ? { ...i, status: "paid", paidAt: date } : i)),
        shipments: inv.shipmentId
          ? d.shipments.map((s) => (s.id === inv.shipmentId ? { ...s, paidNGN: s.paidNGN + total } : s))
          : d.shipments,
        notifications: [
          { id: uid("n"), customerId: inv.customerId, shipmentId: inv.shipmentId, title: `Payment received: ${inv.number}`, body: `Thank you! We have received ${naira(total)}.`, date, read: false },
          ...d.notifications,
        ],
        activity: [{ id: uid("a"), text: `Payment of ${naira(total)} received from ${cust?.name ?? "customer"} (${inv.number})`, date, kind: "payment" as const }, ...d.activity],
      };
    });

  const addCustomer: Store["addCustomer"] = (c) => {
    const customer: Customer = { ...c, id: uid("c"), createdAt: now() };
    update((d) => ({
      ...d,
      customers: [...d.customers, customer],
      activity: [{ id: uid("a"), text: `New customer added: ${customer.name}`, date: now(), kind: "customer" as const }, ...d.activity],
    }));
    return customer;
  };

  const markNotificationsRead: Store["markNotificationsRead"] = (customerId) =>
    update((d) => ({ ...d, notifications: d.notifications.map((n) => (n.customerId === customerId ? { ...n, read: true } : n)) }));

  const updateSettings: Store["updateSettings"] = (patch) => update((d) => ({ ...d, ...patch }));

  const value: Store = {
    db,
    hydrated,
    session,
    login,
    logout,
    reset,
    advanceStage,
    updateShipment,
    addShipmentPhoto,
    addShipmentDoc,
    saveCar,
    deleteCar,
    addInquiry,
    setInquiryStatus,
    convertInquiry,
    createInvoice,
    markInvoicePaid,
    addCustomer,
    markNotificationsRead,
    updateSettings,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <DataProvider>");
  return ctx;
}

/** Convenience selectors */
export function useCustomer(id?: string) {
  const { db } = useStore();
  return useMemo(() => db.customers.find((c) => c.id === id), [db.customers, id]);
}

export function invoiceTotal(inv: Invoice) {
  return inv.items.reduce((a, b) => a + b.amount, 0);
}
