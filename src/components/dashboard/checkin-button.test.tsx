import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { CheckinButton } from "./checkin-button";
import { useCheckinStore } from "@/store/checkin-store";
import type { EventDetail, Participant } from "@/lib/types";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const participant: Participant = {
  id: "EVT-001-P004",
  event_id: "EVT-001",
  name: "Pedro Freitas",
  type: "normal",
  status: "outside",
  checkin_count: 0,
};

const event: EventDetail = {
  id: "EVT-001",
  name: "Tech Summit",
  date: "2025-05-15T09:00:00-03:00",
  location: "São Paulo",
  status: "active",
  description: "",
  expected_count: 10,
  checkin_count: 0,
  error_count: 0,
  entry_rate: 0,
  participants: [participant],
  checkins: [],
};

beforeEach(() => {
  useCheckinStore.setState({ overlays: {} });
  vi.clearAllMocks();
});

describe("CheckinButton — interação", () => {
  it("registra o check-in ao clicar e atualiza o estado", async () => {
    const user = userEvent.setup();
    render(<CheckinButton event={event} participant={participant} />);

    await user.click(screen.getByRole("button", { name: /registrar entrada/i }));

    const overlay = useCheckinStore.getState().overlays["EVT-001"];
    expect(overlay.participants["EVT-001-P004"]).toEqual({
      status: "inside",
      checkin_count: 1,
    });
    expect(overlay.checkinDelta).toBe(1);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("impede o segundo check-in de um participante normal", async () => {
    const user = userEvent.setup();
    render(<CheckinButton event={event} participant={participant} />);

    const button = screen.getByRole("button", { name: /registrar entrada/i });
    await user.click(button);
    await user.click(button);

    const overlay = useCheckinStore.getState().overlays["EVT-001"];
    // O check-in válido continua sendo apenas 1.
    expect(overlay.checkinDelta).toBe(1);
    expect(overlay.errorDelta).toBe(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
