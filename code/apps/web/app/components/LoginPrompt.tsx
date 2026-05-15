import Link from "next/link";

const sectionLabels: Record<string, string> = {
  "/": "дашборд прогресса",
  "/materials": "библиотеку материалов",
  "/add": "добавление материалов",
  "/quests": "квесты",
  "/profile": "профиль",
};

type LoginPromptProps = {
  from?: string;
};

export function LoginPrompt({ from = "/" }: LoginPromptProps) {
  const section = sectionLabels[from] ?? "этот раздел";
  const loginHref = `/login?from=${encodeURIComponent(from)}`;

  return (
    <section className="auth-prompt" aria-labelledby="auth-prompt-title">
      <h3 id="auth-prompt-title">Требуется вход</h3>
      <p className="lead">
        Войдите в аккаунт или зарегистрируйтесь, чтобы открыть {section}.
      </p>
      <div className="actions-row">
        <Link href={loginHref} className="btn-primary">
          Войти в аккаунт
        </Link>
        <Link href={`${loginHref}&mode=register`} className="btn-ghost">
          Создать аккаунт
        </Link>
      </div>
    </section>
  );
}
