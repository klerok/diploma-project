export type MaterialTypeApi = "ARTICLE" | "BOOK" | "COURSE";

export type MaterialApi = {
  id: number;
  userId: number;
  title: string;
  type: MaterialTypeApi;
  pages: number;
  sourceUrl: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
};

export type DashboardApi = {
  totalXp: number;
  currentStreak: number;
  materialsTotal: number;
  materialsCompleted: number;
  progressPercent: number;
};

export type StatsApi = {
  level: number;
  materialsCompleted: number;
  currentStreak: number;
  totalXp: number;
  levelProgressPercent: number;
  nextLevel: number;
};

export type AchievementApi = {
  id: number;
  code: string;
  title: string;
  earned: boolean;
  earnedAt: string | null;
};

export type QuestApi = {
  id: number;
  title: string;
  description: string;
  targetCount: number;
  rewardXp: number;
  progress: number;
  status: "ACTIVE" | "COMPLETED";
};

export type CreateMaterialPayload = {
  title: string;
  type: MaterialTypeApi;
  pages: number;
  sourceUrl?: string;
};
