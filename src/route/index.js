import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Checkout from '../pages/Checkout/Checkout';
import Admin from '../pages/Owner/Admin';
import ProductForm from '../pages/Owner/ProductForm';

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
        <Route exact path="/admin" element={<Admin />}></Route>
      </Routes>
      <Routes>
        <Route exact path="/new_product" element={<ProductForm />}></Route>
      </Routes>
      <Routes>
        <Route exact path="/" element={<Main />}></Route>
      </Routes>
      <Routes>
        <Route path="/edit_product/:pid" element={<ProductForm />} />
      </Routes>
    </Router>
  );
}
