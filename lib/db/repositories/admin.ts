import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import { serializeUser } from "./users";
import { serializeCourse } from "./courses";
import { serializeDocument } from "./documents";
import { getRecentPlatformActivities } from "./platform-activities";
import type { SearchLearnUser, SearchLearnUserDTO } from "@/types/user";
import type { Course, CourseDTO } from "@/types/course";
import type { LearningDocument, LearningDocumentDTO } from "@/types/document";
import type { AIRequestLog } from "@/types/ai-log";
import type { Enrollment } from "@/types/enrollment";
import type { SearchHistoryItem } from "@/types/search-history";
import type {
  PlatformActivityDTO,
  PlatformActivityType,
  ActivityCategory,
} from "@/types/activity";

const DATABASE_NAME = "searchlearn";

export interface AdminDashboardSummary {
  users: {
    total: number;
    students: number;
    instructors: number;
    admins: number;
  };
  courses: {
    total: number;
    published: number;
    draft: number;
  };
  content: {
    totalModules: number;
    totalLessons: number;
  };
  enrollments: {
    total: number;
    completed: number;
  };
  documents: {
    total: number;
    completed: number;
    processing: number;
    pending: number;
    failed: number;
  };
  search: {
    totalQueries: number;
  };
  ai: {
    totalRequests: number;
    totalTokens: number;
  };
  recentUsers: SearchLearnUserDTO[];
  recentCourses: CourseDTO[];
  recentDocuments: LearningDocumentDTO[];
  recentAiRequests: Array<{
    _id: string;
    userId: string;
    feature: string;
    totalTokens?: number;
    success: boolean;
    durationMs?: number;
    createdAt: string;
  }>;
  recentActivities: PlatformActivityDTO[];
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);

  const usersCol = db.collection<SearchLearnUser>("users");
  const coursesCol = db.collection<Course>("courses");
  const modulesCol = db.collection("modules");
  const lessonsCol = db.collection("lessons");
  const enrollmentsCol = db.collection<Enrollment>("enrollments");
  const documentsCol = db.collection<LearningDocument>("learning_documents");
  const searchCol = db.collection("searchHistory");
  const aiCol = db.collection<AIRequestLog>("aiRequestLogs");

  const [
    totalUsers,
    studentUsers,
    instructorUsers,
    adminUsers,
    totalCourses,
    publishedCourses,
    totalModules,
    totalLessons,
    totalEnrollments,
    completedEnrollments,
    totalDocuments,
    completedDocs,
    processingDocs,
    pendingDocs,
    failedDocs,
    totalQueries,
    totalAiRequests,
    aiTokensAgg,
    recentUsersRaw,
    recentCoursesRaw,
    recentDocsRaw,
    recentAiRaw,
    recentActivities,
  ] = await Promise.all([
    usersCol.countDocuments({}),
    usersCol.countDocuments({ role: "student" }),
    usersCol.countDocuments({ role: "instructor" }),
    usersCol.countDocuments({ role: "admin" }),
    coursesCol.countDocuments({}),
    coursesCol.countDocuments({ published: true }),
    modulesCol.countDocuments({}),
    lessonsCol.countDocuments({}),
    enrollmentsCol.countDocuments({}),
    enrollmentsCol.countDocuments({ completed: true }),
    documentsCol.countDocuments({}),
    documentsCol.countDocuments({ processingStatus: "completed" }),
    documentsCol.countDocuments({ processingStatus: "processing" }),
    documentsCol.countDocuments({ processingStatus: "pending" }),
    documentsCol.countDocuments({ processingStatus: "failed" }),
    searchCol.countDocuments({}),
    aiCol.countDocuments({}),
    aiCol.aggregate<{ totalTokens: number }>([
      { $group: { _id: null, totalTokens: { $sum: "$totalTokens" } } },
    ]).toArray(),
    usersCol.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    coursesCol.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    documentsCol.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    aiCol.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    getRecentPlatformActivities(10),
  ]);

  const totalTokens = aiTokensAgg[0]?.totalTokens ?? 0;

  return {
    users: {
      total: totalUsers,
      students: studentUsers,
      instructors: instructorUsers,
      admins: adminUsers,
    },
    courses: {
      total: totalCourses,
      published: publishedCourses,
      draft: Math.max(0, totalCourses - publishedCourses),
    },
    content: {
      totalModules,
      totalLessons,
    },
    enrollments: {
      total: totalEnrollments,
      completed: completedEnrollments,
    },
    documents: {
      total: totalDocuments,
      completed: completedDocs,
      processing: processingDocs,
      pending: pendingDocs,
      failed: failedDocs,
    },
    search: {
      totalQueries,
    },
    ai: {
      totalRequests: totalAiRequests,
      totalTokens,
    },
    recentUsers: recentUsersRaw.map(serializeUser),
    recentCourses: recentCoursesRaw.map(serializeCourse),
    recentDocuments: recentDocsRaw.map(serializeDocument),
    recentAiRequests: recentAiRaw.map((log) => ({
      _id: log._id ? log._id.toString() : "",
      userId: log.userId,
      feature: log.feature,
      totalTokens: log.totalTokens,
      success: log.success,
      durationMs: log.durationMs,
      createdAt: log.createdAt ? log.createdAt.toISOString() : new Date().toISOString(),
    })),
    recentActivities,
  };
}

export interface UserDetailSummary {
  user: SearchLearnUserDTO;
  enrollments: Array<{
    _id: string;
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    progressPercentage: number;
    completed: boolean;
    enrolledAt: string;
    lastAccessedAt?: string;
  }>;
  createdCourses: CourseDTO[];
  searchStats: {
    totalSearches: number;
    recentQueries: string[];
  };
  aiStats: {
    totalRequests: number;
    totalTokens: number;
    recentRequests: Array<{
      _id: string;
      feature: string;
      totalTokens?: number;
      success: boolean;
      createdAt: string;
    }>;
  };
  activities: PlatformActivityDTO[];
}

export async function getUserDetailSummary(userId: string): Promise<UserDetailSummary | null> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);

  // 1. Find user by MongoDB _id or clerkId
  const usersCol = db.collection<SearchLearnUser>("users");
  let user: SearchLearnUser | null = null;
  if (ObjectId.isValid(userId)) {
    user = await usersCol.findOne({ _id: new ObjectId(userId) });
  }
  if (!user) {
    user = await usersCol.findOne({ clerkId: userId });
  }
  if (!user) return null;

  const clerkId = user.clerkId;
  const userObjectId = user._id ? user._id.toString() : "";

  // 2. Query enrollments with course metadata
  const enrollmentsCol = db.collection<Enrollment>("enrollments");
  const coursesCol = db.collection<Course>("courses");
  const rawEnrollments = await enrollmentsCol.find({ userId: clerkId }).sort({ enrolledAt: -1 }).toArray();

  const populatedEnrollments = await Promise.all(
    rawEnrollments.map(async (enr) => {
      const course = await coursesCol.findOne({ _id: enr.courseId });
      return {
        _id: enr._id ? enr._id.toString() : "",
        courseId: enr.courseId.toString(),
        courseTitle: course?.title || "Unknown Course",
        courseSlug: course?.slug || "",
        progressPercentage: enr.progressPercentage || 0,
        completed: Boolean(enr.completedAt),
        enrolledAt: enr.enrolledAt ? enr.enrolledAt.toISOString() : new Date().toISOString(),
        lastAccessedAt: enr.enrolledAt ? enr.enrolledAt.toISOString() : undefined,
      };
    })
  );

  // 3. Courses created by user
  const createdCoursesRaw = await coursesCol.find({ instructorId: clerkId }).sort({ createdAt: -1 }).toArray();
  const createdCourses = createdCoursesRaw.map(serializeCourse);

  // 4. Search stats
  const searchCol = db.collection<SearchHistoryItem>("searchHistory");
  const totalSearches = await searchCol.countDocuments({ userId: clerkId });
  const recentSearchEntries = await searchCol
    .find({ userId: clerkId })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();
  const recentQueries = recentSearchEntries.map((s) => s.query);

  // 5. AI usage stats
  const aiCol = db.collection<AIRequestLog>("aiRequestLogs");
  const totalAiRequests = await aiCol.countDocuments({ userId: clerkId });
  const tokensAgg = await aiCol.aggregate<{ totalTokens: number }>([
    { $match: { userId: clerkId } },
    { $group: { _id: null, totalTokens: { $sum: "$totalTokens" } } },
  ]).toArray();
  const totalTokens = tokensAgg[0]?.totalTokens ?? 0;

  const recentAiLogs = await aiCol
    .find({ userId: clerkId })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  const recentRequests = recentAiLogs.map((log) => ({
    _id: log._id ? log._id.toString() : "",
    feature: log.feature,
    totalTokens: log.totalTokens,
    success: log.success,
    createdAt: log.createdAt ? log.createdAt.toISOString() : new Date().toISOString(),
  }));

  // 6. Platform activities for this user
  const activitiesCol = db.collection("platformActivities");
  const rawActivities = await activitiesCol
    .find({
      $or: [{ userId: clerkId }, { userId: userObjectId }],
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  const activities: PlatformActivityDTO[] = rawActivities.map((act) => ({
    _id: act._id ? act._id.toString() : "",
    type: act.type || "UNKNOWN",
    eventType: (act.eventType || act.type || "UNKNOWN") as PlatformActivityType,
    category: (act.category || "SYSTEM") as ActivityCategory,
    userId: act.userId,
    userEmail: act.userEmail,
    userName: act.userName,
    entityType: act.entityType,
    entityId: act.entityId,
    message: act.message || "",
    metadata: act.metadata,
    createdAt: act.createdAt ? act.createdAt.toISOString() : new Date().toISOString(),
  }));

  return {
    user: serializeUser(user),
    enrollments: populatedEnrollments,
    createdCourses,
    searchStats: {
      totalSearches,
      recentQueries,
    },
    aiStats: {
      totalRequests: totalAiRequests,
      totalTokens,
      recentRequests,
    },
    activities,
  };
}
