export type AnalyticsPeriod = "7d" | "30d" | "90d" | "all";

export interface DateRangeResult {
  startDate: Date | null;
  endDate: Date;
  label: string;
}

export interface UserAnalytics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  growthRate: number;
  byRole: {
    students: number;
    instructors: number;
    admins: number;
  };
  growthTrend: Array<{
    date: string;
    count: number;
  }>;
  recentUsers: Array<{
    id: string;
    clerkId: string;
    name?: string;
    email?: string;
    role: string;
    createdAt: string;
  }>;
}

export interface LearningAnalytics {
  totalCourses: number;
  newCourses: number;
  totalEnrollments: number;
  newEnrollments: number;
  activeEnrollments: number;
  completedCourses: number;
  completedLessons: number;
  completionRate: number;
  mostPopularCourses: Array<{
    courseId: string;
    title: string;
    slug: string;
    instructorName?: string;
    enrollmentCount: number;
    completedCount: number;
  }>;
  mostActiveLearners: Array<{
    userId: string;
    name?: string;
    email?: string;
    enrollmentsCount: number;
    aiRequestsCount: number;
  }>;
  activityTrend: Array<{
    date: string;
    enrollments: number;
    completions: number;
  }>;
}

export interface SearchAnalytics {
  totalSearches: number;
  searchesInRange: number;
  successfulSearches: number;
  noResultSearches: number;
  avgResultsPerSearch: number;
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  recentSearches: Array<{
    query: string;
    createdAt: string;
    userId?: string;
  }>;
  searchTrend: Array<{
    date: string;
    count: number;
  }>;
}

export interface AIAnalytics {
  totalRequests: number;
  requestsInRange: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  avgTokensPerRequest: number;
  estimatedCostUsd: number;
  totalFailures: number;
  overallSuccessRate: number;
  byFeature: Array<{
    feature: string;
    count: number;
    totalTokens: number;
    avgDurationMs: number;
    successRate: number;
  }>;
  aiTrend: Array<{
    date: string;
    requests: number;
    tokens: number;
  }>;
}

export interface DocumentAnalytics {
  totalDocuments: number;
  completedDocuments: number;
  failedDocuments: number;
  pendingDocuments: number;
  totalIndexedChunks: number;
  totalEmbeddings: number;
  successRate: number;
}

export interface SystemHealthStatus {
  database: {
    status: "healthy" | "unavailable";
    latencyMs: number;
  };
  aiService: {
    status: "available" | "error";
    provider: string;
  };
  documentProcessing: {
    status: "operational" | "degraded";
    failedCount: number;
  };
}

export interface AdminOverviewAnalytics {
  range: AnalyticsPeriod;
  users: UserAnalytics;
  learning: LearningAnalytics;
  search: SearchAnalytics;
  ai: AIAnalytics;
  documents: DocumentAnalytics;
  systemHealth: SystemHealthStatus;
}

export interface StudentLearningStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  currentStreak: number;
  totalLearningTimeMinutes: number;
  completionRate: number;
  weeklyActivity: Array<{
    day: string;
    date: string;
    count: number;
    active: boolean;
  }>;
}

export interface CourseAnalytics {
  courseId: string;
  title: string;
  slug: string;
  totalEnrollments: number;
  activeLearners: number;
  completionRate: number;
  averageProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  recentEnrollments: Array<{
    userId: string;
    name?: string;
    enrolledAt: string;
    progress: number;
    completed: boolean;
  }>;
}

export interface SearchClickEvent {
  searchQuery: string;
  searchId?: string;
  resultType: string;
  resultId: string;
  courseId?: string;
  lessonId?: string;
  userId?: string;
  clickedAt: Date;
}

export interface AdvancedSearchAnalytics {
  totalSearches: number;
  searchesToday: number;
  searchesThisWeek: number;
  noResultSearches: number;
  avgResultsPerSearch: number;
  clickThroughRate: number;
  totalClicks: number;
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  failedSearches: Array<{
    query: string;
    count: number;
    lastSearched: string;
  }>;
  searchTypeBreakdown: {
    keyword: number;
    semantic: number;
    hybrid: number;
    aiAnswer: number;
  };
  recentSearches: Array<{
    query: string;
    createdAt: string;
    userId?: string;
  }>;
}

export interface AdvancedAIAnalytics {
  totalRequests: number;
  requestsToday: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  avgResponseTimeMs: number;
  estimatedCostUsd: number;
  failedRequests: number;
  successRate: number;
  requestTypeCounts: Record<string, number>;
  byFeature: Array<{
    feature: string;
    count: number;
    totalTokens: number;
    avgDurationMs: number;
    successRate: number;
  }>;
  recentFailures: Array<{
    id: string;
    feature: string;
    error?: string;
    createdAt: string;
  }>;
}

