/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  FC, FormEvent, useContext, useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BooksContext } from '../BooksContext';
import './NewBookForm.scss';
import { addBook, editBookById } from '../../api';
import { Loader } from '../Loader';
import { Book } from '../../types/Book';
import classNames from 'classnames';

const defaultBook = {
  title: '',
  author: '',
  category: '',
  ISBN: 0,
};

const categories = ['Novel', 'Fantasy', 'History', 'Romance', 'Comics', 'Biographies', 'Business', 'Technology', 'Cookbooks', 'Travel'];

export const NewBookForm: FC = () => {
  const { books, setBooks } = useContext(BooksContext);
  const { bookId } = useParams();

  const bookState = bookId
    ? books.find(book => String(book.id) === bookId) || defaultBook
    : defaultBook;

  const navigate = useNavigate();
  const [newBook, setNewBook] = useState(bookState);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isAuthorValid, setIsAuthorValid] = useState(true);
  const [isISBNValid, setIsISBNValid] = useState(true);

  const isValidTextInput = (value: string) => {
    if (/[^a-zA-Z ]/g.test(value) || value.length < 4) {
      setErrorMessage('Input text field should contain only letters and spaces and more than 4 letters, ISBN should be valid number');

      return false;
    }

    return true;
  };

  const handleNewBookData = (field: string, value: string | number) => {
    setIsTitleValid(true);
    setIsAuthorValid(true);
    setIsISBNValid(true);
    setErrorMessage('');

    setNewBook(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const isValidForm = () => {
    const isValidTitle = isValidTextInput(newBook.title);
    const isValidAuthor = isValidTextInput(newBook.author);
    const isValidISBN = newBook.ISBN > 0;

    if (!isValidTitle) {
      setIsTitleValid(false);
    }

    if (!isValidAuthor) {
      setIsAuthorValid(false);
    }

    if (!isValidISBN) {
      setIsISBNValid(false);
    }

    return isValidTitle && isValidAuthor && isValidISBN;
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
      <Link
        className="button is-primary is-rounded m-2"
        to="/"
      >
        Return to dashboard
      </Link>

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
          className={classNames('input', {
            'is-danger has-text-danger': !isTitleValid,
          })}
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
          className={classNames('input', {
            'is-danger has-text-danger': !isAuthorValid,
          })}
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
          className={classNames('input', {
            'is-danger has-text-danger': !isISBNValid,
          })}
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
