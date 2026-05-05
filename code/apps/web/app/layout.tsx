import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ReadQuest MVP",
  description: "Прототип веб-приложения для геймификации чтения",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { href: "/", label: "Дашборд" },
    { href: "/materials", label: "Материалы" },
    { href: "/add", label: "Добавить" },
    { href: "/quests", label: "Квесты" },
    { href: "/profile", label: "Профиль" },
  ];

  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
          </div>
        </header>

        {children}

        <footer className="app-footer">
          <div className="app-footer-inner">
            <small>ReadQuest MVP - прототип для дипломного проекта</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
