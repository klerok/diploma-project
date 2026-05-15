import { TOKEN_COOKIE } from "./constants";

export { TOKEN_COOKIE };

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export type AuthUser = {
  id: number;
  email: string;
  nickname: string;
  totalXp?: number;
  currentStreak?: number;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export function saveAuthSession(accessToken: string) {
  if (typeof window === "undefined") {
    return;
  }

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; path=/; max-age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax${secure}`;
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getClientToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`),
  );

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function hasClientSession(): boolean {
  return Boolean(getClientToken());
}
