import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="container-fluid py-3">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
