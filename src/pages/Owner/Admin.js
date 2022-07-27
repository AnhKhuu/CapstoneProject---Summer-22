import React from 'react';
import MainLayout from '../../layout/MainLayout';
import { GET_PRODUCT, DELETE_PRODUCT } from '../../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import './Admin.css';

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

  const handleEdit = async () => {
    alert('Editing', product.name);
  };

  return (
    <div Id="allproducts">
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
          <button className="btn-group edit" onClick={handleEdit}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// get all products
function AllProducts() {
  const { error, data, loading } = useQuery(GET_PRODUCT);
  console.log({ error, data, loading });
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong </div>;
  return (
    <div className="products">
      {data.products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
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
