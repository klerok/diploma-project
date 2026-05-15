"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Дашборд" },
  { href: "/materials", label: "Материалы" },
  { href: "/add", label: "Добавить" },
  { href: "/quests", label: "Квесты" },
  { href: "/profile", label: "Профиль" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="app-nav" aria-label="Основная навигация">
      <ul>
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                aria-current={isActive ? "page" : undefined}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
