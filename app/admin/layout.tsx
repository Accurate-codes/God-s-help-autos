"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, ExternalLink, FileText, Inbox, LayoutDashboard, LogOut, Menu, Settings, Ship, Users } from "lucide-react";
import { FullPageLoader, LoginCard } from "@/components/site/login-card";
import { Wordmark } from "@/components/site/navbar";
import { Dialog, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function useNav() {
  const { db } = useStore();
  const newInbox = db.inquiries.filter((q) => q.status === "new").length;
  const unpaid = db.invoices.filter((i) => i.status === "unpaid").length;
  return [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/shipments", label: "Shipments", icon: Ship, count: db.shipments.filter((s) => s.stage < 8).length },
    { href: "/admin/inventory", label: "Inventory", icon: Car, count: db.cars.filter((c) => c.status === "available").length },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/inbox", label: "Inbox", icon: Inbox, count: newInbox, highlight: newInbox > 0 },
    { href: "/admin/invoices", label: "Invoices", icon: FileText, count: unpaid },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const nav = useNav();
  const { logout, session } = useStore();
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Wordmark light />
        <p className="mt-2 pl-[42px] text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Staff dashboard</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((n) => {
          const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              className={cn("relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition", active ? "text-black" : "text-white/70 hover:bg-white/5 hover:text-white")}
            >
              {active && <motion.span layoutId="admin-nav" className="absolute inset-0 -z-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <n.icon className="relative size-[18px]" />
              <span className="relative flex-1">{n.label}</span>
              {n.count !== undefined && n.count > 0 && (
                <span className={cn("relative rounded-full px-2 py-0.5 text-[11px] font-bold", n.highlight ? "bg-gold text-black" : active ? "bg-black/10" : "bg-white/10")}>{n.count}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-[18px]" /> View website
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white">
          <LogOut className="size-[18px]" /> Sign out
        </button>
        <p className="truncate px-4 pt-2 text-xs text-white/40">{session?.email}</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, session } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  if (!hydrated) return <FullPageLoader />;
  if (session?.role !== "admin") return <LoginCard role="admin" />;

  return (
    <div className="min-h-[calc(100dvh-36px)] lg:pl-64">
      <aside className="fixed bottom-0 left-0 top-9 hidden w-64 bg-[#0a0f1c] lg:block">
        <SidebarNav />
      </aside>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/5 bg-background/85 px-4 backdrop-blur-xl lg:hidden">
        <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full bg-black text-white" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
        <Wordmark className="[&>span:last-child]:text-[12px]" />
        <span className="size-10" />
      </header>
      <Dialog open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-[#0a0f1c] [&>button]:bg-white/10 [&>button]:text-white" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Dialog>
      <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {children}
      </motion.main>
    </div>
  );
}
