import type { Metadata } from "next";
import { EventList } from "@/components/events/event-list";

export const metadata: Metadata = {
  title: "Eventos | Painel de Gestão de Eventos",
};

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Eventos</h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe seus eventos e controle o acesso de participantes.
        </p>
      </header>
      <EventList />
    </div>
  );
}
