export interface Book {
  title: string;
  author: string;
  description: string;
  price: number;
  key?: string;
  file: string;
  category: string;
  expanded?: boolean;
}
