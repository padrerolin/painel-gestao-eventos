"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, RotateCcw } from "lucide-react";
import { useEvent, useEffectiveEvent } from "@/hooks/use-events";
import { useCheckinStore } from "@/store/checkin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/states";
import { EventStatusBadge } from "@/components/events/status-badge";
import { formatDate } from "@/lib/format";
import { MetricsGrid } from "./metrics-grid";
import { EntriesOverTimeChart, SuccessErrorChart } from "./event-charts";
import { ParticipantsTable } from "./participants-table";
import { CheckinHistory } from "./checkin-history";

function BackLink() {
  return (
    <Link
      href="/events"
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
    >
      <ArrowLeft className="size-4" />
      Voltar para eventos
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function EventDashboard({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useEvent(id);
  const event = useEffectiveEvent(data);
  const resetEvent = useCheckinStore((s) => s.resetEvent);
  const hasOverlay = useCheckinStore((s) => Boolean(s.overlays[id]));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <BackLink />
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          title="Evento não encontrado"
          description="Não foi possível carregar os dados deste evento."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {event.name}
            </h1>
            <EventStatusBadge status={event.status} />
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.location}
            </span>
          </div>
          {event.description ? (
            <p className="text-muted-foreground max-w-2xl text-sm">
              {event.description}
            </p>
          ) : null}
        </div>

        {hasOverlay ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetEvent(id)}
            className="shrink-0"
          >
            <RotateCcw className="size-4" />
            Reiniciar simulação
          </Button>
        ) : null}
      </header>

      <MetricsGrid event={event} />

      <div className="grid gap-4 lg:grid-cols-2">
        <EntriesOverTimeChart checkins={event.checkins} />
        <SuccessErrorChart checkins={event.checkins} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ParticipantsTable event={event} />
        </div>
        <CheckinHistory event={event} />
      </div>
    </div>
  );
}
