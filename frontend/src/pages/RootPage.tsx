import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';

export const RootPage: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1 py-4 d-flex flex-column align-items-center justify-content-center">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
