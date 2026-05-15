import { AuthGate } from "../components/AuthGate";
import { MaterialTabs } from "../components/MaterialTabs";

export default function MaterialsPage() {
  return (
    <main className="main-area">
      <section className="container">
        <h2 className="page-title">Библиотека материалов</h2>
        <p className="lead">
          Страница для просмотра и управления материалами.
        </p>
      </section>
      <AuthGate>
        <MaterialTabs />
      </AuthGate>
    </main>
  );
}
