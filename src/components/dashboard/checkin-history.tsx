"use client";

import { useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/format";
import type { EventDetail } from "@/lib/types";

const ERROR_LABEL: Record<string, string> = {
  already_checked_in: "Já havia feito check-in",
  event_closed: "Evento encerrado",
};

export function CheckinHistory({ event }: { event: EventDetail }) {
  const names = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of event.participants) map.set(p.id, p.name);
    return map;
  }, [event.participants]);

  const items = useMemo(
    () =>
      [...event.checkins]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 12),
    [event.checkins],
  );

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-base">Histórico de check-ins</CardTitle>
        <CardDescription>Entradas, saídas e tentativas recentes</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Nenhuma movimentação registrada.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((c) => {
              const name = names.get(c.participant_id) ?? c.participant_id;
              const isError = !c.success;
              const isEntry = c.action === "entry";
              const Icon = isError
                ? XCircle
                : isEntry
                  ? ArrowDownLeft
                  : ArrowUpRight;

              return (
                <li key={c.id} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      isError
                        ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                        : isEntry
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{name}</p>
                    <p className="text-muted-foreground text-xs">
                      {isError
                        ? `Tentativa recusada — ${ERROR_LABEL[c.error_reason ?? ""] ?? "erro"}`
                        : isEntry
                          ? "Entrou no evento"
                          : "Saiu do evento"}
                    </p>
                  </div>
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {formatTime(c.timestamp)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
