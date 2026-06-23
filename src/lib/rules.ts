import type {
  CheckinAction,
  EventStatus,
  Participant,
  ParticipantStatus,
} from "./types";

/**
 * Regras de negócio do controle de acesso.
 *
 * Funções PURAS e sem dependências de UI/estado — são a fonte única de verdade
 * usada tanto pelos componentes (rótulo/estado do botão) quanto pelo store de
 * simulação (registro do check-in). Por serem puras, ficam 100% testáveis.
 *
 * Regras (conforme enunciado):
 * - Evento `closed`/`cancelled`: bloqueia todas as interações de entrada/saída.
 * - Participante `normal`: pode realizar apenas 1 check-in; nova tentativa = erro.
 * - Participante `vip`: pode entrar e sair múltiplas vezes (cada ação no histórico).
 */

export type BlockedReason = "already_checked_in" | "event_closed";

export type CheckinDecision =
  | { ok: true; action: CheckinAction; nextStatus: ParticipantStatus }
  | { ok: false; reason: BlockedReason };

export const CHECKIN_MESSAGES: Record<string, string> = {
  entrySuccess: "Entrada registrada — participante agora está dentro.",
  exitSuccess: "Saída registrada — participante agora está fora.",
  already_checked_in: "Participante já realizou check-in.",
  event_closed: "Evento encerrado — não é possível registrar entradas.",
};

/** Eventos que não estão `active` bloqueiam qualquer interação de check-in. */
export function isEventBlocked(status: EventStatus): boolean {
  return status !== "active";
}

/**
 * Ação pretendida ao clicar no botão de um participante.
 * VIP alterna entrada/saída conforme a posição atual; normal só entra.
 */
export function intendedAction(participant: Participant): CheckinAction {
  return participant.type === "vip" && participant.status === "inside"
    ? "exit"
    : "entry";
}

/**
 * Avalia uma tentativa de check-in/checkout para o estado ATUAL do participante.
 * Não muta nada — apenas decide o resultado.
 */
export function evaluateCheckin(
  eventStatus: EventStatus,
  participant: Participant,
): CheckinDecision {
  if (isEventBlocked(eventStatus)) {
    return { ok: false, reason: "event_closed" };
  }

  const action = intendedAction(participant);

  // Normal já realizou seu único check-in possível.
  if (participant.type === "normal" && participant.checkin_count >= 1) {
    return { ok: false, reason: "already_checked_in" };
  }

  const nextStatus: ParticipantStatus = action === "entry" ? "inside" : "outside";
  return { ok: true, action, nextStatus };
}

export interface CheckinButtonState {
  action: CheckinAction;
  label: string;
  /** Verdadeiro quando o evento não permite NENHUMA interação (closed/cancelled). */
  disabled: boolean;
  /** Motivo exibido ao usuário quando desabilitado. */
  disabledReason?: string;
}

/**
 * Estado de apresentação do botão de check-in.
 * Só desabilita quando o evento está bloqueado (motivo visível). Para o caso
 * "normal tentando 2ª vez", o botão permanece clicável e o feedback de erro é
 * exibido via toast — espelhando a tabela de feedback do enunciado.
 */
export function getCheckinButtonState(
  eventStatus: EventStatus,
  participant: Participant,
): CheckinButtonState {
  const action = intendedAction(participant);
  const label = action === "entry" ? "Registrar entrada" : "Registrar saída";

  if (isEventBlocked(eventStatus)) {
    return {
      action,
      label,
      disabled: true,
      disabledReason:
        eventStatus === "cancelled" ? "Evento cancelado" : "Evento encerrado",
    };
  }

  return { action, label, disabled: false };
}
