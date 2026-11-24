"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-black/[0.05] p-1", className)} {...props} />;
}
export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn("whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold text-muted-foreground transition data-[state=active]:bg-black data-[state=active]:text-white", className)}
      {...props}
    />
  );
}
export const TabsContent = TabsPrimitive.Content;
