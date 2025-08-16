export interface IChapter {
  id: string;
  title: string;
  author: string;
  timestamp: number;
  content: string;
}

export type SortBy = "timestamp" | "author";
