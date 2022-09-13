import React, { FC } from 'react';
import {
  HashRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import 'bulma';
import { BooksProvider } from './components/BooksContext';
import { Dashboard } from './components/Dashboard';
import { NotFoundPage } from './components/NotFoundPage';
import { NewBookForm } from './components/NewBookForm';

export const App: FC = () => {
  return (
    <BooksProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="/books/edit">
            <Route index element={<NewBookForm />} />
            <Route path=":bookId" element={<NewBookForm />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </BooksProvider>
  );
};
