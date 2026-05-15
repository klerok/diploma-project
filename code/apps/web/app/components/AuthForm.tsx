"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { login, register } from "../lib/api";
import { saveAuthSession } from "../lib/auth";

type Mode = "login" | "register";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "register") {
      setMode("register");
    }
  }, [searchParams]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result =
        mode === "login"
          ? await login(email.trim(), password)
          : await register(email.trim(), password, nickname.trim());

      saveAuthSession(result.accessToken);

      const redirectTo = searchParams.get("from") || "/";
      router.push(redirectTo);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>
      <p className="lead">
        {mode === "login"
          ? "Войдите, чтобы видеть свой прогресс и материалы."
          : "Создайте аккаунт для отслеживания чтения и квестов."}
      </p>

      <div className="tablist tablist-secondary auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={`tab-trigger ${mode === "login" ? "tab-trigger-active" : ""}`}
          onClick={() => setMode("login")}
        >
          Вход
        </button>
        <button
          type="button"
          role="tab"
          className={`tab-trigger ${mode === "register" ? "tab-trigger-active" : ""}`}
          onClick={() => setMode("register")}
        >
          Регистрация
        </button>
      </div>

      <form className="stack-form" onSubmit={onSubmit} noValidate>
        {mode === "register" && (
          <div className="form-row">
            <label htmlFor="auth-nickname">Никнейм</label>
            <input
              id="auth-nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="reader_nick"
              required
              minLength={2}
            />
          </div>
        )}

        <div className="form-row">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="auth-password">Пароль</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "минимум 6 символов" : ""}
            required
            minLength={mode === "register" ? 6 : 1}
          />
        </div>

        {error && <p className="field-error" role="alert">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Подождите…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>

    </div>
  );
}
