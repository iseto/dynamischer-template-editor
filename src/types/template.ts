export interface Variable {
  key: string;
  label: string;
  value: string;
}
export interface Draft {
  title: string;
  html: string;
  variables: Variable[];
}
export interface StudioTemplate extends Draft {
  id: string;
  category: string;
  description: string;
  icon: "brief" | "case" | "resume" | "blank";
}
export interface StudioState {
  selected: string;
  drafts: Record<string, Draft>;
}
