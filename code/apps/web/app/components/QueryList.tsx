"use client";

import { useEffect, useState } from "react";
import { getQuests } from "../lib/api";
import type { QuestApi } from "../lib/types";

export function QuestList() {
  const [quests, setQuests] = useState<QuestApi[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getQuests();
        setQuests(data);
        setOpenId(data[0]?.id ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось загрузить квесты");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="container">
      <h2>Квесты недели</h2>

      {error && <p className="field-error" role="alert">{error}</p>}
      {loading && <p className="tab-panel-meta">Загрузка…</p>}

      {!loading && (
        <ul className="quest-list">
          {quests.map((quest) => {
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
                    <span className="quest-xp">+{quest.rewardXp} XP</span>
                  </button>
                </h3>
                <div id={panelId} className="quest-body" hidden={!isOpen}>
                  <p>{quest.description}</p>
                  <p className="tab-panel-meta">
                    Прогресс: {quest.progress}/{quest.targetCount} ·{" "}
                    {quest.status === "COMPLETED" ? "Завершён" : "Активен"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
