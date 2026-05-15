"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { completeMaterial, getMaterials } from "../lib/api";
import { materialTabToType, materialTypeToLabel } from "../lib/mappers";
import type { MaterialApi } from "../lib/types";

const tabs = ["Все", "Статьи", "Книги", "Учебные"] as const;
type Tab = (typeof tabs)[number];

export function MaterialTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Все");
  const [materials, setMaterials] = useState<MaterialApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const type = materialTabToType[activeTab] ?? undefined;
      const data = await getMaterials(type ?? undefined);
      setMaterials(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить материалы");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  const filtered = useMemo(() => materials, [materials]);

  const onComplete = async (id: number) => {
    setCompletingId(id);
    setError(null);
    try {
      await completeMaterial(id);
      await loadMaterials();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отметить материал");
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <section className="container" aria-labelledby="materials-title">
      <h2 id="materials-title">Материалы для чтения</h2>
      <div className="tablist" role="tablist" aria-label="Фильтр материалов">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`tab-trigger ${isActive ? "tab-trigger-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {error && <p className="field-error" role="alert">{error}</p>}
      {loading && <p className="tab-panel-meta">Загрузка…</p>}

      {!loading && (
        <>
          <p className="tab-panel-meta">Показано записей: {filtered.length}</p>
          <ul className="material-list">
            {filtered.map((item) => (
              <li key={item.id} className="material-card">
                <article>
                  <h3>{item.title}</h3>
                  <p className="material-meta">
                    <span className="material-type">{materialTypeToLabel(item.type)}</span>
                    <span>{item.pages} стр.</span>
                    <span>{item.completed ? "Завершено" : "В процессе"}</span>
                  </p>
                  {!item.completed && (
                    <button
                      type="button"
                      className="btn-ghost"
                      disabled={completingId === item.id}
                      onClick={() => void onComplete(item.id)}
                    >
                      {completingId === item.id ? "Сохранение…" : "Отметить прочитанным"}
                    </button>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
