import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "./constants";
import { API_URL } from "./constants";
import type { DashboardApi } from "./types";

export async function getDashboardServer(): Promise<DashboardApi> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    throw new Error("Не авторизован");
  }

  const response = await fetch(`${API_URL}/me/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить дашборд");
  }

  return response.json() as Promise<DashboardApi>;
}
