"use client";

import { useMemo, useState } from "react";
import { readingItems } from "../lib/reading-data";
import styles from "./material-tabs.module.css";

const tabs = ["Все", "Статьи", "Книги", "Учебные"] as const;
type Tab = (typeof tabs)[number];

const tabToType = {
  Все: null,
  Статьи: "Статья",
  Книги: "Книга",
  Учебные: "Учебный материал",
} as const;

export function MaterialTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Все");

  const filtered = useMemo(() => {
    const targetType = tabToType[activeTab];
    if (!targetType) {
      return readingItems;
    }
    return readingItems.filter((item) => item.type === targetType);
  }, [activeTab]);

  return (
    <section className="container" aria-labelledby="materials-title">
      <h2 id="materials-title">Материалы для чтения</h2>
      <div className={styles.tablist} role="tablist" aria-label="Фильтр материалов">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tabTrigger} ${isActive ? styles.tabTriggerActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <p className={styles.tabPanelMeta}>Показано записей: {filtered.length}</p>
      <ul className={styles.materialList}>
        {filtered.map((item) => (
          <li key={item.id} className={styles.materialCard}>
            <article>
              <h3>{item.title}</h3>
              <p className={styles.materialMeta}>
                <span className={styles.materialType}>{item.type}</span>
                <span>{item.pages} стр.</span>
                <span>{item.completed ? "Завершено" : "В процессе"}</span>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
