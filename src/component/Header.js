import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/hooks';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Cart from './shoplist/Cart';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [state, dispatch] = useStore();
  const { addToCartItems } = state;
  const [isShowCart, setIsShowCart] = useState(false);
  const location = useLocation();
  return (
    <div>
      <nav className="h-28 w-full flex bg-[#FDF4EF] px-64 items-center justify-between">
        <img src="/images/logoImg.png" className="h-20"></img>
        <div
          className="relative"
          onClick={() => addToCartItems.length > 0 && setIsShowCart(true)}
        >
          {location.pathname !== '/checkout' ? (
            <div>
              <AiOutlineShoppingCart className="text-[24px]" />
              {addToCartItems.length > 0 && (
                <span className="bg-blue-700 text-white w-5 h-5 rounded-full absolute -top-4 left-2 text-center leading-5 ">
                  {addToCartItems.length}
                </span>
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      </nav>
      {isShowCart && (
        <Cart cart={addToCartItems} setIsShowCart={setIsShowCart} />
      )}
    </div>
  );
};

export default Header;
