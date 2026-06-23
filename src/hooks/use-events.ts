"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvent, getEvents } from "@/lib/api";
import { applyOverlay, useCheckinStore } from "@/store/checkin-store";
import type { EventDetail } from "@/lib/types";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    select: (res) => res.data,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
    enabled: Boolean(id),
  });
}

/**
 * Combina o detalhe da API com a camada de simulação local (overlay),
 * devolvendo o estado EFETIVO consumido por cards, gráficos e tabela.
 */
export function useEffectiveEvent(
  detail: EventDetail | undefined,
): EventDetail | undefined {
  const overlay = useCheckinStore((s) =>
    detail ? s.overlays[detail.id] : undefined,
  );

  return useMemo(
    () => (detail ? applyOverlay(detail, overlay) : undefined),
    [detail, overlay],
  );
}
