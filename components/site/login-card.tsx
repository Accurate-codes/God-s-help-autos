"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { Wordmark } from "./navbar";

export function LoginCard({ role }: { role: "customer" | "admin" }) {
  const { login } = useStore();
  const demo = role === "customer" ? { email: "customer@demo.com", password: "demo123" } : { email: "admin@demo.com", password: "admin123" };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e?: React.FormEvent, creds = { email, password }) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(creds.email, creds.password, role);
      setLoading(false);
      if (ok) toast.success(role === "customer" ? "Welcome back, Chinedu!" : "Signed in as staff");
      else toast.error("Incorrect email or password", { description: `Use the demo login: ${demo.email} / ${demo.password}` });
    }, 600);
  };

  return (
    <div className="grid min-h-[calc(100dvh-36px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#070b14] lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-car.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-bottom opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Wordmark light />
          <p className="font-display text-7xl xl:text-8xl">
            {role === "customer" ? (
              <>
                Your car.
                <br />
                Every step.
              </>
            ) : (
              <>
                Run the
                <br />
                yard.
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="lg:hidden">
            <Wordmark />
          </span>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Website
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto my-auto w-full max-w-sm py-10">
          <p className="eyebrow">
            <span className="h-px w-6 bg-gold" /> {role === "customer" ? "Customer portal" : "Staff dashboard"}
          </p>
          <h1 className="mt-4 font-display text-5xl">Sign in</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {role === "customer" ? "Track your cars, view documents and see your payments." : "Manage shipments, inventory, customers and invoices."}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field label="Email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={demo.email} autoComplete="email" />
            </Field>
            <Field label="Password">
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </Field>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <LogIn />} Sign in
            </Button>
          </form>
          <button
            onClick={() => {
              setEmail(demo.email);
              setPassword(demo.password);
              submit(undefined, demo);
            }}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-gold/60 bg-gold-soft/50 p-4 text-left text-sm transition hover:bg-gold-soft"
          >
            <KeyRound className="size-5 shrink-0 text-[#7a5410]" />
            <span>
              <span className="block font-semibold text-[#5c3f0b]">Use demo login</span>
              <span className="font-mono text-xs text-[#7a5410]">
                {demo.email} / {demo.password}
              </span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
