export type Id = number | string;

export interface Book {
  id: Id;
  title: string;
  author: string;
  category: string;
  ISBN: number;
}

export type NewBook = Omit<Book, 'id'>;
