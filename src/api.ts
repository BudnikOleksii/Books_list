import { Book, Id, NewBook } from './types/Book';
import { client, ENDPOINTS } from './utils/fetchClient';

export const getBooks = (): Promise<Book[]> => {
  return client.get<Book[]>(ENDPOINTS.books);
};

export const addBook = (book: NewBook): Promise<Book> => {
  return client.post<Book>(ENDPOINTS.books, book);
};

export const editBookById = (id: Id, book: Book): Promise<Book> => {
  return client.patch<Book>(ENDPOINTS.bookById(id), book);
};

export const deleteBookById = (id: Id) => {
  return client.delete(ENDPOINTS.bookById(id));
};
