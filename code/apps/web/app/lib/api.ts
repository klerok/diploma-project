import { API_URL } from "./constants";
import type { AuthResponse, AuthUser } from "./auth";
import { getClientToken } from "./auth";
import type {
  AchievementApi,
  CreateMaterialPayload,
  DashboardApi,
  MaterialApi,
  MaterialTypeApi,
  QuestApi,
  StatsApi,
} from "./types";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

async function apiFetch<T>(path: string, init?: FetchOptions): Promise<T> {
  const useAuth = init?.auth !== false;
  const token = useAuth ? getClientToken() : null;
  const { auth: _auth, ...requestInit } = init ?? {};

  const response = await fetch(`${API_URL}${path}`, {
    ...requestInit,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...requestInit.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.message === "string"
        ? body.message
        : Array.isArray(body.message)
          ? body.message.join(", ")
          : `Ошибка API (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false,
  });
}

export function register(email: string, password: string, nickname: string) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, nickname }),
    auth: false,
  });
}

export function logout() {
  return apiFetch<{ ok: boolean }>("/auth/logout", {
    method: "POST",
    auth: false,
  });
}

export function getMe() {
  return apiFetch<AuthUser>("/auth/me");
}

export function getMaterials(type?: MaterialTypeApi) {
  const params = type ? `?type=${type}` : "";
  return apiFetch<MaterialApi[]>(`/materials${params}`);
}

export function createMaterial(payload: Omit<CreateMaterialPayload, "userId">) {
  return apiFetch<MaterialApi>("/materials", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function completeMaterial(id: number) {
  return apiFetch<MaterialApi>(`/materials/${id}/complete`, {
    method: "PATCH",
  });
}

export function getDashboard() {
  return apiFetch<DashboardApi>("/me/dashboard");
}

export function getStats() {
  return apiFetch<StatsApi>("/me/stats");
}

export function getAchievements() {
  return apiFetch<AchievementApi[]>("/me/achievements");
}

export function getQuests() {
  return apiFetch<QuestApi[]>("/me/quests");
}
