import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-ring/20 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-black/85 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]",
        gold: "bg-gold text-black hover:brightness-105 shadow-[0_8px_24px_-10px_rgba(212,162,76,0.8)]",
        navy: "bg-navy text-white hover:bg-navy-2",
        outline: "border border-black/15 bg-white text-foreground hover:bg-black hover:text-white",
        outlineLight: "border border-white/60 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-black",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "hover:bg-black/5",
        whatsapp: "bg-[#25D366] text-white hover:brightness-95 shadow-[0_8px_24px_-10px_rgba(37,211,102,0.8)]",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-foreground underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-13 px-8 text-[15px]",
        xl: "h-14 px-9 text-base",
        icon: "size-10",
        iconSm: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
