"use client";

import { useEffect, useState } from "react";
import { getAchievements, getStats } from "../lib/api";
import type { AchievementApi, StatsApi } from "../lib/types";

type ProfileTab = "achievements" | "stats";

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("achievements");
  const [achievements, setAchievements] = useState<AchievementApi[]>([]);
  const [stats, setStats] = useState<StatsApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const [achievementsData, statsData] = await Promise.all([
          getAchievements(),
          getStats(),
        ]);
        setAchievements(achievementsData);
        setStats(statsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="container profile-tabs">
      <h2>Профиль читателя</h2>
      <div className="tablist tablist-secondary" role="tablist" aria-label="Вкладки профиля">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "achievements"}
          className={`tab-trigger ${activeTab === "achievements" ? "tab-trigger-active" : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          Достижения
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "stats"}
          className={`tab-trigger ${activeTab === "stats" ? "tab-trigger-active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Статистика
        </button>
      </div>

      {error && <p className="field-error" role="alert">{error}</p>}
      {loading && <p className="tab-panel-meta">Загрузка…</p>}

      {!loading && (
        <>
          <div role="tabpanel" hidden={activeTab !== "achievements"}>
            <ul className="badge-list">
              {achievements.map((badge) => (
                <li
                  key={badge.id}
                  className={`badge ${badge.earned ? "badge-earned" : ""}`}
                >
                  {badge.title}
                </li>
              ))}
            </ul>
          </div>

          <div role="tabpanel" hidden={activeTab !== "stats"}>
            {stats && (
              <>
                <dl className="stats-grid">
                  <div className="stat-card">
                    <dt>Уровень</dt>
                    <dd>{stats.level}</dd>
                  </div>
                  <div className="stat-card">
                    <dt>Закрыто материалов</dt>
                    <dd>{stats.materialsCompleted}</dd>
                  </div>
                  <div className="stat-card">
                    <dt>Текущая серия</dt>
                    <dd>{stats.currentStreak} дней</dd>
                  </div>
                </dl>

                <div className="level-bar-wrap">
                  <p className="level-bar-label">Прогресс до уровня {stats.nextLevel}</p>
                  <div className="level-bar" aria-label="Прогресс уровня">
                    <div
                      className="level-bar-fill"
                      style={{ width: `${stats.levelProgressPercent}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
