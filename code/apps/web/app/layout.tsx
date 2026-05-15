import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppHeader } from "./components/AppHeader";
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
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppHeader />
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
