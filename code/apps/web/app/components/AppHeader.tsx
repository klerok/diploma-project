"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, logout } from "../lib/api";
import { clearAuthSession, hasClientSession, type AuthUser } from "../lib/auth";

const links = [
  { href: "/", label: "Дашборд" },
  { href: "/materials", label: "Материалы" },
  { href: "/add", label: "Добавить" },
  { href: "/quests", label: "Квесты" },
  { href: "/profile", label: "Профиль" },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (!hasClientSession()) {
      setUser(null);
      setSessionChecked(true);
      return;
    }

    void getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setSessionChecked(true));
  }, [pathname]);

  const onLogout = () => {
    void (async () => {
      try {
        await logout();
      } catch {
      }
      clearAuthSession();
      router.push("/login");
      router.refresh();
    })();
  };

  const loginHref =
    pathname === "/login"
      ? "/login"
      : `/login?from=${encodeURIComponent(pathname)}`;

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-logo">
          <Link href="/">ReadQuest</Link>
          <p className="app-tagline">Геймификация чтения и учебного контента</p>
        </div>
        <nav className="app-nav" aria-label="Основная навигация">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="app-user">
          {sessionChecked && user ? (
            <>
              <span className="app-user-name">{user.nickname}</span>
              <button type="button" className="btn-ghost" onClick={onLogout}>
                Выйти
              </button>
            </>
          ) : sessionChecked ? (
            <Link href={loginHref} className="btn-ghost">
              Войти
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
