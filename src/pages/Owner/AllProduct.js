import React from 'react';
import { GET_PRODUCTS } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Product from './Product.js';

// get all products
function AllProducts() {
  const { error, data, loading } = useQuery(GET_PRODUCTS);
  console.log({ error, data, loading });
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong </div>;
  return (
    <div>
      <div>
        <Link to="/new_product">
          <div>
            <button className="text-2xl font-semibold text-brown -ml-40 mt-4 border-2 rounded-md px-3 py-1 bg-green-300 hover:text-gray-500">
              Add New
            </button>
          </div>
        </Link>
      </div>
      <div className="flex flex-wrap justify-around -mr-40 ml-10">
        {data.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
