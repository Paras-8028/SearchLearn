"use client";

import { Layers, BookOpen, FileText, Sparkles, Filter } from "lucide-react";

interface SearchFiltersProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedCourse: string;
  onSelectCourse: (courseId: string) => void;
  courses: { _id: string; title: string }[];
}

export function SearchFilters({
  selectedType,
  onSelectType,
  selectedCourse,
  onSelectCourse,
  courses = [],
}: SearchFiltersProps) {
  const filterOptions = [
    { id: "all", label: "All Content", icon: Sparkles },
    { id: "course", label: "Courses", icon: BookOpen },
    { id: "module", label: "Modules", icon: Layers },
    { id: "lesson", label: "Lessons", icon: FileText },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
      {/* Content Type Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = selectedType === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectType(opt.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-card border border-border/80 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Course Scope Filter Dropdown */}
      {courses.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <select
            value={selectedCourse}
            onChange={(e) => onSelectCourse(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
