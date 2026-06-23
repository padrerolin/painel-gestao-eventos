import { EventDashboard } from "@/components/dashboard/event-dashboard";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDashboard id={id} />;
}
