import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EventList } from "./event-list";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";

vi.mock("@/lib/api", () => ({ getEvents: vi.fn() }));

const mockedGetEvents = vi.mocked(getEvents);

function renderList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <EventList />
    </QueryClientProvider>,
  );
}

const sampleEvent: EventSummary = {
  id: "EVT-001",
  name: "Tech Summit",
  date: "2025-05-15T09:00:00-03:00",
  location: "São Paulo",
  status: "active",
  description: "",
  expected_count: 10,
  checkin_count: 5,
  error_count: 0,
  entry_rate: 0.5,
};

beforeEach(() => {
  mockedGetEvents.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("EventList — estados de renderização", () => {
  it("mostra skeletons enquanto carrega", () => {
    // Promise que nunca resolve mantém o estado de loading.
    mockedGetEvents.mockReturnValue(new Promise(() => {}));
    const { container } = renderList();

    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  it("mostra estado vazio quando não há eventos", async () => {
    mockedGetEvents.mockResolvedValue({ total: 0, data: [] });
    renderList();

    expect(
      await screen.findByText("Nenhum evento encontrado"),
    ).toBeInTheDocument();
  });

  it("mostra estado de erro quando a requisição falha", async () => {
    mockedGetEvents.mockRejectedValue(new Error("boom"));
    renderList();

    expect(
      await screen.findByText(/não foi possível carregar a lista/i),
    ).toBeInTheDocument();
  });

  it("renderiza os eventos quando a requisição tem sucesso", async () => {
    mockedGetEvents.mockResolvedValue({ total: 1, data: [sampleEvent] });
    renderList();

    await waitFor(() =>
      expect(screen.getByText("Tech Summit")).toBeInTheDocument(),
    );
  });
});
