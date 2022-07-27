import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="h-28 w-full flex bg-slate-400">
      <div className="flex">
        <Link to="/checkout">Checkout</Link>
      </div>
    </nav>
  );
};

export default Header;
