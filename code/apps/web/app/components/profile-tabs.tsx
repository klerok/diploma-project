"use client";

import { useState } from "react";
import styles from "./profile-tabs.module.css";

type ProfileTab = "achievements" | "stats";

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("achievements");
  const levelProgress = 72;

  return (
    <section className={`container ${styles.profileTabs}`}>
      <h2>Профиль читателя</h2>
      <div className={styles.tablist} role="tablist" aria-label="Вкладки профиля">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "achievements"}
          className={`${styles.tabTrigger} ${activeTab === "achievements" ? styles.tabTriggerActive : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          Достижения
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "stats"}
          className={`${styles.tabTrigger} ${activeTab === "stats" ? styles.tabTriggerActive : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Статистика
        </button>
      </div>

      <div role="tabpanel" hidden={activeTab !== "achievements"}>
        <ul className={styles.badgeList}>
          <li className={`${styles.badge} ${styles.badgeEarned}`}>Первые 100 XP</li>
          <li className={`${styles.badge} ${styles.badgeEarned}`}>Серия 3 дня</li>
          <li className={styles.badge}>Марафон: 10 дней</li>
        </ul>
      </div>

      <div role="tabpanel" hidden={activeTab !== "stats"}>
        <dl className={styles.statsGrid}>
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

        <div className={styles.levelBarWrap}>
          <p className={styles.levelBarLabel}>Прогресс до уровня 5</p>
          <div className={styles.levelBar} aria-label="Прогресс уровня">
            <div className={styles.levelBarFill} style={{ width: `${levelProgress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
