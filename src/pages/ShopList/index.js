import React from 'react';
import { useEffect, useState } from 'react';
import SubHeader from '../../component/shoplist/subHeader';
import Cart from '../../component/shoplist/Cart';
import Filters from '../../component/shoplist/Filters';
import Loading from '../../component/shoplist/Loading';
import Product from '../../component/shoplist/Product';
import banner from '../../banner.jpg';

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [cart, setCart] = useState([]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activePrice, setActivePrice] = useState('');
  const [isShowCart, setIsShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetch('https://phones-dev.herokuapp.com/api/phones');
        const products = await data.json();

        setProducts(products.data);
        setFilters(products.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  console.log(products);

  //Handle Add to Cart
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const findProductInCart = prev.find((item) => item.id === product.id);

      if (findProductInCart) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, amount: item.amount + 1 } : item
        );
      }

      //Firt
      return [...prev, { ...product, amount: 1 }];
    });
  };

  //Handle Remove from cart
  const handleRemoveFromCart = (id) => {
    setCart((prev) => {
      return prev.reduce((cal, item) => {
        if (item.id === id) {
          if (item.amount === 1) return cal;

          return [...cal, { ...item, amount: item.amount - 1 }];
        }

        return [...cal, { ...item }];
      }, []);
    });
  };

  return (
    <div>
      <div className="bg-amber-50">
        <SubHeader cart={cart} setIsShowCart={setIsShowCart} />
      </div>
      <div className="mb-10">
        <img src={banner} alt="banner" />
      </div>
      <div className="grid grid-cols-5 gap-3">
        <div className="ml-auto relative col-span-1 w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto	">
          <Filters
            products={products}
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
      {isShowCart && (
        <Cart
          cart={cart}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddToCart={handleAddToCart}
          setIsShowCart={setIsShowCart}
        />
      )}
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
};
export default ShopList;
