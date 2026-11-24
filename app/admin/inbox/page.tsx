"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRightLeft, Car, Check, Inbox, MapPin, MessageSquareQuote, Phone, Ship } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Panel } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/config";
import { timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Inquiry } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_BADGE = { new: "gold", contacted: "blue", converted: "green" } as const;

export default function InboxPage() {
  const { db, setInquiryStatus, convertInquiry } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<"all" | Inquiry["status"]>("all");
  const [kind, setKind] = useState<"all" | Inquiry["kind"]>("all");

  const list = useMemo(() => db.inquiries.filter((q) => (tab === "all" || q.status === tab) && (kind === "all" || q.kind === kind)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [db.inquiries, tab, kind]);

  const convert = (q: Inquiry) => {
    const id = convertInquiry(q.id);
    if (id) {
      toast.success(`Shipment ${id} created`, {
        description: `${q.name} has been added as a customer.`,
        action: { label: "Open", onClick: () => router.push(`/admin/shipments/${id}`) },
      });
    }
  };

  const phoneIntl = (p: string) => (/\d/.test(p) ? "234" + p.replace(/\D/g, "").replace(/^0/, "") : undefined);

  return (
    <div>
      <PageHeader title="Inbox" subtitle="Quote requests and car enquiries from the website" />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-black/[0.05] p-1">
          {(["all", "new", "contacted", "converted"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition", tab === t ? "bg-black text-white" : "text-muted-foreground")}>
              {t} <span className="opacity-60">{t === "all" ? db.inquiries.length : db.inquiries.filter((q) => q.status === t).length}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full bg-black/[0.05] p-1">
          {(["all", "quote", "enquiry"] as const).map((t) => (
            <button key={t} onClick={() => setKind(t)} className={cn("flex-1 rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition", kind === t ? "bg-white shadow-sm" : "text-muted-foreground")}>
              {t === "all" ? "All types" : t === "quote" ? "Quotes" : "Enquiries"}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <Panel>
          <EmptyState icon={Inbox} title="Nothing here" text="New quote requests from the website will appear here." />
        </Panel>
      ) : (
        <div className="space-y-3">
          {list.map((q) => {
            const intl = phoneIntl(q.phone);
            return (
              <Panel key={q.id} className={cn("p-5", q.status === "new" && "ring-2 ring-gold/50")}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", q.kind === "quote" ? "bg-[#eef6fc] text-navy" : "bg-gold-soft text-[#7a5410]")}>
                      {q.kind === "quote" ? <Ship className="size-5" /> : <Car className="size-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{q.name}</p>
                        <Badge variant={STATUS_BADGE[q.status]}>{q.status}</Badge>
                        <Badge variant="outline">{q.kind === "quote" ? "Quote request" : "Car enquiry"}</Badge>
                        <span className="text-xs text-muted-foreground">{timeAgo(q.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-[15px] font-semibold">{q.vehicle}</p>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-3" /> {q.phone}
                        </span>
                        {q.originPort && (
                          <span className="inline-flex items-center gap-1">
                            <Ship className="size-3" /> {q.originPort}, {q.originCountry}
                          </span>
                        )}
                        {q.destination && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" /> {q.destination}
                          </span>
                        )}
                        {q.service && <span>{q.service}</span>}
                        {q.vin && <span className="font-mono">VIN {q.vin}</span>}
                        {q.carId && (
                          <Link href={`/cars/${q.carId}`} target="_blank" className="font-semibold text-foreground underline-offset-2 hover:underline">
                            View listing
                          </Link>
                        )}
                      </div>
                      {q.message && (
                        <p className="mt-3 flex gap-2 rounded-2xl bg-[#f4f8fc] p-3 text-sm">
                          <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> {q.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:w-auto lg:flex-col">
                    {intl && (
                      <Button asChild size="sm" variant="whatsapp">
                        <a href={waLink(`Hello ${q.name.split(" ")[0]}, this is God's Help Autos replying to your request about the ${q.vehicle}.`, intl)} target="_blank" rel="noopener noreferrer">
                          <WhatsAppIcon className="size-4" /> Reply
                        </a>
                      </Button>
                    )}
                    {q.status === "new" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setInquiryStatus(q.id, "contacted");
                          toast.success("Marked as contacted");
                        }}
                      >
                        <Check /> Mark contacted
                      </Button>
                    )}
                    {q.status !== "converted" && q.kind === "quote" && (
                      <Button size="sm" onClick={() => convert(q)}>
                        <ArrowRightLeft /> Convert to shipment
                      </Button>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
