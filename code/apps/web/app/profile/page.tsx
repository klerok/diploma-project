import { AuthGate } from "../components/AuthGate";
import { ProfileTabs } from "../components/ProfileTabs";

export default function ProfilePage() {
  return (
    <main className="main-area">
      <section className="container">
        <h2 className="page-title">Профиль</h2>
        <p className="lead">
          Страница для просмотра достижений и статистики.
        </p>
      </section>
      <AuthGate>
        <ProfileTabs />
      </AuthGate>
    </main>
  );
}
