import type { MaterialTypeApi } from "./types";

export type MaterialTypeLabel = "Статья" | "Книга" | "Учебный материал";

const typeToLabel: Record<MaterialTypeApi, MaterialTypeLabel> = {
  ARTICLE: "Статья",
  BOOK: "Книга",
  COURSE: "Учебный материал",
};

const labelToType: Record<MaterialTypeLabel, MaterialTypeApi> = {
  Статья: "ARTICLE",
  Книга: "BOOK",
  "Учебный материал": "COURSE",
};

export function materialTypeToLabel(type: MaterialTypeApi): MaterialTypeLabel {
  return typeToLabel[type];
}

export function labelToMaterialType(label: string): MaterialTypeApi {
  return labelToType[label as MaterialTypeLabel] ?? "ARTICLE";
}

export const materialTabToType: Record<string, MaterialTypeApi | null> = {
  Все: null,
  Статьи: "ARTICLE",
  Книги: "BOOK",
  Учебные: "COURSE",
};
