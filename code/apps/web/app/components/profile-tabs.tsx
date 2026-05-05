"use client";

import { useState } from "react";

type ProfileTab = "achievements" | "stats";

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("achievements");
  const levelProgress = 72;

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

      <div role="tabpanel" hidden={activeTab !== "achievements"}>
        <ul className="badge-list">
          <li className="badge badge-earned">Первые 100 XP</li>
          <li className="badge badge-earned">Серия 3 дня</li>
          <li className="badge">Марафон: 10 дней</li>
        </ul>
      </div>

      <div role="tabpanel" hidden={activeTab !== "stats"}>
        <dl className="stats-grid">
          <div className="stat-card">
            <dt>Уровень</dt>
            <dd>4</dd>
          </div>
          <div className="stat-card">
            <dt>Закрыто материалов</dt>
            <dd>12</dd>
          </div>
          <div className="stat-card">
            <dt>Текущая серия</dt>
            <dd>5 дней</dd>
          </div>
        </dl>

        <div className="level-bar-wrap">
          <p className="level-bar-label">Прогресс до уровня 5</p>
          <div className="level-bar" aria-label="Прогресс уровня">
            <div className="level-bar-fill" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
