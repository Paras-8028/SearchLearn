import type { AnalyticsPeriod, DateRangeResult } from "@/types/analytics";

export function resolveDateRange(period: AnalyticsPeriod = "30d"): DateRangeResult {
  const endDate = new Date();
  let startDate: Date | null = null;
  let label = "Last 30 Days";

  switch (period) {
    case "7d":
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      label = "Last 7 Days";
      break;
    case "30d":
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      label = "Last 30 Days";
      break;
    case "90d":
      startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
      label = "Last 90 Days";
      break;
    case "all":
      startDate = null;
      label = "All Time";
      break;
    default:
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      label = "Last 30 Days";
      break;
  }

  return { startDate, endDate, label };
}

export function buildDateFilter(dateField: string, startDate: Date | null): Record<string, unknown> {
  if (!startDate) return {};
  return { [dateField]: { $gte: startDate } };
}

export function generateDateSeries(startDate: Date | null, endDate: Date = new Date()): string[] {
  const dates: string[] = [];
  const start = startDate ? new Date(startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const current = new Date(start);

  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
