import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventStatusBadge } from "./status-badge";
import { formatDate } from "@/lib/format";
import type { EventSummary } from "@/lib/types";

export function EventCard({ event }: { event: EventSummary }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="focus-visible:ring-ring/50 rounded-xl outline-none focus-visible:ring-2"
      aria-label={`Abrir evento ${event.name}`}
    >
      <Card className="hover:border-primary/40 h-full gap-3 transition-colors hover:shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base leading-snug">
              {event.name}
            </CardTitle>
            <EventStatusBadge status={event.status} />
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Users className="size-4 shrink-0" />
            <span>{event.expected_count} participantes esperados</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
