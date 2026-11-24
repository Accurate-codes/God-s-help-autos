# God's Help Autos: Demo Web App

A premium, mobile-first demo for **God's Help Autos** (Ojodu Berger, Lagos). It covers car sales, shipping from the USA, Canada and Europe, customs clearing at Apapa and Tin Can, and delivery anywhere in Nigeria.

There are three parts:

1. **Public website**: hero, cars for sale, services, Track My Car, quote form, duty estimator, FAQs, contact
2. **Customer portal** (`/portal`): my cars, 9-stage timeline, documents, payments, notifications
3. **Admin dashboard** (`/admin`): KPIs and charts, shipments, inventory, customers, inbox, invoices, settings

> **Sample data only.** There is no backend. All data lives in a typed mock layer (`lib/data.ts`) and is saved to `localStorage`, so changes made in the admin show up instantly on the public site and in the portal, even across browser tabs. Use **Reset demo data** in the top banner to start fresh.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
```

**Deploy:** push to GitHub and import into Vercel. It needs no configuration or environment variables.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui-style components (Radix) · lucide-react · Framer Motion · Recharts · Sonner toasts. Fonts (Archivo Black and Inter) are self-hosted via `@fontsource`, so there are no external requests at runtime.

## Demo logins

| Area | URL | Email | Password |
|---|---|---|---|
| Customer portal | `/portal` | `customer@demo.com` | `demo123` |
| Admin dashboard | `/admin` | `admin@demo.com` | `admin123` |

Each login screen also has a one-tap **“Use demo login”** button.

## Demo tracking IDs

Use these on **Track My Car** (`/track`). A VIN works too.

| ID | Car | Stage |
|---|---|---|
| `GHA-2026-0012` | 2020 Toyota Camry SE | On Vessel |
| `GHA-2026-0018` | 2019 Lexus RX 350 | Customs Clearing |
| `GHA-2026-0021` | 2019 Toyota Highlander XLE | Arrived Lagos |
| `GHA-2026-0007` | 2018 Honda Accord Sport | Delivered |

The 27 sample shipments run from `GHA-2026-0007` to `GHA-2026-0044` and cover every stage.

---

## 5-minute demo script

**Tip:** open two browser windows side by side, the **admin** in one and the **customer portal** (or public site) in the other. Changes sync live between them.

1. **The hero (30s).** Open `/` on a phone, or with the browser narrowed. Let the headline animate in: *BUY. SHIP. CLEAR. DRIVE.* Point out the Google 4.4★ trust row, the floating WhatsApp button and the hamburger menu. Then show the same page at desktop width.
2. **Selling cars (45s).** Tap **Explore Our Cars** and filter by *SUV*, then by price. Open the **Lexus RX 350**, swipe the gallery, and tap **Enquire on WhatsApp**: the message is prefilled with the car's name and price.
3. **Track My Car (30s).** Go to **Track My Car** and tap demo ID `GHA-2026-0012`. Show the 9-stage timeline with dates, the vessel and the ETA.
4. **Estimator (30s).** Open **Duty Estimator** and drag the car value slider. Switch the engine type to *Hybrid* and change the exchange rate. Point out the itemised ₦ breakdown and the *“Estimate only”* note.
5. **Quote → Inbox (45s).** Submit the **Get a Quote** form, for example *Toyota Camry 2021 from Houston to Abuja*. In the **admin** window, open **Inbox**: the request is at the top. Click **Convert to shipment**, and a new tracking ID and customer are created.
6. **The wow moment (60s).** Sign in to the portal (`customer@demo.com`) in the second window and open the **Lexus RX 350** (`GHA-2026-0018`). In the admin, go to **Shipments → GHA-2026-0018 → Advance stage** and choose *Duty Paid* with a note. In the portal, the bell shows a new notification and the timeline moves forward. Back in the admin, click **Sample photo** or **Upload** to add a photo; it appears in the customer's gallery.
7. **Money (45s).** In the admin, open **Invoices**, mark an *unpaid* invoice as paid, then create a new invoice. In the portal, the payment summary and balance update, and the invoice downloads as a PDF. The documents (Bill of Lading, Title and so on) download as branded sample PDFs too.
8. **Inventory → website (30s).** In **Inventory**, mark a car as **Sold**, or **Add car** with a price and colour. Refresh `/cars`: the public listing has updated.
9. **Wrap up (15s).** Show the **Overview** KPIs and charts, then **Settings** (company info and estimator percentages). Finish with **Reset demo data**.

---

## Project structure

```
app/
  (site)/           public website (home, cars, services, track, quote, estimator, faqs, contact)
  portal/           customer portal (login gate, my cars, car detail)
  admin/            admin dashboard (overview, shipments, inventory, customers, inbox, invoices, settings)
components/
  site/             hero, navbar, footer, car card, timeline, WhatsApp button, rating badge…
  ui/               shadcn-style primitives (button, card, input, dialog/sheet, accordion, tabs, badge)
  admin/, portal/   area-specific pieces
lib/
  data.ts           typed seed data (27 shipments, 18 cars, 14 customers, invoices, inbox)
  store.tsx         React context + localStorage persistence + all actions
  config.ts         business details + Duty & Clearing Estimator percentages (placeholders)
  types.ts          domain types and the 9 shipment stages
  pdf.ts            tiny PDF generator for mock document downloads
public/
  hero-car.jpg, hero-car-mobile.jpg, cars/*.jpg
```

## Swapping in real content

- **Hero image:** replace `public/hero-car.jpg` (desktop, about 2400×1350) and `public/hero-car-mobile.jpg` (portrait). Use a rear three-quarter shot of a glossy car with the car in the lower half.
- **Car photos:** the listings use the files in `public/cars/{colour}-{a|b|c|d}.jpg`. These are generic, unbranded 3D placeholder renders (from the CC-BY 4.0 Khronos *Car Concept* sample model, with the plate badge removed). Replace them with real photos, or upload a photo from Admin → Inventory.
- **Testimonials:** edit `TESTIMONIALS` in `lib/data.ts`. They're clearly marked *Placeholder* on the site.
- **Stats:** edit `STATS` in `lib/data.ts`. These are placeholder numbers.
- **Estimator percentages:** edit `DEFAULT_ESTIMATOR` in `lib/config.ts`, or change them live in Admin → Settings.

All names, phone numbers, VINs, prices and duty figures are sample data. The estimator is illustrative only: final figures are confirmed by God's Help Autos.
