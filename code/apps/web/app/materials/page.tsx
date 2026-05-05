import { MaterialTabs } from "../components/material-tabs";

export default function MaterialsPage() {
  return (
    <main className="main-area">
      <section className="container">
        <h2 className="page-title">Библиотека материалов</h2>
        <p className="lead">
          Страница для просмотра и управления материалами.
        </p>
      </section>
      <MaterialTabs />
    </main>
  );
}
