import React from 'react';
import MainLayout from '../../layout/MainLayout';
import { GET_PRODUCTS } from '../../graphql/queries';
import { DELETE_PRODUCT, EDIT_PRODUCT } from '../../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import ProductForm from './ProductForm';

function Product({ product }) {
  const [deleteProduct, { data, loading, error }] = useMutation(
    DELETE_PRODUCT,
    {
      variables: { removeProductId: product.id },
    }
  );
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong {error.message} </div>;
  if (data) {
    // alert(JSON.stringify(data))
    return;
  }

  const handleEdit = async () => {};

  return (
    <div className="product-card">
      <div className="imgBox">
        <img src={product.pictures} className="img" />
      </div>
      <div className="contentBox">
        <h3>{product.name}</h3>
        <h2>{product.price}$</h2>
        <h2>Stock: {product.stock}</h2>
      </div>
      <div className="btn-group">
        <button
          className="btn-group remove"
          onClick={(e) => {
            e.preventDefault();
            deleteProduct();
          }}
        >
          Remove
        </button>
        <Link to={`/edit_product/${product.id}`}>
          <button type="button">Edit</button>
        </Link>
      </div>
    </div>
  );
}

// get all products
function AllProducts() {
  const { error, data, loading } = useQuery(GET_PRODUCTS);
  console.log({ error, data, loading });
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong </div>;
  return (
    <div>
      <div className="all-products" id="all-products">
        {data.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
// button: add new product -> route to new

function Admin() {
  return (
    <MainLayout>
      <AllProducts />
    </MainLayout>
  );
}

export default Admin;
