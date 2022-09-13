import {
  createContext, FC, useEffect, useState,
} from 'react';
import { getBooks } from '../../api';
import { Book } from '../../types/Book';

interface ContextProps {
  books: Book[],
  setBooks: (books: Book[]) => void,
  errorMessage: string,
  setErrorMessage: (errorMessage: string) => void,
}

export const BooksContext = createContext<ContextProps>({
  books: [],
  setBooks: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
});

export const BooksProvider: FC = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(setErrorMessage);
  }, []);

  const contextValue = {
    books,
    setBooks,
    errorMessage,
    setErrorMessage,
  };

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
};
