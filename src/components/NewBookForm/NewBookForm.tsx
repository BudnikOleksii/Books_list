/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  FC, FormEvent, useContext, useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BooksContext } from '../BooksContext';
import './NewBookForm.scss';
import { addBook, editBookById } from '../../api';
import { Loader } from '../Loader';
import { Book } from '../../types/Book';

const defaultBook = {
  title: '',
  author: '',
  category: '',
  ISBN: 0,
};

const categories = ['Novel', 'Fantasy', 'History', 'Romance', 'Comics'];

export const NewBookForm: FC = () => {
  const { books, setBooks } = useContext(BooksContext);
  const { bookId } = useParams();

  const bookState = bookId
    ? books.find(book => String(book.id) === bookId) || defaultBook
    : defaultBook;

  const [newBook, setNewBook] = useState(bookState);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleNewBookData = (field: string, value: string | number) => {
    setErrorMessage('');
    setNewBook(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const isValidTextInput = (value: string) => {
    if (/[^a-zA-Z ]/g.test(value)) {
      setErrorMessage('Input text field should contain only letters and spaces');

      return false;
    }

    if (value.length < 4) {
      setErrorMessage('Input text field should contain more than 4 letters');

      return false;
    }

    return true;
  };

  const isValidForm = () => {
    return isValidTextInput(newBook.title) && isValidTextInput(newBook.author);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!isValidForm()) {
      return;
    }

    setIsLoading(true);

    let request: Promise<Book>;

    if (bookId) {
      request = editBookById(bookId, {
        ...newBook,
        id: bookId,
      });
    } else {
      request = addBook(newBook);
    }

    request
      .then(response => {
        if (bookId) {
          setBooks(books.map(book => (
            book.id === bookId ? response : book
          )));
        } else {
          setBooks([...books, response]);
        }

        setNewBook(bookState);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
          navigate('/');
        }, 1000);
      })
      .catch(setErrorMessage)
      .finally(() => setIsLoading(false));
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {isLoading && (<Loader />)}
      {errorMessage && (
        <div className="notification  is-danger">
          {errorMessage}
        </div>
      )}

      {isSuccess && (
        <div className="notification  is-success">
          Book was successfully added
        </div>
      )}

      <label className="field">
        Title:
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(event) => handleNewBookData('title', event.target.value)}
          className="input"
          required
        />
      </label>

      <label className="field">
        Author:
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(event) => handleNewBookData('author', event.target.value)}
          className="input"
          required
        />
      </label>

      <label className="field">
        Category:
        <select
          name="cars"
          value={newBook.category}
          onChange={(event) => handleNewBookData('category', event.target.value)}
          className="input"
          required
        >
          <option value="" disabled>Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <label className="field">
        ISBN:
        <input
          type="number"
          placeholder="ISBN"
          value={newBook.ISBN}
          onChange={(event) => handleNewBookData('ISBN', Number(event.target.value))}
          min="0"
          className="input"
          required
        />
      </label>

      <button
        className="button is-primary"
        type="submit"
        disabled={!newBook.title || !newBook.author || !newBook.category || !newBook.ISBN}
      >
        {bookId ? 'Edit a Book' : 'Add a Book'}
      </button>
    </form>
  );
};
