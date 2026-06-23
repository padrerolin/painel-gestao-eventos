"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { CHECKIN_MESSAGES } from "@/lib/rules";
import { useCheckinStore, type CheckinOutcome } from "@/store/checkin-store";
import type { EventDetail, Participant } from "@/lib/types";

/**
 * Liga a UI à regra de negócio: registra a ação no store e dá o feedback
 * (toast) correspondente a cada resultado, conforme a tabela do enunciado.
 */
export function useCheckin() {
  const register = useCheckinStore((s) => s.register);

  return useCallback(
    (event: EventDetail, participant: Participant): CheckinOutcome => {
      const result = register(event, participant);

      if (result.ok) {
        toast.success(
          result.action === "entry"
            ? CHECKIN_MESSAGES.entrySuccess
            : CHECKIN_MESSAGES.exitSuccess,
        );
      } else {
        toast.error(CHECKIN_MESSAGES[result.reason]);
      }

      return result;
    },
    [register],
  );
}
