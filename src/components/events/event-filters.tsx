"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventStatus } from "@/lib/types";

export type StatusFilter = EventStatus | "all";
export type SortOrder = "date-desc" | "date-asc";

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sort: SortOrder;
  onSortChange: (value: SortOrder) => void;
}

export function EventFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome do evento..."
          className="pl-9"
          aria-label="Buscar por nome do evento"
        />
      </div>

      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as StatusFilter)}
      >
        <SelectTrigger className="sm:w-44" aria-label="Filtrar por status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="closed">Encerrados</SelectItem>
          <SelectItem value="cancelled">Cancelados</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOrder)}>
        <SelectTrigger className="sm:w-48" aria-label="Ordenar por data">
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Data (mais recentes)</SelectItem>
          <SelectItem value="date-asc">Data (mais antigos)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
