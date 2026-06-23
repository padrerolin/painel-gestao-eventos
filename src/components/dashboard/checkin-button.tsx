"use client";

import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCheckinButtonState } from "@/lib/rules";
import { useCheckin } from "@/hooks/use-checkin";
import type { EventDetail, Participant } from "@/lib/types";

export function CheckinButton({
  event,
  participant,
}: {
  event: EventDetail;
  participant: Participant;
}) {
  const checkin = useCheckin();
  const state = getCheckinButtonState(event.status, participant);
  const Icon = state.action === "entry" ? LogIn : LogOut;

  return (
    <Button
      size="sm"
      variant={state.action === "exit" ? "outline" : "default"}
      disabled={state.disabled}
      title={state.disabledReason}
      onClick={() => checkin(event, participant)}
      aria-label={`${state.label}: ${participant.name}`}
    >
      <Icon className="size-4" />
      {state.label}
    </Button>
  );
}
