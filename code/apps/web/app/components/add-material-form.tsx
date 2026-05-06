"use client";

import { useState } from "react";
import styles from "./add-material-form.module.css";

type Errors = {
  title?: string;
  pages?: string;
  link?: string;
};

export function AddMaterialForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Статья");
  const [pages, setPages] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const nextErrors: Errors = {};

    if (title.trim().length < 3) {
      nextErrors.title = "Название должно содержать минимум 3 символа.";
    }

    const parsedPages = Number(pages);
    if (!Number.isFinite(parsedPages) || parsedPages < 1 || parsedPages > 500) {
      nextErrors.pages = "Количество страниц должно быть от 1 до 500.";
    }

    if (link.trim()) {
      try {
        const url = new URL(link);
        if (!["http:", "https:"].includes(url.protocol)) {
          nextErrors.link = "Ссылка должна начинаться с http:// или https://.";
        }
      } catch {
        nextErrors.link = "Введите корректную ссылку.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      setIsSuccess(false);
      return;
    }

    setIsSuccess(true);
    setTitle("");
    setPages("");
    setLink("");
    setType("Статья");
  };

  return (
    <form className={`container ${styles.stackForm}`} onSubmit={onSubmit} noValidate>
      <h2>Добавить материал</h2>

      <div className={styles.formRow}>
        <label htmlFor="material-title">Название</label>
        <input
          id="material-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Например: Глава по SQL"
        />
        {errors.title && <p className={styles.fieldError} role="alert">{errors.title}</p>}
      </div>

      <div className={styles.formRow}>
        <label htmlFor="material-type">Тип контента</label>
        <select id="material-type" value={type} onChange={(event) => setType(event.target.value)}>
          <option>Статья</option>
          <option>Книга</option>
          <option>Учебный материал</option>
        </select>
      </div>

      <div className={styles.formRow}>
        <label htmlFor="material-pages">Страниц / экранов</label>
        <input
          id="material-pages"
          type="number"
          min={1}
          max={500}
          value={pages}
          onChange={(event) => setPages(event.target.value)}
          placeholder="1-500"
        />
        {errors.pages && <p className={styles.fieldError} role="alert">{errors.pages}</p>}
      </div>

      <div className={styles.formRow}>
        <label htmlFor="material-link">Ссылка (необязательно)</label>
        <input
          id="material-link"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://example.com"
        />
        {errors.link && <p className={styles.fieldError} role="alert">{errors.link}</p>}
      </div>

      <button type="submit" className={styles.btnPrimary}>Сохранить материал</button>
      {isSuccess && <p className={styles.formSuccess}>Материал добавлен в трекер (демо-режим).</p>}
    </form>
  );
}
