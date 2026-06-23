"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  buildEntriesOverTime,
  buildSuccessErrorBreakdown,
} from "@/lib/metrics";
import type { Checkin } from "@/lib/types";

const SLICE_COLORS: Record<"success" | "error", string> = {
  success: "#10b981",
  error: "#ef4444",
};

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground flex h-[240px] items-center justify-center text-sm">
      {message}
    </div>
  );
}

export function EntriesOverTimeChart({ checkins }: { checkins: Checkin[] }) {
  const data = useMemo(() => buildEntriesOverTime(checkins), [checkins]);

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-base">Evolução de entradas</CardTitle>
        <CardDescription>Entradas acumuladas ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <ChartEmpty message="Sem entradas registradas." />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="entriesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                className="text-muted-foreground"
                width={32}
              />
              <Tooltip
                cursor={{ stroke: "#3b82f6", strokeOpacity: 0.2 }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  fontSize: 12,
                }}
                labelFormatter={(label) => `Horário: ${label}`}
                formatter={(value) => [value, "Entradas acumuladas"]}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#entriesFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function SuccessErrorChart({ checkins }: { checkins: Checkin[] }) {
  const data = useMemo(
    () => buildSuccessErrorBreakdown(checkins),
    [checkins],
  );
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-base">Sucesso x Erro</CardTitle>
        <CardDescription>Proporção das tentativas de check-in</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <ChartEmpty message="Sem tentativas registradas." />
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((slice) => (
                    <Cell key={slice.key} fill={SLICE_COLORS[slice.key]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [value, name as string]}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex gap-4 text-sm sm:flex-col">
              {data.map((slice) => (
                <li key={slice.key} className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-sm"
                    style={{ backgroundColor: SLICE_COLORS[slice.key] }}
                  />
                  <span className="text-muted-foreground">{slice.label}</span>
                  <span className="font-medium tabular-nums">{slice.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
