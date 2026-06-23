/**
 * Tipos do domínio — espelham o contrato da API do desafio.
 * Ver estrutura em: https://ThiagoLifters.github.io/api_test/api/events.json
 */

export type EventStatus = "active" | "closed" | "cancelled";
export type ParticipantType = "vip" | "normal";
export type ParticipantStatus = "inside" | "outside";
export type CheckinAction = "entry" | "exit";
export type CheckinErrorReason = "already_checked_in" | "event_closed" | null;

/** Evento como vem na listagem (`/api/events.json`). */
export interface EventSummary {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  description: string;
  expected_count: number;
  checkin_count: number;
  error_count: number;
  entry_rate: number;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  type: ParticipantType;
  status: ParticipantStatus;
  checkin_count: number;
}

export interface Checkin {
  id: string;
  event_id: string;
  participant_id: string;
  timestamp: string;
  success: boolean;
  action: CheckinAction;
  error_reason: CheckinErrorReason;
}

/** Evento detalhado (`/api/events/{id}.json`) — inclui arrays aninhados. */
export interface EventDetail extends EventSummary {
  participants: Participant[];
  checkins: Checkin[];
}

/** Envelope da listagem. */
export interface EventsResponse {
  total: number;
  data: EventSummary[];
}
