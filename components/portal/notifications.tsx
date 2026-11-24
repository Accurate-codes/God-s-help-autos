"use client";
import Link from "next/link";
import { BellOff, CheckCheck, CircleDot } from "lucide-react";
import { Dialog, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export function NotificationsSheet({ open, onOpenChange, customerId }: { open: boolean; onOpenChange: (o: boolean) => void; customerId: string }) {
  const { db, markNotificationsRead } = useStore();
  const list = db.notifications.filter((n) => n.customerId === customerId).sort((a, b) => b.date.localeCompare(a.date));
  const unread = list.filter((n) => !n.read).length;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined}>
        <div className="border-b border-black/5 p-5 pr-16">
          <DialogTitle className="text-lg font-bold">Notifications</DialogTitle>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{unread ? `${unread} unread update${unread > 1 ? "s" : ""}` : "You're all caught up"}</p>
            {unread > 0 && (
              <button onClick={() => markNotificationsRead(customerId)} className="inline-flex items-center gap-1 text-xs font-semibold hover:underline">
                <CheckCheck className="size-3.5" /> Mark all read
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {list.length === 0 ? (
            <div className="grid h-full place-items-center p-10 text-center text-muted-foreground">
              <div>
                <BellOff className="mx-auto size-8" />
                <p className="mt-3 text-sm">No notifications yet</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-black/5">
              {list.map((n) => (
                <li key={n.id}>
                  <Link href={n.shipmentId ? `/portal/cars/${n.shipmentId}` : "/portal"} onClick={() => onOpenChange(false)} className={cn("flex gap-3 p-5 transition hover:bg-black/[0.02]", !n.read && "bg-gold-soft/30")}>
                    <CircleDot className={cn("mt-0.5 size-4 shrink-0", n.read ? "text-black/20" : "text-gold")} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground/80">{timeAgo(n.date)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Dialog>
  );
}
