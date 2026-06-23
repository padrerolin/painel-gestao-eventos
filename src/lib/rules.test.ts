import { describe, expect, it } from "vitest";
import { evaluateCheckin, getCheckinButtonState } from "./rules";
import type { Participant } from "./types";

function makeParticipant(overrides: Partial<Participant> = {}): Participant {
  return {
    id: "P1",
    event_id: "EVT-001",
    name: "Fulano",
    type: "normal",
    status: "outside",
    checkin_count: 0,
    ...overrides,
  };
}

describe("evaluateCheckin", () => {
  it("permite o primeiro check-in de um participante normal", () => {
    const p = makeParticipant({ type: "normal", checkin_count: 0 });
    const decision = evaluateCheckin("active", p);

    expect(decision).toEqual({
      ok: true,
      action: "entry",
      nextStatus: "inside",
    });
  });

  it("bloqueia a segunda tentativa de um participante normal", () => {
    const p = makeParticipant({
      type: "normal",
      status: "inside",
      checkin_count: 1,
    });
    const decision = evaluateCheckin("active", p);

    expect(decision).toEqual({ ok: false, reason: "already_checked_in" });
  });

  it("permite múltiplas entradas e saídas para VIP", () => {
    const outside = makeParticipant({
      type: "vip",
      status: "outside",
      checkin_count: 3,
    });
    expect(evaluateCheckin("active", outside)).toMatchObject({
      ok: true,
      action: "entry",
      nextStatus: "inside",
    });

    const inside = makeParticipant({
      type: "vip",
      status: "inside",
      checkin_count: 4,
    });
    expect(evaluateCheckin("active", inside)).toMatchObject({
      ok: true,
      action: "exit",
      nextStatus: "outside",
    });
  });

  it("bloqueia check-ins em evento encerrado ou cancelado", () => {
    const p = makeParticipant({ type: "vip", checkin_count: 0 });

    expect(evaluateCheckin("closed", p)).toEqual({
      ok: false,
      reason: "event_closed",
    });
    expect(evaluateCheckin("cancelled", p)).toEqual({
      ok: false,
      reason: "event_closed",
    });
  });
});

describe("getCheckinButtonState", () => {
  it("desabilita o botão com motivo quando o evento está encerrado", () => {
    const state = getCheckinButtonState("closed", makeParticipant());
    expect(state.disabled).toBe(true);
    expect(state.disabledReason).toBe("Evento encerrado");
  });

  it("mantém o botão ativo em evento ativo", () => {
    const state = getCheckinButtonState("active", makeParticipant());
    expect(state.disabled).toBe(false);
    expect(state.label).toBe("Registrar entrada");
  });
});
