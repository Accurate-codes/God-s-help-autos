"use client";
import { motion } from "framer-motion";
import { waLink } from "@/lib/config";
import { WhatsAppIcon } from "./whatsapp-icon";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={waLink("Hello God's Help Autos, I'd like to make an enquiry.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_32px_-8px_rgba(37,211,102,0.7)] transition hover:pr-5 sm:bottom-7 sm:right-7"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
      <WhatsAppIcon className="size-7" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-40 sm:inline">Chat with us</span>
    </motion.a>
  );
}
