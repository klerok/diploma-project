import { AddMaterialForm } from "../components/AddMaterialForm";
import { AuthGate } from "../components/AuthGate";

export default function AddPage() {
  return (
    <main className="main-area">
      <section className="container">
        <h2 className="page-title">Добавление материала</h2>
        <p className="lead">
          Страница для добавления новых материалов в библиотеку.
        </p>
      </section>
      <AuthGate>
        <AddMaterialForm />
      </AuthGate>
    </main>
  );
}
