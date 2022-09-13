import { FC, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types/Book';
import { deleteBookById } from '../../api';
import { BooksContext } from '../BooksContext';
import { Loader } from '../Loader';

type Props = {
  currentBook: Book;
};

export const BookRow: FC<Props> = ({ currentBook }) => {
  const {
    id, author, ISBN, title, category,
  } = currentBook;

  const { books, setBooks, setErrorMessage } = useContext(BooksContext);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleDelete = () => {
    setIsLoadingDelete(true);

    deleteBookById(id)
      .then(() => setBooks(books.filter(book => book.id !== id)))
      .catch(() => setErrorMessage('Cannot delete book'))
      .finally(() => setIsLoadingDelete(false));
  };

  return (
    <tr data-cy="person">
      <td>{title}</td>
      <td>{author}</td>
      <td>{category}</td>
      <td>{ISBN}</td>
      <td>
        <div className="buttons">
          <Link className="button is-warning" to={`/books/edit/${id}`}>
            Edit
          </Link>
          <button
            type="button"
            className="button is-danger"
            onClick={handleDelete}
          >
            {isLoadingDelete
              ? <Loader />
              : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
};
