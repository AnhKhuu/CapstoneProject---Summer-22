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
    <div className="flex flex-wrap relative w-64 h-auto bg-green-300 overflow-hidden mt-4 mb-4 mr-1 ml-1 rounded-lg">
      <div className="relative w-full flex justify-center items-center pt-5">
        <img src={product.pictures} className="h-60 w-auto" />
      </div>
      <div className="relative p-5 flex justify-center items-center flex-col">
        <h3 className="text-center text-lg text-gray-500 font-bold uppercase">
          {product.name}
        </h3>
        <h2 className="text-2xl text-black font-bold">{product.price}$</h2>
        <h2 className="text-2xl text-black font-bold">
          Stock: {product.stock}
        </h2>
      </div>
      <div className="inline-flex w-18 h-8 bg-transparent space-x-16 rounded-lg mb-4 ml-8">
        <button
          className="w-auto h-10 block items-center py-2 px-3 text-sm font-medium text-center text-white bg-indigo-200 rounded-lg hover:bg-indigo-500 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          onClick={(e) => {
            e.preventDefault();
            deleteProduct();
          }}
        >
          Remove
        </button>
        <Link to={`/edit_product/${product.id}`}>
          <button className="w-auto h-10 block items-center py-2 px-3 text-sm font-medium text-center text-white bg-indigo-200 rounded-lg hover:bg-indigo-500 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
            Edit
          </button>
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
      <div className="flex flex-wrap justify-between">
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
