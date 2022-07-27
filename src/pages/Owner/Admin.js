import React from 'react';
import MainLayout from '../../layout/MainLayout';
import { GET_PRODUCT, DELETE_PRODUCT } from '../../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';


function Product({ product }) {
  const [deleteProduct, { data, loading, error }] = useMutation(
    DELETE_PRODUCT,
    {
      variables: { removeProductId: product.id },
    }
  );
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong {error.message} </div>;
  const handleEdit = async () => {
    alert('Editing', product.name);
  };

  return (
    <div className="product">
      <h2>{product.name}</h2>
      <h3>{product.price}</h3>
      <h3>{product.stock}</h3>
      <button
        onClick={(e) => {
          e.preventDefault();
          deleteProduct();
        }}
      >
        Remove
      </button>
      <button onClick={handleEdit}>Edit</button>
      <br />
    </div>
  );
  // onclick -> route to edit
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
