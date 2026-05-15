import Link from "next/link";
import { LoginPrompt } from "./components/LoginPrompt";
import { getDashboardServer } from "./lib/api-server";
import { hasServerSession } from "./lib/auth-server";

export default async function Home() {
  const authed = await hasServerSession();

  if (!authed) {
    return (
      <main className="main-area">
        <div className="container">
          <h2 className="page-title">Дашборд прогресса</h2>
          <LoginPrompt from="/" />
        </div>
      </main>
    );
  }

  let dashboard = {
    totalXp: 0,
    currentStreak: 0,
    progressPercent: 0,
  };
  let error: string | null = null;

  try {
    dashboard = await getDashboardServer();
  } catch (e) {
    error = e instanceof Error ? e.message : "Не удалось загрузить дашборд";
  }

  return (
    <main className="main-area">
      <div className="container">
        <h2 className="page-title">Дашборд прогресса</h2>
        <p className="lead">
          Главная страница приложения, быстрый обзор XP, серии чтения и общего прогресса.
        </p>

        {error && <p className="field-error" role="alert">{error}</p>}

        <section aria-labelledby="stats-title">
          <h3 id="stats-title" className="visually-hidden">Ключевые показатели</h3>
          <dl className="grid-dashboard">
            <div className="stat-card">
              <dt>Текущий XP</dt>
              <dd>{dashboard.totalXp}</dd>
            </div>
            <div className="stat-card">
              <dt>Серия дней</dt>
              <dd>{dashboard.currentStreak}</dd>
            </div>
            <div className="stat-card">
              <dt>Прогресс</dt>
              <dd>{dashboard.progressPercent}%</dd>
            </div>
          </dl>
          <div className="level-bar-wrap">
            <p className="level-bar-label">Общий прогресс чтения</p>
            <div className="level-bar" aria-label="Общий прогресс чтения">
              <div
                className="level-bar-fill"
                style={{ width: `${dashboard.progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="actions-row">
          <Link href="/materials" className={styles.btnPrimary}>Библиотека</Link>
          <Link href="/add" className={styles.btnPrimary}>Добавить материал</Link>
          <Link href="/quests" className="btn-ghost">Квесты</Link>
          <Link href="/profile" className="btn-ghost">Профиль</Link>
        </section>
      </div>
    </main>
  );
}
