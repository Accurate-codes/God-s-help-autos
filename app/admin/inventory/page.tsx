"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CarFront, ExternalLink, Pencil, Plus, Search, Star, Tag, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Panel } from "@/components/admin/ui";
import { conditionVariant } from "@/components/site/car-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { CAR_COLORS, carImages, type CarColor } from "@/lib/data";
import { km, naira } from "@/lib/format";
import { fileToDataUrl } from "@/lib/image";
import { useStore } from "@/lib/store";
import type { BodyType, Car, Condition } from "@/lib/types";
import { cn, uid } from "@/lib/utils";

const blank = (): Car => ({
  id: uid("car"),
  make: "",
  model: "",
  trim: "",
  year: 2020,
  mileage: 0,
  price: 0,
  condition: "Foreign Used",
  location: "Ojodu Berger, Lagos",
  bodyType: "Sedan",
  transmission: "Automatic",
  fuel: "Petrol",
  engine: "",
  color: "",
  images: carImages("silver"),
  featured: false,
  status: "available",
  description: "",
  createdAt: new Date().toISOString(),
});

const SWATCH: Record<CarColor, string> = { white: "#f0f0f0", silver: "#b4bac2", black: "#0c0c0e", navy: "#1a2a48", red: "#8f0f12", grey: "#5a6069", champagne: "#b49a6c", blue: "#1f4f9a", green: "#1f3b2e" };

export default function InventoryPage() {
  const { db, saveCar, deleteCar } = useStore();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"available" | "sold" | "all">("available");
  const [editing, setEditing] = useState<Car | null>(null);
  const [isNew, setIsNew] = useState(false);

  const cars = useMemo(() => {
    const t = q.toLowerCase();
    return db.cars.filter((c) => (tab === "all" || c.status === tab) && (!t || `${c.year} ${c.make} ${c.model} ${c.trim}`.toLowerCase().includes(t)));
  }, [db.cars, q, tab]);

  const stockValue = db.cars.filter((c) => c.status === "available").reduce((a, c) => a + c.price, 0);

  const toggleSold = (c: Car) => {
    const next = { ...c, status: c.status === "sold" ? "available" : "sold" } as Car;
    saveCar(next);
    toast.success(next.status === "sold" ? `${c.make} ${c.model} marked as sold` : `${c.make} ${c.model} is back in stock`, { description: "The public Cars for Sale page has been updated." });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const car = { ...editing, description: editing.description || `${editing.year} ${editing.make} ${editing.model} ${editing.trim}. Inspected by the God's Help Autos team. Test drives are available at our Ojodu Berger yard.` };
    saveCar(car);
    toast.success(isNew ? "Car added to inventory" : "Car updated", { description: `${car.year} ${car.make} ${car.model} is live on the website.` });
    setEditing(null);
  };

  const set = <K extends keyof Car>(k: K, v: Car[K]) => setEditing((p) => (p ? { ...p, [k]: v } : p));

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle={`${db.cars.filter((c) => c.status === "available").length} cars in stock · ${naira(stockValue, { compact: true })} stock value`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/cars" target="_blank">
                <ExternalLink /> Public page
              </Link>
            </Button>
            <Button
              onClick={() => {
                setIsNew(true);
                setEditing(blank());
              }}
            >
              <Plus /> Add car
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search inventory…" className="h-11 pl-11" />
        </div>
        <div className="flex gap-1 rounded-full bg-black/[0.05] p-1">
          {(["available", "sold", "all"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("flex-1 rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition sm:flex-none", tab === t ? "bg-black text-white" : "text-muted-foreground")}>
              {t === "available" ? "In stock" : t}
            </button>
          ))}
        </div>
      </div>

      {cars.length === 0 ? (
        <Panel>
          <EmptyState icon={CarFront} title="No cars here" text={tab === "sold" ? "Cars you mark as sold will appear here." : "Add a car to list it on the website."} />
        </Panel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cars.map((c) => (
            <Panel key={c.id} className="overflow-hidden">
              <div className="relative aspect-[16/10] bg-[#e6edf4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.images[0]} alt="" className={cn("h-full w-full object-cover", c.status === "sold" && "opacity-60 grayscale")} />
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <Badge variant={conditionVariant(c.condition)}>{c.condition}</Badge>
                  {c.status === "sold" && <Badge variant="red">Sold</Badge>}
                </div>
                {c.featured && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase">
                    <Star className="size-3 fill-gold text-gold" /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold">
                  {c.year} {c.make} {c.model} <span className="text-muted-foreground">{c.trim}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {c.mileage ? km(c.mileage) : "New"} · {c.bodyType} · {c.location}
                </p>
                <p className="mt-2 text-lg font-extrabold">{naira(c.price)}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsNew(false);
                      setEditing(c);
                    }}
                  >
                    <Pencil /> Edit
                  </Button>
                  <Button size="sm" variant={c.status === "sold" ? "outline" : "default"} className="flex-1" onClick={() => toggleSold(c)}>
                    {c.status === "sold" ? (
                      <>
                        <Undo2 /> Relist
                      </>
                    ) : (
                      <>
                        <Tag /> Mark sold
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add a car" : "Edit car"}</DialogTitle>
            <DialogDescription>Changes appear on the public Cars for Sale page straight away.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
              <Field label="Make">
                <Input required value={editing.make} onChange={(e) => set("make", e.target.value)} placeholder="Toyota" />
              </Field>
              <Field label="Model">
                <Input required value={editing.model} onChange={(e) => set("model", e.target.value)} placeholder="Camry" />
              </Field>
              <Field label="Trim">
                <Input value={editing.trim} onChange={(e) => set("trim", e.target.value)} placeholder="SE" />
              </Field>
              <Field label="Year">
                <Input required type="number" value={editing.year} onChange={(e) => set("year", Number(e.target.value))} />
              </Field>
              <Field label="Mileage (km)">
                <Input type="number" value={editing.mileage} onChange={(e) => set("mileage", Number(e.target.value))} />
              </Field>
              <Field label="Price (₦)">
                <Input required type="number" value={editing.price || ""} onChange={(e) => set("price", Number(e.target.value))} placeholder="25000000" />
              </Field>
              <Field label="Condition">
                <NativeSelect value={editing.condition} onChange={(e) => set("condition", e.target.value as Condition)}>
                  {["Foreign Used", "Nigerian Used", "Brand New"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Body type">
                <NativeSelect value={editing.bodyType} onChange={(e) => set("bodyType", e.target.value as BodyType)}>
                  {["Sedan", "SUV", "Crossover", "Minivan", "Pickup"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Fuel">
                <NativeSelect value={editing.fuel} onChange={(e) => set("fuel", e.target.value as Car["fuel"])}>
                  {["Petrol", "Diesel", "Hybrid"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Engine">
                <Input value={editing.engine} onChange={(e) => set("engine", e.target.value)} placeholder="2.5L 4-cylinder" />
              </Field>
              <Field label="Colour name">
                <Input value={editing.color} onChange={(e) => set("color", e.target.value)} placeholder="Super White" />
              </Field>
              <Field label="Location">
                <Input value={editing.location} onChange={(e) => set("location", e.target.value)} />
              </Field>
              <Field label="Photos" className="sm:col-span-3" hint="Pick a placeholder colour set, or upload your own photo.">
                <div className="flex flex-wrap items-center gap-2">
                  {CAR_COLORS.map((col) => (
                    <button
                      type="button"
                      key={col}
                      title={col}
                      onClick={() => set("images", carImages(col))}
                      className={cn("size-8 rounded-full ring-2 ring-offset-2 transition", editing.images[0] === carImages(col)[0] ? "ring-black" : "ring-transparent")}
                      style={{ background: SWATCH[col] }}
                    />
                  ))}
                  <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold hover:bg-black/10">
                    <Plus className="size-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const url = await fileToDataUrl(f, 1000);
                        set("images", [url, ...editing.images.filter((i) => i.startsWith("/cars/")).slice(0, 3)]);
                      }}
                    />
                  </label>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editing.images[0]} alt="" className="ml-auto h-12 w-16 rounded-lg bg-[#e6edf4] object-cover" />
                </div>
              </Field>
              <Field label="Description (optional)" className="sm:col-span-3">
                <Textarea value={editing.description} onChange={(e) => set("description", e.target.value)} rows={3} />
              </Field>
              <label className="flex items-center gap-2 text-sm sm:col-span-3">
                <input type="checkbox" checked={editing.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-black" /> Feature on the home page
              </label>
              <div className="flex gap-2 sm:col-span-3">
                {!isNew && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      deleteCar(editing.id);
                      setEditing(null);
                      toast.success("Car removed from inventory");
                    }}
                  >
                    <Trash2 /> Delete
                  </Button>
                )}
                <Button type="submit" size="lg" className="ml-auto">
                  {isNew ? "Add car" : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
