import React from 'react';
import { useEffect, useState } from 'react';
// import SubHeader from '../../component/shoplist/subHeader';
import Cart from '../../component/shoplist/Cart';
import Filters from '../../component/shoplist/Filters';
import Loading from '../../component/shoplist/Loading';
import Product from '../../component/shoplist/Product';
import banner from '../../banner.jpg';
import MainLayout from '../../layout/MainLayout';
import { useStore } from '../../store/hooks';
import { addToCart } from '../../store/actions';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../graphql/queries';

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [cart, setCart] = useState([]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activePrice, setActivePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useStore();
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  console.log('DATA', data);
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong </div>;

  const handleAddToCart = (product) => {
    if (product.sizes.length > 1 || product.colors.length > 1) {
      alert('Please select size and color on product detail page');
      return;
    }
    dispatch(addToCart(product));
  };

  return (
    <>
      <MainLayout>
        <div className="mb-10">
          <img src={banner} alt="banner" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          <div className="ml-auto relative col-span-1 w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto	">
            <Filters
              products={data.products}
              setFilters={setFilters}
              setActivePrice={setActivePrice}
              activePrice={activePrice}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>

          <div className="flex flex-wrap my-4 container mx-auto col-span-4">
            {filters.map((product) => (
              <Product
                handleAddToCart={handleAddToCart}
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
        {/* {isShowCart && (
          <Cart
            cart={cart}
            handleRemoveFromCart={handleRemoveFromCart}
            handleAddToCart={handleAddToCart}
            setIsShowCart={setIsShowCart}
          />
        )} */}
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        )}
      </MainLayout>
    </>
  );
};
export default ShopList;
