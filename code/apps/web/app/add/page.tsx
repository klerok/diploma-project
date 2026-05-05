import { AddMaterialForm } from "../components/add-material-form";

export default function AddPage() {
  return (
    <main className="main-area">
      <section className="container">
        <h2 className="page-title">Добавление материала</h2>
        <p className="lead">
          Страница для добавления новых материалов в библиотеку.
        </p>
      </section>
      <AddMaterialForm />
    </main>
  );
}
