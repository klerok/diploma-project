"use client";

import { useState } from "react";

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
      <ul className="quest-list">
        {questData.map((quest) => {
          const isOpen = openId === quest.id;
          const panelId = `quest-panel-${quest.id}`;
          return (
            <li key={quest.id} className="quest-card">
              <h3 className="quest-title">
                <button
                  type="button"
                  className="quest-toggle"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : quest.id)}
                >
                  <span className="quest-title">{quest.title}</span>
                  <span className="quest-xp">+90 XP</span>
                </button>
              </h3>
              <div id={panelId} className="quest-body" hidden={!isOpen}>
                <p>{quest.details}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
