import { cn } from "@/lib/utils";
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-xl bg-black/[0.06]", className)} {...props} />;
}
