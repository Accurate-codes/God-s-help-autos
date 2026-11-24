import type { Metadata } from "next";
import { PageHero } from "@/components/site/section";
import { FinalCTA } from "@/components/site/cta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = { title: "FAQs" };

const GROUPS = [
  {
    title: "Shipping",
    items: [
      ["How long does shipping take?", "From the USA, ocean transit to Lagos usually takes 4–6 weeks. From Canada it's 5–7 weeks, and from Europe (Antwerp or Bremerhaven) it's 3–5 weeks. Add about 1–2 weeks for pick-up and port handling at origin. You can follow every stage on our Track My Car page."],
      ["Which countries and ports do you ship from?", "We ship from major US ports (Baltimore, Houston, New Jersey, Savannah, Jacksonville), Canada (Halifax, Montreal, Toronto) and Europe (Antwerp, Bremerhaven, Hamburg, UK ports)."],
      ["RoRo or container: which is better?", "RoRo (roll-on/roll-off) is usually cheaper and faster for running cars. A container is better for high-value cars, non-runners, or when you want to ship personal items with the car. We'll advise on the best option."],
    ],
  },
  {
    title: "Clearing",
    items: [
      ["How does customs clearing work?", "When the vessel arrives at Apapa or Tin Can, we submit the documents to the Nigeria Customs Service. The car is valued, duty and levies are assessed and paid, terminal and shipping line charges are settled, and the car is released. This typically takes 5–10 working days."],
      ["How much is duty on my car?", "Duty depends on the car's value, year and engine type. Use our Duty & Clearing Estimator for a rough figure. Final figures are confirmed by God's Help Autos after customs valuation."],
      ["Can you clear a car I shipped myself?", "Yes. Send us the Bill of Lading and vehicle details and our agents will handle clearing at either port."],
    ],
  },
  {
    title: "Payment",
    items: [
      ["How do I pay?", "We accept bank transfer in Naira, and USD for auction and freight payments. Typically you pay a deposit to buy and ship, then the balance for duty and clearing when the car arrives. Every payment comes with an invoice and receipt in your customer portal."],
      ["Are there hidden charges?", "No. You get an itemised quote covering the car, shipping, duty, port charges, agency fee and delivery. If customs valuation changes, we show you the official assessment."],
    ],
  },
  {
    title: "Documents",
    items: [
      ["What documents are needed?", "For shipping: the vehicle title, bill of sale/purchase invoice and a copy of your ID. For clearing: the Bill of Lading, title, invoice and your ID or company documents. We prepare the customs papers for you."],
      ["Where can I see my documents?", "Log in to the customer portal to view and download your Bill of Lading, title, invoices and customs papers at any time."],
    ],
  },
  {
    title: "Delivery",
    items: [
      ["Do you deliver outside Lagos?", "Yes. We deliver to any state in Nigeria, including Abuja, Rivers, Anambra, Oyo, Kano, Enugu and more, using insured car carriers."],
      ["Can I pick up the car myself?", "Of course. You can collect from our yard in Ojodu Berger (open 24 hours), or we can arrange pick-up directly from the port after release."],
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero eyebrow="FAQs" title={<>Questions,<br />answered</>} intro="Everything you need to know about buying, shipping, clearing and delivery. Still unsure? Chat with us on WhatsApp, any time." />
      <section className="container-x grid gap-10 pb-24 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav className="sticky top-28 space-y-1">
            {GROUPS.map((g) => (
              <a key={g.title} href={`#${g.title.toLowerCase()}`} className="block rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-white hover:text-foreground">
                {g.title}
              </a>
            ))}
          </nav>
        </aside>
        <div className="space-y-6 lg:col-span-9">
          {GROUPS.map((g) => (
            <div key={g.title} id={g.title.toLowerCase()} className="scroll-mt-28 rounded-[24px] bg-white px-5 py-3 shadow-[0_12px_32px_-16px_rgba(15,31,61,0.12)] ring-1 ring-black/[0.04] sm:px-8 sm:py-4">
              <p className="pt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{g.title}</p>
              <Accordion type="single" collapsible defaultValue={g.title === "Shipping" ? "0" : undefined}>
                {g.items.map(([q, a], i) => (
                  <AccordionItem key={q} value={String(i)}>
                    <AccordionTrigger>{q}</AccordionTrigger>
                    <AccordionContent>{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
      <FinalCTA title={<>Still have<br />questions?</>} />
    </>
  );
}
