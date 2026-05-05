import Link from "next/link";
import { readingItems } from "./lib/reading-data";

export default function Home() {
  const completedCount = readingItems.filter((item) => item.completed).length;
  const totalXp = 120 + completedCount * 40;
  const streak = 3 + Math.min(completedCount, 5);
  const progressPercent = Math.round((completedCount / readingItems.length) * 100);

  return (
    <main className="main-area">
      <div className="container">
        <h2 className="page-title">Дашборд прогресса</h2>
        <p className="lead">
          Главная страница приложения, быстрый обзор XP, серии чтения и общего прогресса.
        </p>

        <section aria-labelledby="stats-title">
          <h3 id="stats-title" className="visually-hidden">Ключевые показатели</h3>
          <dl className="grid-dashboard">
            <div className="stat-card">
              <dt>Текущий XP</dt>
              <dd>{totalXp}</dd>
            </div>
            <div className="stat-card">
              <dt>Серия дней</dt>
              <dd>{streak}</dd>
            </div>
            <div className="stat-card">
              <dt>Прогресс</dt>
              <dd>{progressPercent}%</dd>
            </div>
          </dl>
          <div className="level-bar-wrap">
            <p className="level-bar-label">Общий прогресс чтения</p>
            <div className="level-bar" aria-label="Общий прогресс чтения">
              <div className="level-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </section>

        <section className="actions-row">
          <Link href="/materials" className="btn-primary">Библиотека</Link>
          <Link href="/add" className="btn-primary">Добавить материал</Link>
          <Link href="/quests" className="btn-ghost">Квесты</Link>
          <Link href="/profile" className="btn-ghost">Профиль</Link>
        </section>
      </div>
    </main>
  );
}
