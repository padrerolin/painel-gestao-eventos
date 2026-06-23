import { AlertCircle, RefreshCw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function StateMessage({ icon: Icon, title, description, action }: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-background/50 px-6 py-16 text-center">
      {Icon ? (
        <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <Icon className="size-6" />
        </span>
      ) : null}
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title = "Nenhum resultado encontrado",
  description,
  icon,
}: Partial<StateProps>) {
  return <StateMessage icon={icon} title={title} description={description} />;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <StateMessage
      icon={AlertCircle}
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="size-4" />
            Tentar novamente
          </Button>
        ) : undefined
      }
    />
  );
}
