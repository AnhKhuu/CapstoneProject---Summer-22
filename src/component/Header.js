import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/hooks';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPhoneCall } from 'react-icons/bi';
import Cart from './shoplist/Cart';

const Header = () => {
  const [state, dispatch] = useStore();
  const { addToCartItems } = state;
  const [isShowCart, setIsShowCart] = useState(false);

  return (
    <div>
      <nav className="h-28 w-full flex bg-slate-400">
        <div className="flex items-center">
          <div className="flex items-center">
            <Link to="/admin">Admin</Link>
            <Link to="/checkout">Checkout</Link>
            <BiPhoneCall className="text-[20px] mr-2" />
            <div>
              <p>Call to buy</p>
            </div>
          </div>
          <div
            className="relative mx-2"
            onClick={() => addToCartItems.length > 0 && setIsShowCart(true)}
          >
            <AiOutlineShoppingCart className="text-[24px]" />
            {addToCartItems.length > 0 && (
              <span className="bg-blue-700 text-white w-5 h-5 rounded-full absolute -top-4 left-2 text-center leading-5 ">
                {addToCartItems.length}
              </span>
            )}
          </div>
        </div>
      </nav>
      {isShowCart && (
        <Cart cart={addToCartItems} setIsShowCart={setIsShowCart} />
      )}
    </div>
  );
};

export default Header;
