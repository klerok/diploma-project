"use client";

import { useState } from "react";
import styles from "./quest-list.module.css";

const questData = [
  {
    id: 1,
    title: "Прочитать 3 статьи за неделю",
    details: "Завершите три статьи и получите +90 XP и бейдж 'Аналитик'.",
  },
  {
    id: 2,
    title: "Серия 5 дней",
    details: "Добавляйте хотя бы один прогресс в день 5 дней подряд.",
  },
  {
    id: 3,
    title: "Закрыть мини-курс",
    details: "Пройдите учебный материал из 5 глав без пропусков.",
  },
];

export function QuestList() {
  const [openId, setOpenId] = useState<number | null>(questData[0]?.id ?? null);

  return (
    <section className="container">
      <h2>Квесты недели</h2>
      <ul className={styles.questList}>
        {questData.map((quest) => {
          const isOpen = openId === quest.id;
          const panelId = `quest-panel-${quest.id}`;
          return (
            <li key={quest.id} className={styles.questCard}>
              <h3 className={styles.questTitle}>
                <button
                  type="button"
                  className={styles.questToggle}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : quest.id)}
                >
                  <span className={styles.questTitle}>{quest.title}</span>
                  <span className={styles.questXp}>+90 XP</span>
                </button>
              </h3>
              <div id={panelId} className={styles.questBody} hidden={!isOpen}>
                <p>{quest.details}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
