import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product, handleAddToCart }) => {
  const DollarUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className=" flex-1 flex flex-col self-stretch items-center min-w-[250px] px-2 mr-2 mb-2 rounded-lg">
      <div className="w-[100px]">
        <img
          className="w-full h-full"
          src={product.pictures}
          alt={product.name}
        />
      </div>
      <h3 className="text-gray-600">
        <Link to={{ pathname: `/shoplist/${product.id}` }}>{product.name}</Link>
      </h3>

      <p className="text-gray-900 font-bold">
        {DollarUsd.format(product.price)}
      </p>
      <button
        onClick={() => handleAddToCart(product)}
        className="bg-white text-orange-600 rounded-lg underline hover:bg-white hover:text-gray-600"
      >
        Add to card
      </button>
    </div>
  );
};

export default Product;
