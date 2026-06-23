"use client";

import { useMemo, useState } from "react";
import { CalendarX } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/common/states";
import { EventCard } from "./event-card";
import {
  EventFilters,
  type SortOrder,
  type StatusFilter,
} from "./event-filters";

function EventCardSkeleton() {
  return (
    <Card className="gap-3">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
      </CardContent>
    </Card>
  );
}

export function EventList() {
  const { data, isLoading, isError, refetch } = useEvents();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOrder>("date-desc");

  const debouncedSearch = useDebounce(search, 300);

  const visibleEvents = useMemo(() => {
    if (!data) return [];
    const term = debouncedSearch.trim().toLowerCase();

    return data
      .filter((event) => {
        const matchesSearch = event.name.toLowerCase().includes(term);
        const matchesStatus = status === "all" || event.status === status;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const diff =
          new Date(a.date).getTime() - new Date(b.date).getTime();
        return sort === "date-asc" ? diff : -diff;
      });
  }, [data, debouncedSearch, status, sort]);

  return (
    <div className="space-y-5">
      <EventFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          description="Não foi possível carregar a lista de eventos."
          onRetry={() => refetch()}
        />
      ) : visibleEvents.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="Nenhum evento encontrado"
          description={
            data && data.length > 0
              ? "Tente ajustar a busca ou os filtros aplicados."
              : "Ainda não há eventos cadastrados."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
