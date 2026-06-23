"use client";

import { useMemo, useState } from "react";
import { Crown, Info, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  PARTICIPANT_STATUS_LABEL,
  PARTICIPANT_TYPE_LABEL,
} from "@/lib/format";
import { isEventBlocked } from "@/lib/rules";
import type { EventDetail, Participant } from "@/lib/types";
import { CheckinButton } from "./checkin-button";
import { EmptyState } from "@/components/common/states";

function TypeBadge({ type }: { type: Participant["type"] }) {
  if (type === "vip") {
    return (
      <Badge className="gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
        <Crown className="size-3" />
        {PARTICIPANT_TYPE_LABEL.vip}
      </Badge>
    );
  }
  return <Badge variant="secondary">{PARTICIPANT_TYPE_LABEL.normal}</Badge>;
}

function StatusDot({ status }: { status: Participant["status"] }) {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span
        className={cn(
          "size-2 rounded-full",
          status === "inside" ? "bg-emerald-500" : "bg-zinc-300",
        )}
      />
      {PARTICIPANT_STATUS_LABEL[status]}
    </span>
  );
}

export function ParticipantsTable({ event }: { event: EventDetail }) {
  const [search, setSearch] = useState("");
  const blocked = isEventBlocked(event.status);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return event.participants;
    return event.participants.filter((p) =>
      p.name.toLowerCase().includes(term),
    );
  }, [event.participants, search]);

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4" />
            Participantes
            <span className="text-muted-foreground font-normal">
              ({event.participants.length})
            </span>
          </CardTitle>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar participante..."
            className="sm:w-56"
            aria-label="Buscar participante"
          />
        </div>
        {blocked ? (
          <p className="text-muted-foreground flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm">
            <Info className="size-4 shrink-0" />
            {event.status === "cancelled"
              ? "Evento cancelado — check-ins desabilitados."
              : "Evento encerrado — não é possível registrar novas entradas."}
          </p>
        ) : null}
      </CardHeader>

      <CardContent>
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum participante encontrado"
            description="Ajuste a busca para ver os participantes."
          />
        ) : (
          <>
            {/* Desktop: tabela */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Check-ins</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <TypeBadge type={p.type} />
                      </TableCell>
                      <TableCell>
                        <StatusDot status={p.status} />
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {p.checkin_count}
                      </TableCell>
                      <TableCell className="text-right">
                        <CheckinButton event={event} participant={p} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: cards empilhados */}
            <ul className="space-y-3 md:hidden">
              {filtered.map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border p-3 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium">{p.name}</p>
                      <StatusDot status={p.status} />
                    </div>
                    <TypeBadge type={p.type} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      {p.checkin_count} check-in(s)
                    </span>
                    <CheckinButton event={event} participant={p} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
