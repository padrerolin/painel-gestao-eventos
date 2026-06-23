import {
  AlertTriangle,
  LogIn,
  Percent,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { computeMetrics } from "@/lib/metrics";
import { formatPercent } from "@/lib/format";
import type { EventDetail } from "@/lib/types";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent: string;
}

function MetricCard({ icon: Icon, label, value, hint, accent }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          {hint ? (
            <p className="text-muted-foreground text-xs">{hint}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            accent,
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

export function MetricsGrid({ event }: { event: EventDetail }) {
  const metrics = computeMetrics(event);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={Users}
        label="Participantes esperados"
        value={metrics.expected}
        accent="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
      />
      <MetricCard
        icon={LogIn}
        label="Check-ins realizados"
        value={metrics.checkins}
        hint={`${metrics.currentlyInside} dentro agora`}
        accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
      />
      <MetricCard
        icon={AlertTriangle}
        label="Tentativas com erro"
        value={metrics.errors}
        accent="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
      />
      <MetricCard
        icon={Percent}
        label="Taxa de entrada"
        value={formatPercent(metrics.entryRate)}
        accent="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
      />
    </div>
  );
}
