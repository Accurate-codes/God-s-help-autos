"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Banknote, Car, CheckCircle2, FileSearch, Inbox, Receipt, Ship, Sparkles, Users } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/ui";
import { StageBadge } from "@/components/site/stage-timeline";
import { Button } from "@/components/ui/button";
import { monthlyHistory } from "@/lib/data";
import { naira, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import { STAGES } from "@/lib/types";

const NAVY = "#24406f";
const GOLD = "#d4a24c";

function ChartTooltip({ active, payload, label, money }: { active?: boolean; payload?: { value: number }[]; label?: string; money?: boolean }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-[#0a0f1c] px-3 py-2 text-xs text-white shadow-xl">
      <p className="text-white/60">{label}</p>
      <p className="mt-0.5 text-sm font-bold">{money ? naira(payload[0].value) : `${payload[0].value} shipments`}</p>
    </div>
  );
}

export default function AdminOverview() {
  const { db } = useStore();

  const kpi = useMemo(() => {
    const inTransit = db.shipments.filter((s) => s.stage >= 1 && s.stage <= 4).length;
    const clearing = db.shipments.filter((s) => s.stage >= 5 && s.stage <= 7).length;
    const months = [new Date().toISOString().slice(0, 7), "2026-11"];
    const deliveredThisMonth = db.shipments.filter((s) => s.stage === 8 && months.some((m) => (s.history[8]?.date ?? "").startsWith(m))).length;
    const inStock = db.cars.filter((c) => c.status === "available").length;
    const outstanding = db.shipments.reduce((a, s) => a + Math.max(0, s.totalNGN - s.paidNGN), 0);
    return { inTransit, clearing, deliveredThisMonth, inStock, outstanding };
  }, [db]);

  const chart = useMemo(() => {
    const novShipments = db.shipments.filter((s) => s.createdAt >= "2026-11-01").length + 9;
    const novRevenue = db.invoices.filter((i) => i.status === "paid" && (i.paidAt ?? "") >= "2026-11-01").reduce((a, i) => a + i.items.reduce((x, y) => x + y.amount, 0), 0);
    return [...monthlyHistory, { month: "Nov", shipments: novShipments, revenue: Math.max(novRevenue, 120_000_000) }];
  }, [db]);

  const stageCounts = STAGES.map((name, i) => ({ name, count: db.shipments.filter((s) => s.stage === i).length }));
  const maxStage = Math.max(...stageCounts.map((s) => s.count), 1);
  const newInbox = db.inquiries.filter((q) => q.status === "new");
  const recent = db.shipments.slice().sort((a, b) => (b.history.at(-1)?.date ?? "").localeCompare(a.history.at(-1)?.date ?? "")).slice(0, 5);

  const cards = [
    { label: "Cars in transit", value: kpi.inTransit, icon: Ship, href: "/admin/shipments?f=transit" },
    { label: "In clearing", value: kpi.clearing, icon: FileSearch, href: "/admin/shipments?f=clearing" },
    { label: "Delivered this month", value: kpi.deliveredThisMonth, icon: CheckCircle2, href: "/admin/shipments?f=delivered" },
    { label: "Cars in stock", value: kpi.inStock, icon: Car, href: "/admin/inventory" },
    { label: "Outstanding payments", value: naira(kpi.outstanding, { compact: true }), icon: Banknote, href: "/admin/invoices", dark: true, sub: naira(kpi.outstanding) },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Good day! Here's what's happening at God's Help Autos today."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/inbox">
                <Inbox /> Inbox {newInbox.length > 0 && <span className="rounded-full bg-gold px-1.5 text-[10px] font-black text-black">{newInbox.length}</span>}
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/shipments">
                <Ship /> Manage shipments
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={c.dark ? "col-span-2 lg:col-span-1" : ""}>
            <Link href={c.href} className={`group block h-full rounded-[24px] p-5 ring-1 transition hover:-translate-y-0.5 ${c.dark ? "bg-[#0a0f1c] text-white ring-transparent" : "bg-white ring-black/[0.04] shadow-[0_12px_32px_-16px_rgba(15,31,61,0.12)]"}`}>
              <div className="flex items-center justify-between">
                <span className={`grid size-10 place-items-center rounded-2xl ${c.dark ? "bg-white/10 text-gold" : "bg-[#eef6fc] text-navy"}`}>
                  <c.icon className="size-[18px]" />
                </span>
                <ArrowRight className="size-4 opacity-0 transition group-hover:opacity-50" />
              </div>
              <p className="mt-5 text-3xl font-extrabold tracking-tight">{c.value}</p>
              <p className={`mt-0.5 text-sm ${c.dark ? "text-white/60" : "text-muted-foreground"}`}>{c.label}</p>
              {c.sub && <p className="mt-1 text-xs text-white/40">{c.sub}</p>}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold">Shipments per month</p>
              <p className="text-sm text-muted-foreground">New shipments booked over the last 12 months</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">+18% YoY</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="#eef1f5" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6675" }} interval={0} tickFormatter={(m: string, i: number) => (i % 2 === 0 || i === chart.length - 1 ? m : "")} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6675" }} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(15,31,61,0.05)" }} content={<ChartTooltip />} />
                <Bar dataKey="shipments" radius={[4, 4, 0, 0]}>
                  {chart.map((d, i) => (
                    <Cell key={d.month} fill={i === chart.length - 1 ? GOLD : NAVY} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold">Revenue</p>
              <p className="text-sm text-muted-foreground">Payments received per month (₦)</p>
            </div>
            <p className="text-right text-sm">
              <span className="block text-lg font-extrabold">{naira(chart.reduce((a, c) => a + c.revenue, 0), { compact: true })}</span>
              <span className="text-xs text-muted-foreground">12-month total</span>
            </p>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="#eef1f5" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6675" }} interval={0} tickFormatter={(m: string, i: number) => (i % 2 === 0 || i === chart.length - 1 ? m : "")} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6675" }} tickFormatter={(v: number) => naira(v, { compact: true })} />
                <Tooltip cursor={{ fill: "rgba(15,31,61,0.05)" }} content={<ChartTooltip money />} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {chart.map((d, i) => (
                    <Cell key={d.month} fill={i === chart.length - 1 ? GOLD : "#111111"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="p-5 sm:p-6">
          <p className="font-bold">Pipeline by stage</p>
          <ul className="mt-5 space-y-2.5">
            {stageCounts.map((s, i) => (
              <li key={s.name}>
                <Link href={`/admin/shipments?stage=${i}`} className="group flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 truncate text-muted-foreground group-hover:text-foreground">{s.name}</span>
                  <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                    <motion.span initial={{ width: 0 }} animate={{ width: `${(s.count / maxStage) * 100}%` }} transition={{ delay: 0.2 + i * 0.04, duration: 0.6 }} className="absolute inset-y-0 left-0 rounded-full bg-navy" />
                  </span>
                  <span className="w-6 text-right font-semibold tabular-nums">{s.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="font-bold">Recent activity</p>
            <Sparkles className="size-4 text-gold" />
          </div>
          <ul className="mt-4 space-y-4">
            {db.activity.slice(0, 7).map((a) => {
              const Icon = a.kind === "payment" ? Banknote : a.kind === "inquiry" ? Inbox : a.kind === "inventory" ? Car : a.kind === "invoice" ? Receipt : a.kind === "customer" ? Users : Ship;
              return (
                <li key={a.id} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eef6fc] text-navy">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(a.date)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="font-bold">Latest shipment updates</p>
            <Link href="/admin/shipments" className="text-xs font-semibold hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-black/5">
            {recent.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/shipments/${s.id}`} className="flex items-center gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt="" className="h-10 w-14 shrink-0 rounded-lg bg-[#e6edf4] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {s.year} {s.make} {s.model}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">{s.id}</p>
                  </div>
                  <StageBadge stage={s.stage} className="hidden sm:inline-flex" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
