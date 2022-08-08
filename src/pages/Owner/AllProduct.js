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
      <div className="w-64 flex  flex-col text-gray-400 text-normal font-normal text-left uppercase m-1 ml-4">
        <Link to="/new_product">
          <div>
            <button className="text-2xl -ml-40 mt-10 bg-yellow-300 text-gray-600 font-bold block text-center cursor-pointer">
              Add New
            </button>
          </div>
        </Link>
      </div>
      <div className="flex flex-wrap justify-between -mt-20 -mr-40 ml-10">
        {data.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
