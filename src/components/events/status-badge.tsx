import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EVENT_STATUS_LABEL } from "@/lib/format";
import type { EventStatus } from "@/lib/types";

const STATUS_STYLES: Record<EventStatus, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  closed:
    "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  cancelled:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

export function EventStatusBadge({
  status,
  className,
}: {
  status: EventStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5", STATUS_STYLES[status], className)}
    >
      <span
        className={cn("size-1.5 rounded-full", {
          "bg-emerald-500": status === "active",
          "bg-zinc-400": status === "closed",
          "bg-red-500": status === "cancelled",
        })}
      />
      {EVENT_STATUS_LABEL[status]}
    </Badge>
  );
}
