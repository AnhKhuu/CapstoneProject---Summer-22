import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Checkout from '../pages/Checkout/Checkout';
import Main from '../pages/Main';
import ShopList from '../pages/ShopList/index';
import ProductProperty from '../pages/ShopList/ProductProperty';

export default function MyRoute() {
  return (
    <Router>
      <Routes>
        <Route exact path="/checkout" element={<Checkout />}></Route>
      </Routes>
      <Routes>
        <Route exact path="/shoplist" element={<ShopList />}></Route>
      </Routes>
      <Routes>
        <Route
          path="/shoplist/:productId"
          element={<ProductProperty />}
        ></Route>
      </Routes>

      <Routes>
        <Route exact path="/" element={<Main />}></Route>
      </Routes>
    </Router>
  );
}
