import { FC } from 'react';
import { Book } from '../../types/Book';
import { BookRow } from '../BookRow';

type Props = {
  books: Book[],
};

export const BooksTable: FC<Props> = ({ books }) => {
  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {['Title', 'Author', 'Category', 'ISBN', 'Actions'].map(head => (
            <th key={head}>
              {head}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {books.map(book => (
          <BookRow currentBook={book} key={book.id} />
        ))}
      </tbody>
    </table>
  );
};
