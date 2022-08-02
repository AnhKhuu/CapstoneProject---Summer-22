import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import { useStore } from '../../store/hooks';
import { addToCart } from '../../store/actions';

const ProductProperty = () => {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [state, dispatch] = useStore();
  const [thisProduct, setThisProduct] = useState({});
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetch('https://phones-dev.herokuapp.com/api/phones');
        const listProducts = await data.json();
        setProducts(listProducts.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchProducts();
    setThisProduct(products.find((product) => product.id == productId));
  }, [products, productId]);
  console.log(thisProduct);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  return (
    <MainLayout>
      <div>
        <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
          {thisProduct && (
            <img
              className="w-full h-full"
              src={thisProduct.img}
              alt={thisProduct.name}
            />
          )}
          <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
            <div className="border-b border-gray-200 pb-6">
              {thisProduct && (
                <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6leading-7 text-gray-800 mt-2">
                  {thisProduct.name}
                </h1>
              )}
            </div>
            <div className="py-4 border-b border-gray-200 flex items-center justify-between">
              <p className="text-base leading-4 text-gray-800">Colors</p>
              <div className="flex items-center justify-center">
                <p className="text-sm leading-none text-gray-600">
                  Smoke Blue with red accents
                </p>
                <div className="w-6 h-6 bg-gradient-to from-gray-900 to-indigo-500 ml-3 mr-4 cursor-pointer"></div>
                <svg
                  className="cursor-pointer"
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L1 9"
                    stroke="#4B5563"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="py-4 border-b border-gray-200 flex items-center justify-between">
              <p className="text-base leading-4 text-gray-800">Size</p>
              <div className="flex items-center justify-center">
                <p className="text-sm leading-none text-gray-600 mr-3">38.2</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-6">
              {thisProduct && (
                <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6leading-7 text-gray-800 mt-2">
                  ${thisProduct.price}
                </h1>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(thisProduct)}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
						text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700"
            >
              <svg
                className="mr-3"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductProperty;
