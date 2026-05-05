export type MaterialType = "Статья" | "Книга" | "Учебный материал";

export type ReadingItem = {
  id: number;
  title: string;
  type: MaterialType;
  pages: number;
  completed: boolean;
};

export const readingItems: ReadingItem[] = [
  { id: 1, title: "React Patterns", type: "Статья", pages: 14, completed: true },
  { id: 2, title: "Чистый код", type: "Книга", pages: 22, completed: false },
  { id: 3, title: "Алгоритмы: графы", type: "Учебный материал", pages: 18, completed: false },
  { id: 4, title: "TypeScript Narrowing", type: "Статья", pages: 10, completed: true },
];
