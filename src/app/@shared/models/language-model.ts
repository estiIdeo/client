export interface LanguageModel {
  id?: number;
  name: string;
  languageCulture: string;
  rtl: boolean;
  active: boolean;
  displayOrder: number;
  created?: Date;
  updated?: Date;
}
