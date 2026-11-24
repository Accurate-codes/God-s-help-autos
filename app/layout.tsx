import type { Metadata, Viewport } from "next";
import "@fontsource/archivo-black";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import "./globals.css";
import { Toaster } from "sonner";
import { DataProvider } from "@/lib/store";
import { DemoBanner } from "@/components/site/demo-banner";

export const metadata: Metadata = {
  title: {
    default: "God's Help Autos | Buy. Ship. Clear. Drive.",
    template: "%s | God's Help Autos",
  },
  description:
    "God's Help Autos, Ojodu Berger, Lagos. We sell cars and handle shipping from the USA, Canada and Europe, customs clearing at Apapa and Tin Can, and delivery anywhere in Nigeria.",
};

export const viewport: Viewport = {
  themeColor: "#EEF6FC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body className="min-h-dvh">
        <DataProvider>
          <DemoBanner />
          {children}
          <Toaster position="top-center" richColors closeButton toastOptions={{ style: { borderRadius: 16 } }} />
        </DataProvider>
      </body>
    </html>
  );
}
