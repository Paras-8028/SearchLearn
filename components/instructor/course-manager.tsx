"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  Settings,
  FileText,
  Eye,
} from "lucide-react";
import type { CourseDTO } from "@/types/course";
import {
  CourseCurriculumManager,
  type ModuleWithLessonsDTO,
} from "@/components/instructor/course-curriculum-manager";
import { CourseSettingsForm } from "@/components/instructor/course-settings-form";
import { CourseDocumentsManager } from "@/components/instructor/course-documents-manager";

interface CourseManagerProps {
  initialCourse: CourseDTO;
  initialModules: ModuleWithLessonsDTO[];
}

export function CourseManager({
  initialCourse,
  initialModules,
}: CourseManagerProps) {
  const [course, setCourse] = useState<CourseDTO>(initialCourse);
  const [activeTab, setActiveTab] = useState<"curriculum" | "settings" | "documents">(
    "curriculum"
  );

  return (
    <div className="space-y-8">
      {/* Header & Breadcrumb */}
      <div className="space-y-4 border-b border-zinc-800/80 pb-6">
        <Link
          href="/instructor/courses"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Courses</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                {course.category || "Curriculum"}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  course.published
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                    : "bg-amber-950/60 text-amber-400 border-amber-800/50"
                }`}
              >
                {course.published ? "Live / Published" : "Draft Mode"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {course.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {course.published && (
              <Link
                href={`/courses/${course._id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
                target="_blank"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Page</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "curriculum"
                ? "bg-indigo-600 text-white shadow"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "documents"
                ? "bg-indigo-600 text-white shadow"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Course Documents</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white shadow"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Course Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "curriculum" && (
        <CourseCurriculumManager
          courseId={course._id}
          initialModules={initialModules}
        />
      )}

      {activeTab === "documents" && <CourseDocumentsManager course={course} />}

      {activeTab === "settings" && (
        <CourseSettingsForm course={course} onUpdate={setCourse} />
      )}
    </div>
  );
}
