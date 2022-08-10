import React from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container px-64 min-h-screen flex flex-col justify-center">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
