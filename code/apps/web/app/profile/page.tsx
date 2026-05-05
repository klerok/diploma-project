import { ProfileTabs } from "../components/profile-tabs";

export default function ProfilePage() {
  return (
    <main className="main-area">
      <section className="container">
        <h2 className="page-title">Профиль</h2>
        <p className="lead">
          Страница для просмотра достижений и статистики.
        </p>
      </section>
      <ProfileTabs />
    </main>
  );
}
