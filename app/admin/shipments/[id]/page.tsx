"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, FilePlus2, FileText, ImagePlus, Mail, Phone, Save, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/admin/ui";
import { StageBadge, StageProgress, StageTimeline } from "@/components/site/stage-timeline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { CAR_COLORS, carImage } from "@/lib/data";
import { docLines } from "@/lib/docs";
import { fmtDate, naira } from "@/lib/format";
import { fileToDataUrl } from "@/lib/image";
import { downloadPdf } from "@/lib/pdf";
import { useStore } from "@/lib/store";
import { STAGES, type DocType } from "@/lib/types";

const DEFAULT_NOTES = [
  "Vehicle purchased. Payment confirmed.",
  "Picked up by our carrier and en route to the port.",
  "Received at origin port terminal. Export docs filed.",
  "Loaded on vessel. Sailing to Lagos.",
  "Vessel berthed at Lagos port.",
  "Documents submitted to Nigeria Customs Service.",
  "Import duty paid. Release papers issued.",
  "Released from terminal. Final inspection done.",
  "Delivered to customer. Keys handed over.",
];

export default function AdminShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { db, advanceStage, updateShipment, addShipmentPhoto, addShipmentDoc } = useStore();
  const s = db.shipments.find((x) => x.id === id);
  const customer = db.customers.find((c) => c.id === s?.customerId);

  const [advOpen, setAdvOpen] = useState(false);
  const [target, setTarget] = useState(0);
  const [note, setNote] = useState("");
  const [docOpen, setDocOpen] = useState(false);
  const [docType, setDocType] = useState<DocType>("Bill of Lading");
  const [docName, setDocName] = useState("");
  const [edit, setEdit] = useState<{ vessel: string; container: string; eta: string; totalNGN: number; vin: string } | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  if (!s)
    return (
      <div className="py-20 text-center">
        <p className="font-display text-4xl">Shipment not found</p>
        <Button asChild className="mt-6">
          <Link href="/admin/shipments">Back to shipments</Link>
        </Button>
      </div>
    );

  const form = edit ?? { vessel: s.vessel, container: s.container, eta: s.eta.slice(0, 10), totalNGN: s.totalNGN, vin: s.vin };
  const dirty = edit !== null;

  const openAdvance = () => {
    const next = Math.min(8, s.stage + 1);
    setTarget(next);
    setNote(DEFAULT_NOTES[next]);
    setAdvOpen(true);
  };

  const doAdvance = () => {
    advanceStage(s.id, note.trim(), target);
    setAdvOpen(false);
    toast.success(`Moved to “${STAGES[target]}”`, { description: `${customer?.name ?? "Customer"} has been notified in their portal.` });
  };

  const save = () => {
    if (!edit) return;
    updateShipment(s.id, { vessel: edit.vessel, container: edit.container, vin: edit.vin, totalNGN: Number(edit.totalNGN) || 0, eta: new Date(edit.eta + "T12:00:00Z").toISOString() });
    setEdit(null);
    toast.success("Shipment details saved");
  };

  const onPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      for (const f of Array.from(files).slice(0, 4)) addShipmentPhoto(s.id, await fileToDataUrl(f));
      toast.success(`${Math.min(files.length, 4)} photo(s) uploaded`, { description: "Visible to the customer in their portal." });
    } catch {
      toast.error("Could not read that image");
    }
  };

  const addSamplePhoto = () => {
    const color = CAR_COLORS.includes(s.color as (typeof CAR_COLORS)[number]) ? (s.color as (typeof CAR_COLORS)[number]) : "silver";
    const angles = ["a", "b", "c", "d"] as const;
    const next = angles.map((a) => carImage(color, a)).find((p) => !s.photos.includes(p)) ?? carImage(color, angles[s.photos.length % 4]);
    addShipmentPhoto(s.id, next);
    toast.success("Sample photo added");
  };

  const addDoc = () => {
    const name = docName.trim() || `${docType}: ${s.id}.pdf`;
    addShipmentDoc(s.id, { type: docType, name: name.endsWith(".pdf") ? name : `${name}.pdf` });
    setDocOpen(false);
    setDocName("");
    toast.success("Document uploaded", { description: "The customer can now download it." });
  };

  return (
    <div>
      <Link href="/admin/shipments" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Shipments
      </Link>
      <div className="mt-4">
        <PageHeader
          title={`${s.make} ${s.model}`}
          subtitle={
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-mono">{s.id}</span> · {s.year} · <StageBadge stage={s.stage} />
            </span>
          }
          actions={
            s.stage < 8 ? (
              <Button onClick={openAdvance} size="lg">
                Advance stage <ArrowRight />
              </Button>
            ) : (
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Delivered ✓</span>
            )
          }
        />
      </div>

      <Panel className="mb-6 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="font-semibold">
            Stage {s.stage + 1} of 9: {STAGES[s.stage]}
          </p>
          <p className="text-muted-foreground">
            {s.stage === 8 ? "Delivered" : "ETA"} {fmtDate(s.eta)}
          </p>
        </div>
        <StageProgress stage={s.stage} className="mt-3" />
        <div className="mt-2 hidden grid-cols-9 gap-1 text-[10px] text-muted-foreground lg:grid">
          {STAGES.map((n) => (
            <span key={n} className="truncate">
              {n}
            </span>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="min-w-0 space-y-6 xl:col-span-7">
          <Panel className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-bold">Timeline</p>
              {s.stage < 8 && (
                <Button variant="outline" size="sm" onClick={openAdvance}>
                  Add update
                </Button>
              )}
            </div>
            <StageTimeline shipment={s} />
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">Photos ({s.photos.length})</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addSamplePhoto}>
                  <Sparkles /> Sample photo
                </Button>
                <Button size="sm" onClick={() => photoInput.current?.click()}>
                  <ImagePlus /> Upload
                </Button>
                <input ref={photoInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { onPhotos(e.target.files); e.target.value = ""; }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {s.photos.map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={p} alt="" className="aspect-[4/3] w-full rounded-xl bg-[#e6edf4] object-cover" />
              ))}
              <button onClick={() => photoInput.current?.click()} className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-black/15 text-muted-foreground transition hover:border-black/40 hover:text-foreground">
                <Upload className="size-5" />
              </button>
            </div>
          </Panel>
        </div>

        <div className="min-w-0 space-y-6 xl:col-span-5">
          <Panel className="p-5 sm:p-6">
            <p className="font-bold">Shipping details</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Vessel">
                <Input value={form.vessel} onChange={(e) => setEdit({ ...form, vessel: e.target.value })} />
              </Field>
              <Field label="Container / booking no.">
                <Input value={form.container} onChange={(e) => setEdit({ ...form, container: e.target.value })} className="font-mono" />
              </Field>
              <Field label="ETA (delivery)">
                <Input type="date" value={form.eta} onChange={(e) => setEdit({ ...form, eta: e.target.value })} />
              </Field>
              <Field label="Total amount (₦)">
                <Input type="number" value={form.totalNGN} onChange={(e) => setEdit({ ...form, totalNGN: Number(e.target.value) })} />
              </Field>
              <Field label="VIN" className="sm:col-span-2">
                <Input value={form.vin} onChange={(e) => setEdit({ ...form, vin: e.target.value.toUpperCase() })} className="font-mono" maxLength={17} />
              </Field>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-[#f4f8fc] p-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Origin</p>
                <p className="font-semibold">{s.originPort}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-semibold">
                  {s.destinationPort} → {s.destinationState}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {dirty && (
                <Button variant="ghost" onClick={() => setEdit(null)}>
                  Cancel
                </Button>
              )}
              <Button onClick={save} disabled={!dirty}>
                <Save /> Save changes
              </Button>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <p className="font-bold">Customer & payment</p>
            {customer && (
              <Link href={`/admin/customers/${customer.id}`} className="mt-4 flex items-center gap-3 rounded-2xl p-2 transition hover:bg-black/[0.03]">
                <span className="grid size-11 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                  {customer.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3" /> {customer.phone}
                    </span>
                    {customer.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3" /> {customer.email}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            )}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Total", s.totalNGN],
                ["Paid", s.paidNGN],
                ["Balance", Math.max(0, s.totalNGN - s.paidNGN)],
              ].map(([l, v]) => (
                <div key={l as string} className="rounded-2xl bg-[#f4f8fc] p-3">
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">{l}</p>
                  <p className="mt-1 text-sm font-extrabold">{naira(v as number, { compact: true })}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href={`/admin/invoices?shipment=${s.id}`}>Manage invoices</Link>
            </Button>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-bold">Documents ({s.documents.length})</p>
              <Button size="sm" variant="outline" onClick={() => setDocOpen(true)}>
                <FilePlus2 /> Upload
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {s.documents.length === 0 && <li className="rounded-2xl border border-dashed border-black/10 p-4 text-center text-sm text-muted-foreground">No documents yet</li>}
              {s.documents.map((d) => (
                <li key={d.id} className="flex items-center gap-3 rounded-2xl bg-[#f4f8fc] p-3">
                  <FileText className="size-4 shrink-0 text-navy" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{d.type}</p>
                    <p className="truncate text-xs text-muted-foreground">{d.name}</p>
                  </div>
                  <Button variant="ghost" size="iconSm" aria-label="Download" onClick={() => downloadPdf(d.name, d.type, docLines(s, d, customer?.name))}>
                    <Download />
                  </Button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* Advance dialog */}
      <Dialog open={advOpen} onOpenChange={setAdvOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update stage</DialogTitle>
            <DialogDescription>
              {s.year} {s.make} {s.model} · currently <strong>{STAGES[s.stage]}</strong>. The customer sees this update in their portal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Move to stage">
              <NativeSelect
                value={target}
                onChange={(e) => {
                  const t = Number(e.target.value);
                  setTarget(t);
                  setNote(DEFAULT_NOTES[t]);
                }}
              >
                {STAGES.map((n, i) =>
                  i > s.stage ? (
                    <option key={n} value={i}>
                      {i + 1}. {n}
                    </option>
                  ) : null,
                )}
              </NativeSelect>
            </Field>
            <Field label="Note for the customer">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
            </Field>
            <Button onClick={doAdvance} size="lg" className="w-full">
              Confirm update <ArrowRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Doc dialog */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload document</DialogTitle>
            <DialogDescription>Mock upload. The file name is stored and a sample PDF is generated for download.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Document type">
              <NativeSelect value={docType} onChange={(e) => setDocType(e.target.value as DocType)}>
                {(["Bill of Lading", "Title", "Invoice", "Customs Papers", "Other"] as DocType[]).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="File">
              <Input type="file" accept=".pdf,image/*" className="pt-2.5" onChange={(e) => setDocName(e.target.files?.[0]?.name ?? "")} />
            </Field>
            <Field label="Display name (optional)">
              <Input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder={`${docType}: ${s.id}.pdf`} />
            </Field>
            <Button onClick={addDoc} size="lg" className="w-full">
              <Upload /> Upload document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
