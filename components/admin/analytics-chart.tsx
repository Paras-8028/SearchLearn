"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  data: Array<{ date: string; [key: string]: string | number }>;
  dataKey: string;
  dataKey2?: string;
  name?: string;
  name2?: string;
  type?: "area" | "bar";
  color?: string;
  color2?: string;
  height?: number;
}

export function AnalyticsChart({
  data,
  dataKey,
  dataKey2,
  name = "Count",
  name2 = "Volume",
  type = "area",
  color = "#f59e0b", // amber-500
  color2 = "#6366f1", // indigo-500
  height = 240,
}: ChartProps) {
  const hasData = data.some((item) => {
    const val1 = Number(item[dataKey]) || 0;
    const val2 = dataKey2 ? Number(item[dataKey2]) || 0 : 0;
    return val1 > 0 || val2 > 0;
  });

  if (!data || data.length === 0 || !hasData) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/40 text-center p-6"
      >
        <p className="text-xs font-medium text-zinc-400">No telemetry recorded for this period</p>
        <p className="text-[11px] text-zinc-600 mt-1">Data will populate automatically as activity occurs</p>
      </div>
    );
  }

  // Format date display on X-axis (e.g. "Sep 08")
  const formatXAxis = (tickItem: string) => {
    try {
      const parts = tickItem.split("-");
      if (parts.length === 3) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return `${monthNames[m] || parts[1]} ${d}`;
      }
      return tickItem;
    } catch {
      return tickItem;
    }
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
              {dataKey2 && (
                <linearGradient id={`grad-${dataKey2}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color2} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color2} stopOpacity={0.0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                borderRadius: "0.75rem",
                fontSize: "12px",
                color: "#fff",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              name={name}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${dataKey})`}
            />
            {dataKey2 && (
              <Area
                type="monotone"
                dataKey={dataKey2}
                name={name2}
                stroke={color2}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#grad-${dataKey2})`}
              />
            )}
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                borderRadius: "0.75rem",
                fontSize: "12px",
                color: "#fff",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey={dataKey} name={name} fill={color} radius={[4, 4, 0, 0]} />
            {dataKey2 && (
              <Bar dataKey={dataKey2} name={name2} fill={color2} radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
