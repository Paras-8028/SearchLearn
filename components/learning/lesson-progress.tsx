interface LessonProgressProps {
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
}

export function LessonProgressIndicator({
  progressPercentage,
  completedCount,
  totalCount,
}: LessonProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Course Progress ({completedCount}/{totalCount} completed)
        </span>
        <span className="font-semibold text-foreground">{progressPercentage}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
        />
      </div>
    </div>
  );
}
