import { Suspense } from "react";
import { AuthForm } from "../components/AuthForm";

export default function LoginPage() {
  return (
    <main className="main-area auth-page">
      <Suspense fallback={<p className="container">Загрузка…</p>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
