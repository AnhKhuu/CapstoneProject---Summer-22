import React from 'react';
import MainLayout from '../layout/MainLayout';

function Products() {
  return (
    <ul>
      <li>vay</li>
      <li>aoS</li>
      <li>bbc</li>
    </ul>
  );
}

function Admin() {
  return (
    <MainLayout>
      <Products />
    </MainLayout>
  );
}

export default Admin;
