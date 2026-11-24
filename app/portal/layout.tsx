"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Car, LogOut, Phone } from "lucide-react";
import { useState } from "react";
import { FullPageLoader, LoginCard } from "@/components/site/login-card";
import { Wordmark } from "@/components/site/navbar";
import { NotificationsSheet } from "@/components/portal/notifications";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/format";
import { telLink } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, session, db, logout } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!hydrated) return <FullPageLoader />;
  if (session?.role !== "customer") return <LoginCard role="customer" />;

  const me = db.customers.find((c) => c.id === session.customerId);
  const unread = db.notifications.filter((n) => n.customerId === session.customerId && !n.read).length;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-background/80 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-3 sm:h-[72px]">
          <div className="flex items-center gap-6">
            <Wordmark className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
            <nav className="flex items-center gap-1">
              <Link href="/portal" className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold transition", pathname.startsWith("/portal") ? "bg-black text-white" : "hover:bg-black/5")}>
                <Car className="size-4" /> My Cars
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Call us">
              <a href={telLink()}>
                <Phone />
              </a>
            </Button>
            <button onClick={() => setOpen(true)} className="relative grid size-10 place-items-center rounded-full bg-white ring-1 ring-black/10 transition hover:ring-black/30" aria-label={`Notifications (${unread} unread)`}>
              <Bell className="size-[18px]" />
              {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-black text-black ring-2 ring-background">{unread}</span>}
            </button>
            <div className="ml-1 flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-full bg-navy text-xs font-bold text-white">{initials(me?.name ?? "C")}</span>
              <div className="hidden leading-tight md:block">
                <p className="text-sm font-semibold">{me?.name}</p>
                <p className="text-xs text-muted-foreground">{session.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out" title="Sign out">
              <LogOut />
            </Button>
          </div>
        </div>
      </header>
      <main className="container-x py-8 sm:py-12">{children}</main>
      <NotificationsSheet open={open} onOpenChange={setOpen} customerId={session.customerId} />
      <WhatsAppFloat />
    </div>
  );
}
