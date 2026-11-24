"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

/** Solid navbar on inner pages. The home page renders its own transparent navbar inside the hero. */
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Navbar variant="solid" />;
}
