import React from 'react';
import { useEffect, useState } from 'react';
import SubHeader from '../../component/shoplist/subHeader';
import Cart from '../../component/shoplist/Cart';
/*import Filters from '../../component/shoplist/Filter';
import Loading from '../../component/shoplist/Loading';*/
import Product from '../../component/shoplist/Product';
import banner from '../../banner.jpg';

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [cart, setCart] = useState([]);

  const [isShowCart, setIsShowCart] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetch('https://phones-dev.herokuapp.com/api/phones');
        const products = await data.json();
        setProducts(products.data);
        setFilters(products.data);
      } catch (err) {}
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
      <div className="flex flex-wrap my-4 container mx-auto">
        {products.map((product) => (
          <Product
            handleAddToCart={handleAddToCart}
            key={product.id}
            product={product}
          />
        ))}
      </div>
      {isShowCart && (
        <Cart
          cart={cart}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddToCart={handleAddToCart}
          setIsShowCart={setIsShowCart}
        />
      )}
    </div>
  );
};
export default ShopList;
