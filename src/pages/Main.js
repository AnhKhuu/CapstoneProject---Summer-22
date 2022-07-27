import React from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div className="flex">
      <Link to="/admin">Admin</Link>
      <Link to="/customer">Customer</Link>
      <Link to="/checkout">Checkout</Link>
    </div>
  );
};

export default Main;
