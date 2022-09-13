import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BooksContext } from '../BooksContext';
import { BooksTable } from '../BooksTable';

export const Dashboard: FC = () => {
  const { books, errorMessage } = useContext(BooksContext);

  return (
    <>
      <h1 className="is-size-1 m-4 has-text-centered has-text-primary">Books Dashboard</h1>
      <div className="block">
        <div className="box table-container">
          {errorMessage && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!errorMessage && (
            <div
              className="inputs-block is-flex is-flex-direction-column m-auto"
              style={{ maxWidth: '300px' }}
            >
              <Link
                className="button is-primary is-rounded m-2"
                to="/books/edit"
              >
                Add a new book
              </Link>
            </div>
          )}

          {!errorMessage && books.length === 0 && (
            <p data-cy="noPeopleMessage">
              There are no books on the server
            </p>
          )}

          {books.length > 0 && <BooksTable books={books} />}
        </div>
      </div>
    </>
  );
};
