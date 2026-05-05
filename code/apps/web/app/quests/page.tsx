import { QuestList } from "../components/quest-list";

export default function QuestsPage() {
  return (
    <main className="main-area">
      <section className="container">
        <h2 className="page-title">Квесты и активности</h2>
        <p className="lead">
          Страница для просмотра и управления квестами и активностями.
        </p>
      </section>
      <QuestList />
    </main>
  );
}
